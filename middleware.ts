import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from './constants';

const PUBLIC_ROUTES = [
  '/', '/signin', '/signup', '/forgot-password', '/reset-password',
  '/agents', '/agents/[id]', '/community', '/pricing',
  '/legal/terms', '/legal/privacy', '/about', '/contact',
  '/auth/callback',
];

const PROTECTED_ROUTE_PREFIXES = ['/dashboard', '/api/protected'];

const ROLE_SPECIFIC_ROUTES = {
  creator: ['/dashboard/creator', '/creator'],
  enterprise: ['/dashboard/enterprise', '/enterprise'],
  admin: ['/dashboard/admin'],
};

// Définir une liste des pages qui ont déjà leurs propres mécanismes de redirection
// et donc que le middleware ne devrait pas rediriger
const SELF_HANDLING_ROUTES = [
  '/dashboard', 
  '/dashboard/creator', 
  '/dashboard/enterprise',
  '/dashboard/admin'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // Vérifier si cette route gère elle-même la redirection
  const isSelfHandlingRoute = SELF_HANDLING_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Si la route gère elle-même sa redirection, passer directement
  if (isSelfHandlingRoute) {
    console.log(`Route ${pathname} gère sa propre redirection - skip middleware`);
    return NextResponse.next();
  }

  // Vérifier si cette URL fait partie d'une redirection récente pour éviter les boucles
  const referer = request.headers.get('referer') || '';
  const isRedirectLoop = referer.includes(pathname) || 
                         (referer.includes('/signin') && pathname.includes('/dashboard')) || 
                         (referer.includes('/dashboard') && pathname.includes('/signin'));

  if (isRedirectLoop) {
    console.warn(`🔄 Boucle de redirection détectée: ${referer} -> ${pathname}`);
    console.warn('Interruption de la boucle: on laisse passer');
    
    // En cas de boucle, on laisse passer sans rediriger
    return NextResponse.next();
  }

  // Extraction des infos d'authentification depuis le cookie
  const userSessionCookie = request.cookies.get('user-session')?.value;

  let isAuthenticated = false;
  let userId: string | undefined;
  let userRole: string | undefined;

  if (userSessionCookie) {
    try {
      const sessionData = JSON.parse(decodeURIComponent(userSessionCookie));
      const now = Date.now();
      const maxAge = 7 * 24 * 60 * 60 * 1000;
      const sessionAge = now - sessionData.timestamp;

      if (sessionData?.id && sessionData?.role && sessionAge < maxAge) {
        isAuthenticated = true;
        userId = sessionData.id;
        userRole = sessionData.role;
      } else {
        console.warn('Cookie expiré, suppression et redirection vers login');
        const response = NextResponse.redirect(new URL(ROUTES.AUTH.SIGNIN, request.url));
        response.cookies.delete('user-session');
        return response;
      }
    } catch (error) {
      console.error('Erreur de validation du cookie user-session:', error);
      const response = NextResponse.redirect(new URL(ROUTES.AUTH.SIGNIN, request.url));
      response.cookies.delete('user-session');
      return response;
    }
  }

  const isPublicRoute = PUBLIC_ROUTES.some(route => {
    if (route.includes('[')) {
      const routePattern = new RegExp(`^${route.replace(/\[.*?\]/g, '[^/]+')}$`);
      return routePattern.test(pathname);
    }
    return pathname === route;
  });

  const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some(prefix =>
    pathname.startsWith(prefix)
  );

  // 1. Utilisateur non authentifié sur route protégée
  if (isProtectedRoute && !isAuthenticated) {
    console.log(`Redirection non-auth vers signin depuis ${pathname}`);
    url.pathname = ROUTES.AUTH.SIGNIN;
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 2. Utilisateur authentifié sur page d'auth
  if ((pathname === '/signin' || pathname === '/signup') && isAuthenticated) {
    const dashboardPath = userRole === 'creator'
      ? ROUTES.DASHBOARD.CREATOR.ROOT
      : ROUTES.DASHBOARD.ENTERPRISE.ROOT;

    console.log(`Redirection user auth depuis ${pathname} vers ${dashboardPath}`);
    url.pathname = dashboardPath;
    return NextResponse.redirect(url);
  }

  // 3. Vérification de rôle (uniquement si on est sur une route protégée)
  if (isAuthenticated && userRole && isProtectedRoute) {
    const isCreatorRoute = ROLE_SPECIFIC_ROUTES.creator.some(route =>
      pathname.startsWith(route)
    );
    const isEnterpriseRoute = ROLE_SPECIFIC_ROUTES.enterprise.some(route =>
      pathname.startsWith(route)
    );
    const isAdminRoute = ROLE_SPECIFIC_ROUTES.admin.some(route =>
      pathname.startsWith(route)
    );

    // Routes réservées aux admin
    if (isAdminRoute && userRole !== 'admin') {
      console.log(`Redirection role mismatch: ${userRole} tente d'accéder à une route admin ${pathname}`);
      
      // Rediriger vers le dashboard correspondant au rôle
      const dashboardPath = userRole === 'creator'
        ? ROUTES.DASHBOARD.CREATOR.ROOT
        : ROUTES.DASHBOARD.ENTERPRISE.ROOT;
        
      url.pathname = dashboardPath;
      return NextResponse.redirect(url);
    }

    // Routes réservées aux créateurs
    if (isCreatorRoute && userRole !== 'creator') {
      console.log(`Redirection role mismatch: ${userRole} tente d'accéder à ${pathname}`);
      
      // Les admins peuvent accéder à toutes les routes
      if (userRole === 'admin') {
        return NextResponse.next();
      }
      
      url.pathname = ROUTES.DASHBOARD.ENTERPRISE.ROOT;
      return NextResponse.redirect(url);
    }

    // Routes réservées aux entreprises
    if (isEnterpriseRoute && userRole !== 'enterprise') {
      console.log(`Redirection role mismatch: ${userRole} tente d'accéder à ${pathname}`);
      
      // Les admins peuvent accéder à toutes les routes
      if (userRole === 'admin') {
        return NextResponse.next();
      }
      
      url.pathname = ROUTES.DASHBOARD.CREATOR.ROOT;
      return NextResponse.redirect(url);
    }
  }

  // 4. Page de redirection post-login
  if (pathname === '/redirect' && isAuthenticated) {
    let dashboardPath;
    
    if (userRole === 'admin') {
      dashboardPath = ROUTES.DASHBOARD.ADMIN.ROOT;
    } else if (userRole === 'creator') {
      dashboardPath = ROUTES.DASHBOARD.CREATOR.ROOT;
    } else {
      dashboardPath = ROUTES.DASHBOARD.ENTERPRISE.ROOT;
    }
    
    console.log(`Redirection via /redirect vers ${dashboardPath}`);
    url.pathname = dashboardPath;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/public).*)',
  ]
};
