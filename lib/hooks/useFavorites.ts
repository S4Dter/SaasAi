import { useState, useEffect } from 'react';
import { supabase } from '../api/supabase/client';
import { Agent } from '../../types';
import { HookState, Favorite } from '../../types/supabase';

/**
 * Hook pour récupérer les agents favoris d'un utilisateur
 * @param userId L'identifiant de l'utilisateur
 * @returns État contenant les données, l'état de chargement et les erreurs
 */
export function useFavorites(userId: string | undefined): HookState<Favorite[]> {
  const [state, setState] = useState<HookState<Favorite[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Ne pas exécuter la requête si aucun ID utilisateur n'est fourni
    if (!userId) {
      setState({
        data: null,
        loading: false,
        error: new Error('ID utilisateur non fourni'),
      });
      return;
    }

    const fetchFavorites = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));

        // Récupérer les favoris avec les données complètes des agents
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            *,
            agent:agent_id(*)
          `)
          .eq('user_id', userId);

        if (error) throw error;

        // Formatage des données
        const formattedFavorites = data.map(favorite => ({
          id: favorite.id,
          user_id: favorite.user_id,
          agent_id: favorite.agent_id,
          created_at: favorite.created_at,
          agent: favorite.agent ? {
            ...favorite.agent,
            createdAt: new Date(favorite.agent.created_at),
            updatedAt: new Date(favorite.agent.updated_at),
          } as Agent : undefined
        })) as Favorite[];

        setState({
          data: formattedFavorites,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error 
            ? error 
            : new Error('Erreur lors du chargement des favoris'),
        });
      }
    };

    fetchFavorites();

    // S'abonner aux modifications en temps réel des favoris de cet utilisateur
    const subscription = supabase
      .channel(`user-favorites-${userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'favorites',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        // Mettre à jour les données en conséquence
        fetchFavorites();
      })
      .subscribe();

    // Nettoyage de la souscription
    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return state;
}
