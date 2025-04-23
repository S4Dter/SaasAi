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
  
  // Décodage de session pour récupérer l'ID utilisateur
  // Le rôle est récupéré depuis la base de données dans RoleBasedRedirect
  const userId = userSession 
    ? JSON.parse(decodeURIComponent(userSession)).id
    : undefined;
  
  const { pathname } = request.nextUrl;
  
  // Protection des routes du dashboard
  if (pathname.startsWith('/dashboard')) {
    // Utilisateur non authentifié
    if (!userSession) {
      return NextResponse.redirect(new URL(ROUTES.AUTH.SIGNIN, request.url));
    }

    // Note: La vérification des rôles spécifiques est maintenant gérée côté client
    // dans le composant RoleBasedRedirect, qui consulte directement la base de données
    // pour obtenir le rôle à jour de l'utilisateur
  }

  // Les routes d'authentification ne sont pas accessibles si déjà connecté
  // La redirection basée sur le rôle est maintenant gérée par le composant RoleBasedRedirect
  if ((pathname === ROUTES.AUTH.SIGNIN || pathname === ROUTES.AUTH.SIGNUP) && userSession) {
    // Redirection simple vers la page d'accueil, le composant RoleBasedRedirect
    // s'occupera de la redirection spécifique selon le rôle
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
