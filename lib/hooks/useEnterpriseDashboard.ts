import { useState, useEffect } from 'react';
import { supabase } from '../api/supabase/client';
import { Agent } from '../../types';
import { HookState, Favorite } from '../../types/supabase';

/**
 * Type pour les données du tableau de bord entreprise
 */
export interface EnterpriseDashboardData {
  favoriteAgents: Agent[];
  suggestedAgents: Agent[];
  stats: {
    views: number;
    clicks: number;
    contacts: number;
    conversions: number;
  };
  recentHistory: {
    id: string;
    agentId: string;
    date: Date;
    agent?: Agent;
  }[];
}

/**
 * Hook pour récupérer toutes les données du tableau de bord entreprise
 * @param userId L'identifiant de l'utilisateur entreprise
 * @returns État contenant les données, l'état de chargement et les erreurs
 */
export function useEnterpriseDashboard(userId: string | undefined): HookState<EnterpriseDashboardData> {
  const [state, setState] = useState<HookState<EnterpriseDashboardData>>({
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

    const fetchDashboardData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));

        console.log('Fetching enterprise dashboard data for user ID:', userId);

        // Vérifier si Supabase est disponible
        if (!supabase) {
          throw new Error('Client Supabase non disponible');
        }

        // Fonction pour gérer les erreurs de requête Supabase avec un type générique
        const safeQuery = async <T = any>(query: any, tableName: string): Promise<{ data: T[]; error: null | any }> => {
          try {
            const response = await query;
            if (response.error) {
              console.error(`Erreur lors de la requête à la table ${tableName}:`, response.error);
              // Retourner un objet avec data vide au lieu de provoquer une erreur
              return { data: [], error: null };
            }
            return response;
          } catch (err) {
            console.error(`Exception lors de la requête à la table ${tableName}:`, err);
            // Retourner un objet avec data vide au lieu de provoquer une erreur
            return { data: [], error: null };
          }
        };

        // Charger les données en parallèle pour optimiser les performances
        const [
          favoritesResponse,
          suggestionsResponse,
          viewsResponse,
          contactsResponse
        ] = await Promise.all([
          // 1. Récupérer les agents favoris de l'utilisateur
          safeQuery(
            supabase
              .from('favorites')
              .select(`
                *,
                agent:agent_id(*)
              `)
              .eq('user_id', userId)
              .order('created_at', { ascending: false })
              .limit(5),
            'favorites'
          ),

          // 2. Récupérer les suggestions d'agents pour l'utilisateur
          safeQuery(
            supabase
              .from('agent_recommendations')
              .select(`
                *,
                agent:agent_id(*)
              `)
              .eq('enterprise_id', userId)
              .order('match_score', { ascending: false })
              .limit(5),
            'agent_recommendations'
          ),

          // 3. Récupérer les statistiques de vues pour l'utilisateur
          safeQuery(
            supabase
              .from('agent_views')
              .select('count')
              .eq('enterprise_id', userId),
            'agent_views'
          ),

          // 4. Récupérer les contacts pour l'utilisateur
          safeQuery(
            supabase
              .from('contacts')
              .select('*')
              .eq('enterprise_id', userId),
            'contacts'
          )
        ]);

        // Formater les agents favoris
        const favoriteAgents = (favoritesResponse.data || [])
          .filter((fav: any) => fav && fav.agent)
          .map((fav: any) => {
            try {
              const agent = fav.agent;
              return {
                id: agent.id,
                name: agent.name || 'Sans nom',
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
                updatedAt: new Date(agent.updated_at || Date.now())
              } as Agent;
            } catch (err) {
              console.error('Erreur lors du formatage d\'un agent favori:', err);
              return null;
            }
          })
          .filter(Boolean) as Agent[];

        // Formater les agents suggérés
        const suggestedAgents = (suggestionsResponse.data || [])
          .filter((suggestion: any) => suggestion && suggestion.agent)
          .map((suggestion: any) => {
            try {
              const agent = suggestion.agent;
              return {
                id: agent.id,
                name: agent.name || 'Sans nom',
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
                updatedAt: new Date(agent.updated_at || Date.now())
              } as Agent;
            } catch (err) {
              console.error('Erreur lors du formatage d\'un agent suggéré:', err);
              return null;
            }
          })
          .filter(Boolean) as Agent[];

        // Calculer les statistiques
        const totalViews = (viewsResponse.data || []).reduce((sum, view: any) => {
          return sum + (view && typeof view.count === 'number' ? view.count : 0);
        }, 0);

        const totalContacts = (contactsResponse.data || []).length;
        
        // Estimation des clics (30% des vues) et conversions (10% des vues)
        const totalClicks = Math.floor(totalViews * 0.3);
        const totalConversions = Math.floor(totalViews * 0.1);

        // Créer des données d'historique récent (à partir des favoris pour l'instant)
        const recentHistory = favoriteAgents.map((agent, index) => ({
          id: `history-${index}`,
          agentId: agent.id,
          date: new Date(Date.now() - index * 24 * 60 * 60 * 1000), // Derniers jours
          agent
        }));

        // Préparer l'objet de données final
        const dashboardData: EnterpriseDashboardData = {
          favoriteAgents,
          suggestedAgents,
          stats: {
            views: totalViews,
            clicks: totalClicks,
            contacts: totalContacts,
            conversions: totalConversions
          },
          recentHistory
        };

        setState({
          data: dashboardData,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching enterprise dashboard data:', error);
        setState({
          data: null,
          loading: false,
          error: error instanceof Error 
            ? error 
            : new Error('Erreur lors du chargement des données du tableau de bord'),
        });
      }
    };

    fetchDashboardData();

    // S'abonner aux modifications en temps réel des données
    const favoritesChannel = supabase
      .channel(`enterprise-favorites-${userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'favorites',
        filter: `user_id=eq.${userId}`
      }, () => fetchDashboardData())
      .subscribe();

    const recommendationsChannel = supabase
      .channel(`enterprise-recommendations-${userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'agent_recommendations',
        filter: `enterprise_id=eq.${userId}`
      }, () => fetchDashboardData())
      .subscribe();

    // Nettoyage des souscriptions
    return () => {
      favoritesChannel.unsubscribe();
      recommendationsChannel.unsubscribe();
    };
  }, [userId]);

  return state;
}
