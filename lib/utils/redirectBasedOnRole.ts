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
          console.error('Erreur lors de la récupération du rôle dans la BD:', roleError);
          
          // Si l'utilisateur n'est pas dans la table users, essayer de récupérer le rôle depuis les métadonnées
          const userMetadataRole = user.user_metadata?.role;
          console.log('Métadonnées utilisateur dans hook:', user.user_metadata);
          
          if (userMetadataRole === 'admin') {
            console.log('Hook: Redirection vers tableau de bord admin (depuis métadonnées)');
            if (window.location.pathname !== ROUTES.DASHBOARD.ADMIN.ROOT) {
              router.push(ROUTES.DASHBOARD.ADMIN.ROOT);
            }
          } else if (userMetadataRole === 'creator') {
            console.log('Hook: Redirection vers tableau de bord créateur (depuis métadonnées)');
            if (window.location.pathname !== ROUTES.DASHBOARD.CREATOR.ROOT) {
              router.push(ROUTES.DASHBOARD.CREATOR.ROOT);
            }
          } else if (userMetadataRole) {
            console.log('Hook: Redirection vers tableau de bord enterprise (depuis métadonnées)');
            if (window.location.pathname !== ROUTES.DASHBOARD.ENTERPRISE.ROOT) {
              router.push(ROUTES.DASHBOARD.ENTERPRISE.ROOT);
            }
          } else {
            setIsLoading(false);
          }
          setIsLoading(false); // Important: toujours arrêter le chargement après traitement
          return;
        }
        
        // 3. Rediriger en fonction du rôle
        if (userData && userData.role) {
          switch (userData.role) {
            case 'admin':
              if (window.location.pathname !== ROUTES.DASHBOARD.ADMIN.ROOT) {
                router.push(ROUTES.DASHBOARD.ADMIN.ROOT);
              } else {
                // Déjà sur la bonne page, ne pas relancer de redirection
                console.log('Déjà sur le dashboard admin, pas de redirection');
              }
              break;
            case 'creator':
              if (window.location.pathname !== ROUTES.DASHBOARD.CREATOR.ROOT) {
                router.push(ROUTES.DASHBOARD.CREATOR.ROOT);
              } else {
                // Déjà sur la bonne page, ne pas relancer de redirection
                console.log('Déjà sur le dashboard créateur, pas de redirection');
              }
              break;
            case 'enterprise':
              if (window.location.pathname !== ROUTES.DASHBOARD.ENTERPRISE.ROOT) {
                router.push(ROUTES.DASHBOARD.ENTERPRISE.ROOT);
              } else {
                // Déjà sur la bonne page, ne pas relancer de redirection
                console.log('Déjà sur le dashboard enterprise, pas de redirection');
              }
              break;
            default:
              // Si le rôle n'est pas reconnu, on ne redirige pas
              console.warn(`Rôle non reconnu: ${userData.role}`);
          }
        } else {
          // Pas de rôle défini, on ne redirige pas
          console.log('Pas de rôle défini dans la BD');
        }
        
        // Toujours arrêter le chargement après traitement, quelle que soit l'issue
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la redirection basée sur le rôle:', error);
        setIsLoading(false);
      }
    };

    checkUserAndRedirect();
  }, [router, supabase]);

  return { isLoading };
}
