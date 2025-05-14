"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Button from '../ui/Button';
import { APP_NAME, ROUTES } from '@/constants';
import { useAuthOptimized } from '@/lib/hooks/useAuthOptimized';
import { signOut } from '@/lib/api/auth';

/**
 * Composant Header pour la navigation principale
 * 
 * Ce composant gère la navigation principale du site et affiche différents liens
 * en fonction de l'authentification et du type d'utilisateur.
 */
const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Utilisation du hook d'authentification pour récupérer l'état de connexion
  const { data: user, loading } = useAuthOptimized();
  
  // Détermine si l'utilisateur est connecté et son rôle
  const isLoggedIn = !!user;
  const userRole = user?.role;
  const userName = user?.name;
  
  // Effet pour s'assurer que le composant est monté côté client
  useEffect(() => {
    setIsClient(true);
    
    // Pour debugging uniquement
    if (typeof window !== 'undefined') {
      console.log('localStorage user:', localStorage.getItem('user'));
      console.log('Session cookie:', document.cookie.includes('user-session'));
    }
  }, []);
  
  // Fonction pour la déconnexion
  const handleSignOut = async () => {
    try {
      // Indiquer le chargement pendant la déconnexion
      setIsLoggingOut(true);
      
      // Nettoyer immédiatement l'état local pour éviter les problèmes d'affichage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('user-id');
        localStorage.removeItem('user-role');
        localStorage.removeItem('user-email');
        localStorage.removeItem('user-name');
        localStorage.removeItem('supabase.auth.token');
        
        // Effacer les cookies
        document.cookie = 'user-session=; path=/; max-age=0; SameSite=Strict';
        document.cookie = 'supabase-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
      
      // Appeler la fonction de déconnexion
      await signOut();
      
      // Forcer une redirection complète vers la page d'accueil
      window.location.href = ROUTES.HOME;
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      setIsLoggingOut(false);
    }
  };
  
  // Ne rien afficher côté serveur pour éviter l'hydratation incorrecte
  // Cela évite les erreurs de mismatch entre serveur et client
  if (!isClient) {
    return (
    <header className="bg-white bg-opacity-100 border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            {/* Logo uniquement au chargement initial */}
            <div className="flex items-center">
              <Link href={ROUTES.HOME} className="flex items-center">
                <span className="text-blue-600 text-2xl font-bold">{APP_NAME}</span>
              </Link>
            </div>
          </nav>
        </div>
      </header>
    );
  }
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Pour déterminer si un lien est actif
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  return (
    <header className="bg-white bg-opacity-100 border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo et nom */}
          <div className="flex items-center">
            <Link href={ROUTES.HOME} className="flex items-center">
              <span className="text-blue-600 text-2xl font-bold">{APP_NAME}</span>
            </Link>
          </div>

          {/* Navigation sur desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href={ROUTES.AGENTS}
              className={`text-gray-700 hover:text-blue-600 ${isActive(ROUTES.AGENTS) ? 'font-medium text-blue-600' : ''}`}
            >
              Catalogue
            </Link>
            <Link 
              href={ROUTES.COMMUNITY}
              className={`text-gray-700 hover:text-blue-600 ${isActive(ROUTES.COMMUNITY) ? 'font-medium text-blue-600' : ''}`}
            >
              Communauté
            </Link>
            <Link 
              href={ROUTES.BLOG}
              className={`text-gray-700 hover:text-blue-600 ${isActive(ROUTES.BLOG) ? 'font-medium text-blue-600' : ''}`}
            >
              Blog
            </Link>
            
            {/* Menu déroulant pour la tarification sur desktop */}
            <div className="relative group">
              <button className={`flex items-center text-gray-700 hover:text-blue-600 ${isActive(ROUTES.PRICING.MAIN) || isActive(ROUTES.PRICING.ENTERPRISE) || isActive(ROUTES.PRICING.CREATOR) ? 'font-medium text-blue-600' : ''}`}>
                Tarification
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-2">
                  <Link 
                    href={ROUTES.PRICING.ENTERPRISE} 
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
                  >
                    Pour les entreprises
                  </Link>
                  <Link 
                    href={ROUTES.PRICING.CREATOR} 
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
                  >
                    Pour les créateurs
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Dashboard link that persists across all pages when logged in */}
            {isLoggedIn && (
              <Link 
                href={userRole === 'admin' 
                  ? ROUTES.DASHBOARD.ADMIN.ROOT
                  : userRole === 'creator'
                    ? ROUTES.DASHBOARD.CREATOR.ROOT
                    : ROUTES.DASHBOARD.ENTERPRISE.ROOT
                }
                className={`text-gray-700 hover:text-blue-600 ${pathname?.includes('/dashboard') ? 'font-medium text-blue-600' : ''}`}
              >
                Dashboard
              </Link>
            )}
            
            {/* Affichage d'un indicateur de chargement pendant la vérification d'authentification */}
            {loading ? (
              <div className="animate-pulse w-20 h-8 bg-gray-200 rounded"></div>
            ) : (
              /* Liens pour visiteurs non connectés */
              !isLoggedIn && (
                <>
                  <Link href={ROUTES.AUTH.SIGNIN}>
                    <Button variant="outline" size="sm">Connexion</Button>
                  </Link>
                  <Link href={ROUTES.AUTH.SIGNUP}>
                    <Button size="sm">Inscription</Button>
                  </Link>
                </>
              )
            )}

            {/* État de déconnexion */}
            {isLoggingOut && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-gray-700">Déconnexion...</span>
              </div>
            )}
            
            {/* Liens pour entreprises connectées */}
            {isLoggedIn && userRole === 'enterprise' && !isLoggingOut && (
              <>
                <span className="text-gray-700">
                  Bonjour, {userName || 'Utilisateur'}
                </span>
                <Link 
                  href={ROUTES.DASHBOARD.ENTERPRISE.ROOT}
                  className={`text-gray-700 hover:text-blue-600 ${isActive(ROUTES.DASHBOARD.ENTERPRISE.ROOT) ? 'font-medium text-blue-600' : ''}`}
                >
                  Mon espace
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Déconnexion
                </Button>
              </>
            )}

            {/* Liens pour créateurs connectés */}
            {isLoggedIn && userRole === 'creator' && !isLoggingOut && (
              <>
                <span className="text-gray-700">
                  Bonjour, {userName || 'Créateur'}
                </span>
                <Link href={ROUTES.DASHBOARD.CREATOR.ADD_AGENT}>
                  <Button size="sm">Ajouter un agent</Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Déconnexion
                </Button>
              </>
            )}

            {/* Liens pour administrateurs connectés */}
            {isLoggedIn && userRole === 'admin' && !isLoggingOut && (
              <>
                <span className="text-gray-700">
                  Bonjour, {userName || 'Admin'}
                </span>
                <Link 
                  href={ROUTES.DASHBOARD.ADMIN.ROOT}
                  className={`text-gray-700 hover:text-blue-600 ${isActive(ROUTES.DASHBOARD.ADMIN.ROOT) ? 'font-medium text-blue-600' : ''}`}
                >
                  Administration
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Déconnexion
                </Button>
              </>
            )}
          </div>

          {/* Bouton hamburger pour mobile */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Link 
              href={ROUTES.AGENTS}
              className={`block py-2 text-gray-700 hover:text-blue-600 ${isActive(ROUTES.AGENTS) ? 'font-medium text-blue-600' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Catalogue
            </Link>
            <Link 
              href={ROUTES.COMMUNITY}
              className={`block py-2 text-gray-700 hover:text-blue-600 ${isActive(ROUTES.COMMUNITY) ? 'font-medium text-blue-600' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Communauté
            </Link>
            <Link 
              href={ROUTES.BLOG}
              className={`block py-2 text-gray-700 hover:text-blue-600 ${isActive(ROUTES.BLOG) ? 'font-medium text-blue-600' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            
            {/* Menu tarification mobile */}
            <div className="py-2">
              <div 
                className={`block py-2 text-gray-700 ${isActive(ROUTES.PRICING.MAIN) || isActive(ROUTES.PRICING.ENTERPRISE) || isActive(ROUTES.PRICING.CREATOR) ? 'font-medium text-blue-600' : ''}`}
              >
                Tarification
              </div>
              <div className="pl-4 space-y-2 mt-1">
                <Link 
                  href={ROUTES.PRICING.ENTERPRISE}
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pour les entreprises
                </Link>
                <Link 
                  href={ROUTES.PRICING.CREATOR}
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pour les créateurs
                </Link>
              </div>
            </div>
            
            {/* Dashboard link for mobile that persists across all pages when logged in */}
            {isLoggedIn && (
              <Link 
                href={userRole === 'admin' 
                  ? ROUTES.DASHBOARD.ADMIN.ROOT
                  : userRole === 'creator'
                    ? ROUTES.DASHBOARD.CREATOR.ROOT
                    : ROUTES.DASHBOARD.ENTERPRISE.ROOT
                }
                className={`block py-2 text-gray-700 hover:text-blue-600 ${pathname?.includes('/dashboard') ? 'font-medium text-blue-600' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            {/* Affichage d'un indicateur de chargement pendant la vérification d'authentification */}
            {loading ? (
              <div className="animate-pulse w-full h-10 bg-gray-200 rounded mb-2"></div>
            ) : (
              /* Liens pour visiteurs non connectés */
              !isLoggedIn && (
                <div className="flex flex-col space-y-2">
                  <Link href={ROUTES.AUTH.SIGNIN} className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" fullWidth>Connexion</Button>
                  </Link>
                  <Link href={ROUTES.AUTH.SIGNUP} className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Button fullWidth>Inscription</Button>
                  </Link>
                </div>
              )
            )}

            {/* État de déconnexion */}
            {isLoggingOut && (
              <div className="flex justify-center py-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-gray-700">Déconnexion...</span>
                </div>
              </div>
            )}
            
            {/* Liens pour entreprises connectées */}
            {isLoggedIn && userRole === 'enterprise' && !isLoggingOut && (
              <div className="flex flex-col space-y-2">
                <span className="block py-2 text-gray-700">
                  Bonjour, {userName || 'Utilisateur'}
                </span>
                <Link 
                  href={ROUTES.DASHBOARD.ENTERPRISE.ROOT}
                  className={`block py-2 text-gray-700 hover:text-blue-600 ${isActive(ROUTES.DASHBOARD.ENTERPRISE.ROOT) ? 'font-medium text-blue-600' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mon espace
                </Link>
                <Button variant="outline" fullWidth onClick={handleSignOut}>
                  Déconnexion
                </Button>
              </div>
            )}

            {/* Liens pour créateurs connectés */}
            {isLoggedIn && userRole === 'creator' && !isLoggingOut && (
              <div className="flex flex-col space-y-2">
                <span className="block py-2 text-gray-700">
                  Bonjour, {userName || 'Créateur'}
                </span>
                <Link 
                  href={ROUTES.DASHBOARD.CREATOR.ROOT}
                  className={`block py-2 text-gray-700 hover:text-blue-600 ${isActive(ROUTES.DASHBOARD.CREATOR.ROOT) ? 'font-medium text-blue-600' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tableau de bord
                </Link>
                <Link href={ROUTES.DASHBOARD.CREATOR.ADD_AGENT} className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <Button fullWidth>Ajouter un agent</Button>
                </Link>
                <Button variant="outline" fullWidth onClick={handleSignOut}>
                  Déconnexion
                </Button>
              </div>
            )}
            
            {/* Liens pour administrateurs connectés */}
            {isLoggedIn && userRole === 'admin' && !isLoggingOut && (
              <div className="flex flex-col space-y-2">
                <span className="block py-2 text-gray-700">
                  Bonjour, {userName || 'Admin'}
                </span>
                <Link 
                  href={ROUTES.DASHBOARD.ADMIN.ROOT}
                  className={`block py-2 text-gray-700 hover:text-blue-600 ${isActive(ROUTES.DASHBOARD.ADMIN.ROOT) ? 'font-medium text-blue-600' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Administration
                </Link>
                <Button variant="outline" fullWidth onClick={handleSignOut}>
                  Déconnexion
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
