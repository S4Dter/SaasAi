import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from './constants';

/**
 * Middleware amélioré pour éviter les boucles de redirection
 */
export function middleware(request: NextRequest) {
  // Récupération de la session utilisateur
  const userSession = request.cookies.get('user-session')?.value;
  
  // Décodage de la session
  let userId = undefined;
  let userRole = undefined;
  
  if (userSession) {
    try {
      const sessionData = JSON.parse(decodeURIComponent(userSession));
      userId = sessionData.id;
      // Récupérer le rôle si disponible dans le cookie (ajouté dans la version améliorée)
      userRole = sessionData.role;
    } catch (error) {
      console.error('Erreur de parsing du cookie de session');
    }
  }
  
  const { pathname } = request.nextUrl;
  
  // Protection des routes du dashboard
  if (pathname.startsWith('/dashboard')) {
    // Utilisateur non authentifié
    if (!userId) {
      return NextResponse.redirect(new URL(ROUTES.AUTH.SIGNIN, request.url));
    }
    
    // Vérification des accès spécifiques par rôle
    if (pathname.startsWith('/dashboard/creator') && userRole && userRole !== 'creator') {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD.ENTERPRISE.ROOT, request.url));
    }
    
    if (pathname.startsWith('/dashboard/enterprise') && userRole && userRole !== 'enterprise') {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD.CREATOR.ROOT, request.url));
    }
  }

  // Pages d'authentification - rediriger si déjà connecté
  if ((pathname === ROUTES.AUTH.SIGNIN || pathname === ROUTES.AUTH.SIGNUP) && userId) {
    // Redirection basée sur le rôle si disponible dans le cookie
    if (userRole === 'creator') {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD.CREATOR.ROOT, request.url));
    } else {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD.ENTERPRISE.ROOT, request.url));
    }
  }

  return NextResponse.next();
}

// Configuration des routes qui déclenchent le middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/signin',
    '/signup',
  ]
};