import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from './constants';

/**
 * Configuration des routes publiques et privées
 */
const PUBLIC_ROUTES = [
  '/',                     // Page d'accueil
  '/signin',               // Connexion 
  '/signup',               // Inscription
  '/forgot-password',      // Mot de passe oublié
  '/reset-password',       // Réinitialisation du mot de passe
  '/agents',               // Catalogue d'agents (public)
  '/agents/[id]',          // Détails d'un agent (public)
  '/community',            // Communauté (public)
  '/pricing',              // Tarification (public)
  '/legal/terms',          // Mentions légales
  '/legal/privacy',        // Politique de confidentialité
  '/about',                // À propos
  '/contact',              // Contact
];

// Préfixes des routes qui sont toujours protégées
const PROTECTED_ROUTE_PREFIXES = [
  '/dashboard',            // Toutes les routes du tableau de bord
  '/api/protected',        // API protégées
];

// Routes qui nécessitent des rôles spécifiques
const ROLE_SPECIFIC_ROUTES = {
  creator: [
    '/dashboard/creator',
    '/creator',
  ],
  enterprise: [
    '/dashboard/enterprise',
    '/enterprise',
  ],
};

/**
 * Middleware Next.js 15 pour l'authentification et la redirection
 */
export function middleware(request: NextRequest) {
  // URL courante
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();
  
  // Récupération des cookies de session
  const userSessionCookie = request.cookies.get('user-session')?.value;
  const supabaseAuthCookie = request.cookies.get('sb-auth-token')?.value || 
                             request.cookies.get('supabase-auth-token')?.value;
  
  // État d'authentification
  let isAuthenticated = false;
  let userId: string | undefined;
  let userRole: string | undefined;
  
  // Vérification robuste de l'authentification
  if (userSessionCookie) {
    try {
      // Parse le cookie de session
      const sessionData = JSON.parse(decodeURIComponent(userSessionCookie));
      
      // Vérification complète des données de session
      if (sessionData?.id && sessionData?.role && sessionData?.timestamp) {
        // Vérifier que le timestamp n'est pas expiré (7 jours max)
        const now = Date.now();
        const sessionAge = now - sessionData.timestamp;
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 jours en ms
        
        if (sessionAge < maxAge) {
          isAuthenticated = true;
          userId = sessionData.id;
          userRole = sessionData.role;
        } else {
          console.log('Session expirée');
        }
      }
    } catch (error) {
      console.error('Erreur de validation du cookie de session:', error);
    }
  }
  
  // Journalisation pour le débogage (à supprimer en production)
  console.log(`
    Middleware: ${pathname}
    - Authentifié: ${isAuthenticated}
    - Rôle: ${userRole || 'non défini'}
    - ID utilisateur: ${userId || 'non défini'}
  `);
  
  // 1. Vérifier si la route est publique
  const isPublicRoute = PUBLIC_ROUTES.some(route => {
    // Gestion des routes dynamiques avec [param]
    if (route.includes('[')) {
      const routePattern = new RegExp(
        `^${route.replace(/\[.*?\]/g, '[^/]+')}$`
      );
      return routePattern.test(pathname);
    }
    return pathname === route;
  });
  
  // 2. Vérifier si la route est protégée
  const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some(prefix => 
    pathname.startsWith(prefix)
  );
  
  // 3. Redirection en fonction de l'état d'authentification
  
  // Route protégée mais utilisateur non authentifié
  if (isProtectedRoute && !isAuthenticated) {
    url.pathname = ROUTES.AUTH.SIGNIN;
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // Page d'authentification mais utilisateur déjà connecté
  if ((pathname === '/signin' || pathname === '/signup') && isAuthenticated) {
    const dashboardPath = userRole === 'creator' 
      ? ROUTES.DASHBOARD.CREATOR.ROOT 
      : ROUTES.DASHBOARD.ENTERPRISE.ROOT;
      
    url.pathname = dashboardPath;
    return NextResponse.redirect(url);
  }
  
  // 4. Vérification des accès basés sur les rôles
  if (isAuthenticated && userRole) {
    // Vérifier les routes spécifiques au rôle creator
    const isCreatorRoute = ROLE_SPECIFIC_ROUTES.creator.some(route => 
      pathname.startsWith(route)
    );
    
    // Vérifier les routes spécifiques au rôle enterprise
    const isEnterpriseRoute = ROLE_SPECIFIC_ROUTES.enterprise.some(route => 
      pathname.startsWith(route)
    );
    
    // Redirection si l'utilisateur n'a pas le bon rôle
    if (isCreatorRoute && userRole !== 'creator') {
      url.pathname = ROUTES.DASHBOARD.ENTERPRISE.ROOT;
      return NextResponse.redirect(url);
    }
    
    if (isEnterpriseRoute && userRole !== 'enterprise') {
      url.pathname = ROUTES.DASHBOARD.CREATOR.ROOT;
      return NextResponse.redirect(url);
    }
  }
  
  // 5. Traitement spécial pour la page de redirection intermédiaire
  if (pathname === '/redirect' && isAuthenticated) {
    const dashboardPath = userRole === 'creator' 
      ? ROUTES.DASHBOARD.CREATOR.ROOT 
      : ROUTES.DASHBOARD.ENTERPRISE.ROOT;
      
    url.pathname = dashboardPath;
    return NextResponse.redirect(url);
  }
  
  // Par défaut, permettre la requête
  return NextResponse.next();
}

// Configuration des routes qui déclenchent le middleware
export const config = {
  matcher: [
    // Toutes les routes sauf les ressources statiques et les API publiques
    '/((?!_next/static|_next/image|favicon.ico|api/public).*)',
  ]
};
