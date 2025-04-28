import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from './constants';

/**
 * Middleware amélioré pour éviter les boucles de redirection
 * et gérer correctement la déconnexion
 */
export function middleware(request: NextRequest) {
  // Récupération des cookies de session
  const userSession = request.cookies.get('user-session')?.value;
  const supabaseAuthSession = request.cookies.get('supabase-auth-token')?.value;
  
  // Validation renforcée de la session
  let isValidSession = false;
  let userId = undefined;
  let userRole = undefined;
  
  // Une session est valide seulement si nous avons à la fois le cookie user-session et supabase-auth-token
  if (userSession && supabaseAuthSession) {
    try {
      // Vérifier que le cookie de session est bien formé
      const sessionData = JSON.parse(decodeURIComponent(userSession));
      
      // Vérifier que les données essentielles sont présentes
      if (sessionData && sessionData.id) {
        userId = sessionData.id;
        userRole = sessionData.role;
        isValidSession = true;
        
        // Vérifier également que le token Supabase est valide (format de base)
        // Note: une validation complète nécessiterait de vérifier via l'API Supabase
        if (!supabaseAuthSession.includes('.')) {
          isValidSession = false;
        }
      }
    } catch (error) {
      console.error('Erreur de validation du cookie de session:', error);
      isValidSession = false;
    }
  }
  
  const { pathname } = request.nextUrl;
  
  // Protection des routes du dashboard
  if (pathname.startsWith('/dashboard')) {
    // Utilisateur non authentifié ou session invalide
    if (!isValidSession || !userId) {
      console.log('Utilisateur non authentifié redirection vers:', ROUTES.AUTH.SIGNIN);
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
  if ((pathname.includes('/signin') || pathname.includes('/signup')) && userId) {
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
    '/signup'
  ]
};
