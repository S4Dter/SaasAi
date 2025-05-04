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
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

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

  const referer = request.headers.get('referer') || '';
  const redirectLoopDetected = referer.includes(pathname) && isProtectedRoute;

  if (redirectLoopDetected) {
    console.warn('Boucle de redirection détectée, on laisse passer');
    return NextResponse.next();
  }

  // 1. Utilisateur non authentifié sur route protégée
  if (isProtectedRoute && !isAuthenticated) {
    url.pathname = ROUTES.AUTH.SIGNIN;
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 2. Utilisateur authentifié sur page d'auth
  if ((pathname === '/signin' || pathname === '/signup') && isAuthenticated) {
    const dashboardPath = userRole === 'creator'
      ? ROUTES.DASHBOARD.CREATOR.ROOT
      : ROUTES.DASHBOARD.ENTERPRISE.ROOT;

    url.pathname = dashboardPath;
    return NextResponse.redirect(url);
  }

  // 3. Vérification de rôle
  if (isAuthenticated && userRole) {
    const isCreatorRoute = ROLE_SPECIFIC_ROUTES.creator.some(route =>
      pathname.startsWith(route)
    );
    const isEnterpriseRoute = ROLE_SPECIFIC_ROUTES.enterprise.some(route =>
      pathname.startsWith(route)
    );

    if (isCreatorRoute && userRole !== 'creator') {
      url.pathname = ROUTES.DASHBOARD.ENTERPRISE.ROOT;
      return NextResponse.redirect(url);
    }

    if (isEnterpriseRoute && userRole !== 'enterprise') {
      url.pathname = ROUTES.DASHBOARD.CREATOR.ROOT;
      return NextResponse.redirect(url);
    }
  }

  // 4. Page de redirection post-login
  if (pathname === '/redirect' && isAuthenticated) {
    url.pathname = userRole === 'creator'
      ? ROUTES.DASHBOARD.CREATOR.ROOT
      : ROUTES.DASHBOARD.ENTERPRISE.ROOT;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/public).*)',
  ]
};
