import { useState, useEffect } from 'react';
import { supabase } from '../api/supabase/client';
import { Agent } from '../../types';
import { HookState } from '../../types/supabase';

/**
 * Type pour les données du tableau de bord créateur
 */
export interface CreatorDashboardData {
  userAgents: Agent[];
  stats: {
    views: number;
    clicks: number;
    contacts: number;
    conversions: number;
  };
  agentViews: Record<string, number>;
  agentConversions: Record<string, number>;
  agentRevenue: Record<string, number>;
  contacts: {
    id: string;
    agentId: string;
    enterpriseId: string;
    message: string;
    status: string;
    createdAt: Date;
    enterprise?: {
      name: string;
      location?: string;
    };
  }[];
  recommendations: {
    id: string;
    agentId: string;
    enterpriseId: string;
    reason: string;
    createdAt: Date;
    enterprise?: {
      name: string;
      location?: string;
    };
  }[];
}

/**
 * Hook pour récupérer toutes les données du tableau de bord créateur
 * @param userId L'identifiant de l'utilisateur créateur
 * @returns État contenant les données, l'état de chargement et les erreurs
 */
export function useCreatorDashboard(userId: string | undefined): HookState<CreatorDashboardData> {
  const [state, setState] = useState<HookState<CreatorDashboardData>>({
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

        console.log('Fetching creator dashboard data for user ID:', userId);

        // Charger les données en parallèle pour optimiser les performances
        const [
          agentsResponse,
          viewsResponse,
          conversionsResponse,
          revenueResponse,
          contactsResponse,
          recommendationsResponse
        ] = await Promise.all([
          // 1. Récupérer les agents créés par l'utilisateur
          supabase
            .from('agents')
            .select('*')
            .eq('creator_id', userId)
            .order('created_at', { ascending: false }),

          // 2. Récupérer les statistiques de vues pour les agents de l'utilisateur
          supabase
            .from('agent_views')
            .select('agent_id, count')
            .eq('creator_id', userId),

          // 3. Récupérer les conversions pour les agents de l'utilisateur
          supabase
            .from('agent_conversions')
            .select('agent_id, count')
            .eq('creator_id', userId),

          // 4. Récupérer les revenus pour les agents de l'utilisateur
          supabase
            .from('agent_revenue')
            .select('agent_id, amount')
            .eq('creator_id', userId),

          // 5. Récupérer les contacts pour les agents de l'utilisateur
          supabase
            .from('contacts')
            .select(`
              *,
              enterprise:enterprise_id(name, location)
            `)
            .eq('creator_id', userId)
            .order('created_at', { ascending: false }),

          // 6. Récupérer les recommandations d'agents
          supabase
            .from('agent_recommendations')
            .select(`
              *,
              enterprise:enterprise_id(name, location)
            `)
            .eq('creator_id', userId)
            .order('created_at', { ascending: false })
        ]);

        // Gérer les erreurs potentielles
        if (agentsResponse.error) throw agentsResponse.error;
        if (viewsResponse.error) throw viewsResponse.error;
        if (conversionsResponse.error) throw conversionsResponse.error;
        if (revenueResponse.error) throw revenueResponse.error;
        if (contactsResponse.error) throw contactsResponse.error;
        if (recommendationsResponse.error) throw recommendationsResponse.error;

        // Formater les agents
        const formattedAgents = agentsResponse.data.map(agent => ({
          ...agent,
          id: agent.id,
          name: agent.name,
          slug: agent.slug || '',
          description: agent.description || '',
          shortDescription: agent.short_description || '',
          category: agent.category,
          creatorId: agent.creator_id,
          pricing: agent.pricing,
          featured: agent.featured || false,
          logoUrl: agent.logo_url || '',
          integrations: agent.integrations || [],
          demoUrl: agent.demo_url,
          demoVideoUrl: agent.demo_video_url,
          screenshots: agent.screenshots,
          createdAt: new Date(agent.created_at),
          updatedAt: new Date(agent.updated_at)
        })) as Agent[];

        // Compiler les statistiques de vues
        const agentViews: Record<string, number> = {};
        let totalViews = 0;
        viewsResponse.data.forEach(view => {
          agentViews[view.agent_id] = view.count;
          totalViews += view.count;
        });

        // Compiler les statistiques de conversions
        const agentConversions: Record<string, number> = {};
        let totalConversions = 0;
        conversionsResponse.data.forEach(conversion => {
          agentConversions[conversion.agent_id] = conversion.count;
          totalConversions += conversion.count;
        });

        // Compiler les statistiques de revenus
        const agentRevenue: Record<string, number> = {};
        revenueResponse.data.forEach(revenue => {
          agentRevenue[revenue.agent_id] = revenue.amount;
        });

        // Formater les contacts
        const formattedContacts = contactsResponse.data.map(contact => ({
          id: contact.id,
          agentId: contact.agent_id,
          enterpriseId: contact.enterprise_id,
          message: contact.message || '',
          status: contact.status,
          createdAt: new Date(contact.created_at),
          enterprise: contact.enterprise ? {
            name: contact.enterprise.name,
            location: contact.enterprise.location
          } : undefined
        }));

        // Formater les recommandations
        const formattedRecommendations = recommendationsResponse.data.map(recommendation => ({
          id: recommendation.id,
          agentId: recommendation.agent_id,
          enterpriseId: recommendation.enterprise_id,
          reason: recommendation.reason || '',
          createdAt: new Date(recommendation.created_at),
          enterprise: recommendation.enterprise ? {
            name: recommendation.enterprise.name,
            location: recommendation.enterprise.location
          } : undefined
        }));

        // Calculer les statistiques totales
        // Pour les clics, nous allons utiliser une estimation basée sur les vues
        const totalClicks = Math.floor(totalViews * 0.3); // ~30% des vues génèrent un clic
        const totalContacts = formattedContacts.length;

        // Préparer l'objet de données final
        const dashboardData: CreatorDashboardData = {
          userAgents: formattedAgents,
          stats: {
            views: totalViews,
            clicks: totalClicks,
            contacts: totalContacts,
            conversions: totalConversions
          },
          agentViews,
          agentConversions,
          agentRevenue,
          contacts: formattedContacts,
          recommendations: formattedRecommendations
        };

        setState({
          data: dashboardData,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching creator dashboard data:', error);
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

    // S'abonner aux modifications en temps réel des données liées au tableau de bord
    const agentsChannel = supabase
      .channel(`creator-agents-${userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'agents',
        filter: `creator_id=eq.${userId}`
      }, () => fetchDashboardData())
      .subscribe();

    const viewsChannel = supabase
      .channel(`creator-views-${userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'agent_views',
        filter: `creator_id=eq.${userId}`
      }, () => fetchDashboardData())
      .subscribe();

    const contactsChannel = supabase
      .channel(`creator-contacts-${userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'contacts',
        filter: `creator_id=eq.${userId}`
      }, () => fetchDashboardData())
      .subscribe();

    // Nettoyage des souscriptions
    return () => {
      agentsChannel.unsubscribe();
      viewsChannel.unsubscribe();
      contactsChannel.unsubscribe();
    };
  }, [userId]);

  return state;
}
