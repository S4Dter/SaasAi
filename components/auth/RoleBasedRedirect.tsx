'use client';

import { useRoleBasedRedirection } from '@/lib/utils/redirectBasedOnRole';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RoleBasedRedirectProps {
  children: React.ReactNode;
}

/**
 * Composant qui gère la redirection automatique selon le rôle de l'utilisateur
 * après connexion, mais uniquement sur les pages spécifiées (/ et /signin).
 */
export default function RoleBasedRedirect({ children }: RoleBasedRedirectProps) {
  const pathname = usePathname();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { isLoading } = useRoleBasedRedirection();
  
  // Pages concernées par la redirection automatique
  const redirectPaths = ['/', '/signin'];
  
  useEffect(() => {
    // Vérifie si la page actuelle est concernée par la redirection
    const shouldCheckRedirect = redirectPaths.includes(pathname);
    setShouldRedirect(shouldCheckRedirect);
  }, [pathname]);
  
  // Si nous sommes sur une page qui nécessite une redirection potentielle
  // et que le processus de vérification est en cours, on affiche un indicateur de chargement
  if (shouldRedirect && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }
  
  // Dans tous les autres cas, on affiche normalement le contenu
  return <>{children}</>;
}
