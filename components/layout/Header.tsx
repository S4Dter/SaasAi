"use client";


import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '../ui/Button';
import { APP_NAME, ROUTES } from '../../constants';

/**
 * Composant Header pour la navigation principale
 * 
 * Ce composant gère la navigation principale du site et affiche différents liens
 * en fonction de l'authentification et du type d'utilisateur.
 */
const Header: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Mock - À remplacer par un vrai système d'auth
  const isLoggedIn = false; 
  const userRole = null; // 'enterprise' ou 'creator'
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Pour déterminer si un lien est actif
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
            
            {/* Liens pour visiteurs non connectés */}
            {!isLoggedIn && (
              <>
                <Link href={ROUTES.AUTH.SIGNIN}>
                  <Button variant="outline" size="sm">Connexion</Button>
                </Link>
                <Link href={ROUTES.AUTH.SIGNUP}>
                  <Button size="sm">Inscription</Button>
                </Link>
              </>
            )}

            {/* Liens pour entreprises connectées */}
            {isLoggedIn && userRole === 'enterprise' && (
              <>
                <Link 
                  href={ROUTES.DASHBOARD.ENTERPRISE.ROOT}
                  className={`text-gray-700 hover:text-blue-600 ${isActive(ROUTES.DASHBOARD.ENTERPRISE.ROOT) ? 'font-medium text-blue-600' : ''}`}
                >
                  Mon espace
                </Link>
                <Button variant="outline" size="sm">Déconnexion</Button>
              </>
            )}

            {/* Liens pour créateurs connectés */}
            {isLoggedIn && userRole === 'creator' && (
              <>
                <Link 
                  href={ROUTES.DASHBOARD.CREATOR.ROOT}
                  className={`text-gray-700 hover:text-blue-600 ${isActive(ROUTES.DASHBOARD.CREATOR.ROOT) ? 'font-medium text-blue-600' : ''}`}
                >
                  Tableau de bord
                </Link>
                <Link href={ROUTES.DASHBOARD.CREATOR.ADD_AGENT}>
                  <Button size="sm">Ajouter un agent</Button>
                </Link>
                <Button variant="outline" size="sm">Déconnexion</Button>
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
            
            {/* Liens pour visiteurs non connectés */}
            {!isLoggedIn && (
              <div className="flex flex-col space-y-2">
                <Link href={ROUTES.AUTH.SIGNIN} className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" fullWidth>Connexion</Button>
                </Link>
                <Link href={ROUTES.AUTH.SIGNUP} className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <Button fullWidth>Inscription</Button>
                </Link>
              </div>
            )}

            {/* Liens pour entreprises connectées */}
            {isLoggedIn && userRole === 'enterprise' && (
              <div className="flex flex-col space-y-2">
                <Link 
                  href={ROUTES.DASHBOARD.ENTERPRISE.ROOT}
                  className={`block py-2 text-gray-700 hover:text-blue-600 ${isActive(ROUTES.DASHBOARD.ENTERPRISE.ROOT) ? 'font-medium text-blue-600' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mon espace
                </Link>
                <Button variant="outline" fullWidth>Déconnexion</Button>
              </div>
            )}

            {/* Liens pour créateurs connectés */}
            {isLoggedIn && userRole === 'creator' && (
              <div className="flex flex-col space-y-2">
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
                <Button variant="outline" fullWidth>Déconnexion</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
