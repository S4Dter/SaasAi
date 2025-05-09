'use client';

import { useState, useEffect } from 'react';
import { Favorite, HookState } from '../../types/supabase';
import { Agent } from '../../types';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useSupabaseAgent } from './useSupabaseAgents';

/**
 * Hook pour récupérer les favoris d'un utilisateur
 * @param userId ID de l'utilisateur (optionnel, utilisera l'utilisateur connecté si non fourni)
 * @returns État contenant les favoris, l'état de chargement et les erreurs
 */
export function useFavorites(userId?: string): HookState<Favorite[]> & {
  addFavorite: (agentId: string) => Promise<boolean>;
  removeFavorite: (agentId: string) => Promise<boolean>;
  isFavorite: (agentId: string) => boolean;
} {
  const [state, setState] = useState<HookState<Favorite[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const { user } = useAuth();
  const effectiveUserId = userId || user?.id;

  // Fonction pour vérifier si un agent est dans les favoris
  const isFavorite = (agentId: string): boolean => {
    if (!state.data) return false;
    return state.data.some((fav: Favorite) => fav.agent_id === agentId);
  };

  // Fonction pour ajouter un agent aux favoris
  const addFavorite = async (agentId: string): Promise<boolean> => {
    if (!effectiveUserId || !supabase) {
      console.error('Utilisateur non connecté ou client Supabase non disponible');
      return false;
    }

    try {
      // Vérifier si le favori existe déjà pour éviter les doublons
      if (isFavorite(agentId)) {
        return true; // Déjà dans les favoris
      }

      const { error } = await supabase.from('favorites').insert({
        user_id: effectiveUserId,
        agent_id: agentId,
      });

      if (error) {
        console.error('Erreur lors de l\'ajout aux favoris:', error);
        return false;
      }

      // Mettre à jour l'état local
      fetchFavorites();
      return true;
    } catch (err) {
      console.error('Exception lors de l\'ajout aux favoris:', err);
      return false;
    }
  };

  // Fonction pour supprimer un agent des favoris
  const removeFavorite = async (agentId: string): Promise<boolean> => {
    if (!effectiveUserId || !supabase) {
      console.error('Utilisateur non connecté ou client Supabase non disponible');
      return false;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', effectiveUserId)
        .eq('agent_id', agentId);

      if (error) {
        console.error('Erreur lors de la suppression des favoris:', error);
        return false;
      }

      // Mettre à jour l'état local
      fetchFavorites();
      return true;
    } catch (err) {
      console.error('Exception lors de la suppression des favoris:', err);
      return false;
    }
  };

  // Fonction pour récupérer les favoris
  const fetchFavorites = async () => {
    try {
      setState((prev: HookState<Favorite[]>) => ({ ...prev, loading: true }));

      if (!effectiveUserId) {
        setState({
          data: [],
          loading: false,
          error: null,
        });
        return;
      }

      if (!supabase) {
        throw new Error('Client Supabase non disponible');
      }

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id, 
          user_id, 
          agent_id, 
          created_at
        `)
        .eq('user_id', effectiveUserId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      const favorites = data.map((fav: any) => ({
        id: fav.id,
        user_id: fav.user_id,
        agent_id: fav.agent_id,
        created_at: fav.created_at,
      }));

      setState({
        data: favorites,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      setState({
        data: [],
        loading: false,
        error: error instanceof Error 
          ? error 
          : new Error('Erreur lors de la récupération des favoris'),
      });
    }
  };

  // Effet pour récupérer les favoris au chargement ou quand l'utilisateur change
  useEffect(() => {
    fetchFavorites();

    // S'abonner aux changements en temps réel des favoris
    if (effectiveUserId && supabase) {
      const favoritesChannel = supabase
        .channel(`favorites-${effectiveUserId}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'favorites',
          filter: `user_id=eq.${effectiveUserId}`
        }, () => fetchFavorites())
        .subscribe();

      return () => {
        // Nettoyer la souscription
        favoritesChannel.unsubscribe();
      };
    }
  }, [effectiveUserId]);

  return {
    ...state,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}

/**
 * Hook pour récupérer les agents favoris d'un utilisateur
 * @param userId ID de l'utilisateur (optionnel, utilisera l'utilisateur connecté si non fourni)
 * @returns État contenant les agents favoris, l'état de chargement et les erreurs
 */
export function useFavoriteAgents(userId?: string): HookState<Agent[]> & {
  addFavorite: (agentId: string) => Promise<boolean>;
  removeFavorite: (agentId: string) => Promise<boolean>;
  isFavorite: (agentId: string) => boolean;
} {
  const [state, setState] = useState<HookState<Agent[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const { user } = useAuth();
  const effectiveUserId = userId || user?.id;
  const favorites = useFavorites(effectiveUserId);

  // Effet pour récupérer les agents favoris quand les favoris changent
  useEffect(() => {
    const fetchFavoriteAgents = async () => {
      try {
        setState((prev: HookState<Agent[]>) => ({ ...prev, loading: true }));

        if (!favorites.data || favorites.data.length === 0) {
          setState({
            data: [],
            loading: false,
            error: null,
          });
          return;
        }

        if (!supabase) {
          throw new Error('Client Supabase non disponible');
        }

        // Récupérer tous les agents favoris
        const agentIds = favorites.data.map((fav: Favorite) => fav.agent_id);
        
        const { data, error } = await supabase
          .from('agents')
          .select(`
            id, name, slug, description, short_description, 
            category, creator_id, pricing, featured, logo_url, 
            integrations, demo_url, demo_video_url, screenshots, 
            created_at, updated_at, is_public
          `)
          .in('id', agentIds);

        if (error) {
          throw new Error(`Erreur Supabase: ${error.message}`);
        }

        // Transformer les données pour correspondre à notre modèle Agent
        const agents = data.map(agent => {
          // Construction de l'objet agent selon notre modèle
          const agentData = {
            id: agent.id,
            name: agent.name,
            slug: agent.slug || '',
            description: agent.description || '',
            shortDescription: agent.short_description || '',
            category: agent.category || 'other',
            creatorId: agent.creator_id,
            pricing: agent.pricing || { model: 'subscription', startingPrice: 0, currency: 'EUR' },
            featured: agent.featured || false,
            logoUrl: agent.logo_url || '',
            integrations: agent.integrations || [],
            demoUrl: agent.demo_url,
            demoVideoUrl: agent.demo_video_url,
            screenshots: agent.screenshots || [],
            createdAt: new Date(agent.created_at || Date.now()),
            updatedAt: agent.updated_at ? new Date(agent.updated_at) : new Date(agent.created_at || Date.now())
          };
          
          return {
            ...agentData,
            isPublic: !!agent.is_public
          } as Agent;
        });

        setState({
          data: agents,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des agents favoris:', error);
        setState({
          data: [],
          loading: false,
          error: error instanceof Error 
            ? error 
            : new Error('Erreur lors de la récupération des agents favoris'),
        });
      }
    };

    // Ne pas exécuter la requête si les favoris sont en cours de chargement
    if (!favorites.loading) {
      fetchFavoriteAgents();
    }
  }, [favorites.data, favorites.loading, effectiveUserId]);

  return {
    data: state.data,
    loading: state.loading || favorites.loading,
    error: state.error || favorites.error,
    addFavorite: favorites.addFavorite,
    removeFavorite: favorites.removeFavorite,
    isFavorite: favorites.isFavorite,
  };
}
