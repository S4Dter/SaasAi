'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/constants';
import { supabase } from '@/lib/supabaseClient';

/**
 * Hook pour gérer la redirection automatique selon le rôle de l'utilisateur
 * après connexion.
 * 
 * @returns Un objet contenant l'état de chargement
 */
export function useRoleBasedRedirection() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        // Vérifier si le client supabase est disponible
        if (!supabase) {
          console.error('Client Supabase non disponible');
          setIsLoading(false);
          return;
        }
        
        setIsLoading(true);
        
        // 1. Récupérer l'utilisateur actuel
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          // Pas d'utilisateur connecté, on ne redirige pas
          setIsLoading(false);
          return;
        }
        
        // 2. Récupérer le rôle de l'utilisateur depuis la table users
        // La table users est liée directement à auth.users via id (et non user_id)
        const { data: userData, error: roleError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (roleError) {
          console.error('Erreur lors de la récupération du rôle:', roleError);
          setIsLoading(false);
          return;
        }
        
        // 3. Rediriger en fonction du rôle
        if (userData && userData.role) {
          switch (userData.role) {
            case 'creator':
              router.push(ROUTES.DASHBOARD.CREATOR.ROOT);
              break;
            case 'enterprise':
              router.push(ROUTES.DASHBOARD.ENTERPRISE.ROOT);
              break;
            default:
              // Si le rôle n'est pas reconnu, on ne redirige pas
              console.warn(`Rôle non reconnu: ${userData.role}`);
              setIsLoading(false);
          }
        } else {
          // Pas de rôle défini, on ne redirige pas
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Erreur lors de la redirection basée sur le rôle:', error);
        setIsLoading(false);
      }
    };

    checkUserAndRedirect();
  }, [router, supabase]);

  return { isLoading };
}
