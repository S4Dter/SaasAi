import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from '../constants';

/**
 * Middleware optimisé pour Next.js 15 avec App Router
 * - Vérifie les sessions de manière robuste
 * - Empêche les boucles de redirection
 * - Gère les protections de routes basées sur les rôles
 */
export function middleware(request: NextRequest) {
  // URL courante
  const { pathname } = request.nextUrl;
  
  // Création d'un objet pour stocker l'URL de redirection
  const url = request.nextUrl.clone();
  
  // Récupération des cookies de session
  const userSession = request.cookies.get('user-session')?.value;
  const authToken = request.cookies.get('supabase-auth-token')?.value;
  
  // Décider si l'utilisateur est authentifié
  let isAuthenticated = false;
  let userRole = undefined;
  let userId = undefined;
  
  // Vérification robuste de l'authentification
  if (userSession && authToken) {
    try {
      // Vérifier que le format du cookie est valide
      const sessionData = JSON.parse(decodeURIComponent(userSession));
      
      // Vérifier que les données essentielles sont présentes
      if (sessionData?.id && sessionData?.role && sessionData?.timestamp) {
        // Vérifier que le timestamp n'est pas expiré (7 jours max)
        const now = Date.now();
        const sessionTime = sessionData.timestamp;
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 jours en ms
        
        if (now - sessionTime < maxAge) {
          isAuthenticated = true;
          userId = sessionData.id;
          userRole = sessionData.role;
        }
      }
    } catch (error) {
      console.error('Erreur de validation du cookie:', error);
      isAuthenticated = false;
    }
  }
  
  // Journalisation pour le débogage (à supprimer en production)
  console.log(`
    Middleware: ${pathname}
    - Authentifié: ${isAuthenticated}
    - Rôle: ${userRole || 'non défini'}
    - Cookies: ${!!userSession}, ${!!authToken}
  `);
  
  // RÈGLES DE REDIRECTION
  
  // 1. Protection des routes du dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion + URL de retour
      url.pathname = ROUTES.AUTH.SIGNIN;
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    
    // Vérification des accès spécifiques par rôle
    if (pathname.startsWith('/dashboard/creator') && userRole !== 'creator') {
      url.pathname = ROUTES.DASHBOARD.ENTERPRISE.ROOT;
      return NextResponse.redirect(url);
    }
    
    if (pathname.startsWith('/dashboard/enterprise') && userRole !== 'enterprise') {
      url.pathname = ROUTES.DASHBOARD.CREATOR.ROOT;
      return NextResponse.redirect(url);
    }
  }

  // 2. Redirection automatique si déjà connecté
  if ((pathname === ROUTES.AUTH.SIGNIN || pathname === ROUTES.AUTH.SIGNUP) && isAuthenticated) {
    if (userRole === 'creator') {
      url.pathname = ROUTES.DASHBOARD.CREATOR.ROOT;
      return NextResponse.redirect(url);
    } else {
      url.pathname = ROUTES.DASHBOARD.ENTERPRISE.ROOT;
      return NextResponse.redirect(url);
    }
  }
  
  // 3. Traitement spécial pour la page de redirection intermédiaire
  if (pathname === '/redirect' && isAuthenticated) {
    if (userRole === 'creator') {
      url.pathname = ROUTES.DASHBOARD.CREATOR.ROOT;
      return NextResponse.redirect(url);
    } else {
      url.pathname = ROUTES.DASHBOARD.ENTERPRISE.ROOT;
      return NextResponse.redirect(url);
    }
  }

  // 4. Protection des routes qui nécessitent un rôle spécifique
  // (Ajoutez d'autres routes à protéger ici selon les besoins)

  // Par défaut, permettre la requête
  return NextResponse.next();
}

// Configuration des routes qui déclenchent le middleware
export const config = {
  matcher: [
    // Routes du dashboard
    '/dashboard/:path*',
    
    // Routes d'authentification
    '/signin',
    '/signup',
    '/forgot-password',
    '/reset-password',
    
    // Page intermédiaire de redirection
    '/redirect',
    
    // Routes spécifiques aux rôles (ajoutez d'autres au besoin)
    '/creator/:path*',
    '/enterprise/:path*'
  ]
};
