import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from './constants';

/**
 * Middleware de l'application
 * Gère :
 * - Protection des routes du dashboard en fonction du rôle utilisateur
 * - Redirection des utilisateurs non authentifiés
 */

export function middleware(request: NextRequest) {
  // Informations sur la session utilisateur à partir des cookies (à adapter selon l'implémentation d'auth)
  const userSession = request.cookies.get('user-session')?.value;
  
  // Simulation de décodage de session pour récupérer le rôle utilisateur
  // À remplacer par votre logique d'authentification réelle
  const userRole = userSession 
    ? (JSON.parse(decodeURIComponent(userSession)).role as 'enterprise' | 'creator' | 'admin' | undefined)
    : undefined;
  
  const { pathname } = request.nextUrl;
  
  // Protection des routes du dashboard
  if (pathname.startsWith('/dashboard')) {
    // Utilisateur non authentifié
    if (!userSession) {
      return NextResponse.redirect(new URL(ROUTES.AUTH.SIGNIN, request.url));
    }

    // Vérification des accès spécifiques par rôle
    if (pathname.startsWith('/dashboard/enterprise') && userRole !== 'enterprise' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (pathname.startsWith('/dashboard/creator') && userRole !== 'creator' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Les routes d'authentification ne sont pas accessibles si déjà connecté
  if ((pathname === ROUTES.AUTH.SIGNIN || pathname === ROUTES.AUTH.SIGNUP) && userSession) {
    // Redirection en fonction du rôle
    if (userRole === 'enterprise') {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD.ENTERPRISE.ROOT, request.url));
    }
    if (userRole === 'creator') {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD.CREATOR.ROOT, request.url));
    }
    // Par défaut, redirection vers la page d'accueil
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configuration : sur quelles routes le middleware sera déclenché
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/signin',
    '/signup',
  ]
};
