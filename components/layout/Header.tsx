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
      await signOut();
      // Forcer le rafraîchissement de la page après déconnexion
      router.push(ROUTES.HOME);
      router.refresh();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
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

            {/* Liens pour entreprises connectées */}
            {isLoggedIn && userRole === 'enterprise' && (
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
            {isLoggedIn && userRole === 'creator' && (
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
            {isLoggedIn && userRole === 'admin' && (
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

            {/* Liens pour entreprises connectées */}
            {isLoggedIn && userRole === 'enterprise' && (
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
            {isLoggedIn && userRole === 'creator' && (
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
            {isLoggedIn && userRole === 'admin' && (
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
