'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { supabase } from '@/lib/supabaseClient';

/**
 * Page de déconnexion qui nettoie toutes les sessions et redirige vers la page de connexion
 * Cette page est importante pour éviter les problèmes de chargement indéfini et de boucles de redirection
 */
export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    async function performSignOut() {
      try {
        console.log('Début du processus de déconnexion...');
        
        // 1. Déconnecter l'utilisateur de Supabase
        if (supabase) {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error('Erreur lors de la déconnexion Supabase:', error);
          } else {
            console.log('Déconnexion Supabase réussie');
          }
        }
        
        // 2. Nettoyer le localStorage
        console.log('Nettoyage du localStorage...');
        localStorage.removeItem('user');
        localStorage.removeItem('user-role');
        localStorage.removeItem('user-session');
        localStorage.removeItem('supabase-auth-token');
        localStorage.removeItem('sb-auth-token');
        
        // 3. Nettoyer les cookies (via une expiration immédiate)
        document.cookie = 'user-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'supabase-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'sb-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'user-role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        console.log('Nettoyage des cookies terminé');
        
        // 4. Rediriger vers la page de connexion après un court délai
        // pour s'assurer que le nettoyage est bien effectué
        setTimeout(() => {
          console.log('Redirection vers la page de connexion...');
          window.location.href = ROUTES.AUTH.SIGNIN;
        }, 500);
      } catch (error) {
        console.error('Erreur pendant le processus de déconnexion:', error);
        // En cas d'erreur, rediriger quand même vers la page de connexion
        router.push(ROUTES.AUTH.SIGNIN);
      }
    }

    performSignOut();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Déconnexion en cours...</h2>
        <p className="text-gray-500">Suppression des données de session et nettoyage des cookies.</p>
        <p className="text-gray-400 text-sm mt-4">Vous allez être redirigé automatiquement.</p>
      </div>
    </div>
  );
}
