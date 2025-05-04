import { useState, useEffect } from 'react';
import { Agent } from '../../types';
import { HookState } from '../../types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

// Importer directement depuis supabaseClient
import { supabase } from '../supabaseClient';

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

  // Structure vide par défaut pour les données du tableau de bord
  const emptyDashboardData: CreatorDashboardData = {
    userAgents: [],
    stats: {
      views: 0,
      clicks: 0,
      contacts: 0,
      conversions: 0
    },
    agentViews: {},
    agentConversions: {},
    agentRevenue: {},
    contacts: [],
    recommendations: []
  };

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
    
    console.log(`Démarrage de la récupération des données pour l'utilisateur ${userId}`);

    const fetchDashboardData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));

        console.log('Fetching creator dashboard data for user ID:', userId);

        // Vérifier si Supabase est disponible
        if (!supabase) {
          console.error('Client Supabase non disponible, utilisation des données vides');
          setState({
            data: emptyDashboardData,
            loading: false,
            error: null,
          });
          return;
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

        // Création d'un contrôleur d'abort pour les requêtes
        const controller = new AbortController();
        const { signal } = controller;
        
        // Timeout pour toutes les requêtes - augmenté à 10 secondes
        const timeoutId = setTimeout(() => {
          console.log('Timeout des requêtes Supabase atteint (10s), annulation...');
          controller.abort();
        }, 10000); // 10 secondes pour laisser plus de temps aux requêtes
        
        // Variables pour stocker les résultats
        let agentsResponse, viewsResponse, conversionsResponse; 
        let revenueResponse, contactsResponse, recommendationsResponse;
        
        try {
          console.log('Fetching dashboard data - starting sequential requests to éviter timeouts');
          
          // Utiliser des requêtes séquentielles au lieu de Promise.all pour éviter les timeouts
          // et améliorer la fiabilité de chargement
          
          // 1. Récupérer les agents créés par l'utilisateur (données de base essentielles)
          agentsResponse = await safeQuery(
            supabase
              .from('agents')
              .select(`
                id, name, slug, description, short_description, 
                category, creator_id, pricing, featured, logo_url, 
                integrations, demo_url, demo_video_url, screenshots, 
                created_at, updated_at
              `)
              .eq('creator_id', userId)
              .order('created_at', { ascending: false })
              .abortSignal(signal),
            'agents'
          );
          
          console.log('Agents récupérés:', agentsResponse.data?.length || 0);
          
          // 2. Récupérer les statistiques de vues
          viewsResponse = await safeQuery(
            supabase
              .from('agent_views')
              .select('agent_id, count')
              .eq('creator_id', userId)
              .abortSignal(signal),
            'agent_views'
          );
          
          // 3. Récupérer les conversions
          conversionsResponse = await safeQuery(
            supabase
              .from('agent_conversions')
              .select('agent_id, count')
              .eq('creator_id', userId)
              .abortSignal(signal),
            'agent_conversions'
          );
          
          // 4. Récupérer les revenus
          revenueResponse = await safeQuery(
            supabase
              .from('agent_revenue')
              .select('agent_id, amount')
              .eq('creator_id', userId)
              .abortSignal(signal),
            'agent_revenue'
          );
          
          // 5. Récupérer les contacts
          contactsResponse = await safeQuery(
            supabase
              .from('contacts')
              .select(`
                id, agent_id, enterprise_id, message, status, created_at,
                enterprise:enterprise_id(name, location)
              `)
              .eq('creator_id', userId)
              .order('created_at', { ascending: false })
              .limit(10)
              .abortSignal(signal),
            'contacts'
          );
          
          // 6. Récupérer les recommandations
          recommendationsResponse = await safeQuery(
            supabase
              .from('agent_recommendations')
              .select(`
                id, agent_id, enterprise_id, reason, created_at,
                enterprise:enterprise_id(name, location)
              `)
              .eq('creator_id', userId)
              .order('created_at', { ascending: false })
              .limit(10)
              .abortSignal(signal),
            'agent_recommendations'
          );
          
          console.log('Toutes les données du dashboard récupérées avec succès');
          
        } catch (err) {
          console.error('Error in dashboard data requests:', err);
          // Initialiser avec des valeurs par défaut en cas d'erreur
          agentsResponse = { data: [], error: null };
          viewsResponse = { data: [], error: null };
          conversionsResponse = { data: [], error: null };
          revenueResponse = { data: [], error: null };
          contactsResponse = { data: [], error: null };
          recommendationsResponse = { data: [], error: null };
        } finally {
          clearTimeout(timeoutId);
        }

        // Formater les agents avec vérification de l'existence des données
        const formattedAgents = (agentsResponse.data || []).map((agent: any) => {
          if (!agent) return null; // Ignorer les agents nuls
          
          try {
            return {
              ...agent,
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
            };
          } catch (err) {
            console.error('Erreur lors du formatage d\'un agent:', err, agent);
            return null;
          }
        }).filter(Boolean) as Agent[]; // Filtrer les agents nuls

        // Compiler les statistiques de vues avec gestion des erreurs
        const agentViews: Record<string, number> = {};
        let totalViews = 0;
        
        (viewsResponse.data || []).forEach((view: any) => {
          if (view && view.agent_id && typeof view.count === 'number') {
            agentViews[view.agent_id] = view.count;
            totalViews += view.count;
          }
        });

        // Compiler les statistiques de conversions avec gestion des erreurs
        const agentConversions: Record<string, number> = {};
        let totalConversions = 0;
        
        (conversionsResponse.data || []).forEach((conversion: any) => {
          if (conversion && conversion.agent_id && typeof conversion.count === 'number') {
            agentConversions[conversion.agent_id] = conversion.count;
            totalConversions += conversion.count;
          }
        });

        // Compiler les statistiques de revenus avec gestion des erreurs
        const agentRevenue: Record<string, number> = {};
        
        (revenueResponse.data || []).forEach((revenue: any) => {
          if (revenue && revenue.agent_id && typeof revenue.amount === 'number') {
            agentRevenue[revenue.agent_id] = revenue.amount;
          }
        });

        // Définir les types pour les contacts et recommandations
        type ContactType = {
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
        };

        type RecommendationType = {
          id: string;
          agentId: string;
          enterpriseId: string;
          reason: string;
          createdAt: Date;
          enterprise?: {
            name: string;
            location?: string;
          };
        };

        // Formater les contacts avec gestion des erreurs
        const formattedContacts = (contactsResponse.data || []).map((contact: any) => {
          if (!contact) return null; // Ignorer les contacts nuls
          
          try {
            return {
              id: contact.id,
              agentId: contact.agent_id,
              enterpriseId: contact.enterprise_id,
              message: contact.message || '',
              status: contact.status || 'pending',
              createdAt: new Date(contact.created_at || Date.now()),
              enterprise: contact.enterprise ? {
                name: contact.enterprise.name || 'Entreprise',
                location: contact.enterprise.location
              } : undefined
            };
          } catch (err) {
            console.error('Erreur lors du formatage d\'un contact:', err, contact);
            return null;
          }
        }).filter(Boolean) as ContactType[];

        // Formater les recommandations avec gestion des erreurs
        const formattedRecommendations = (recommendationsResponse.data || []).map((recommendation: any) => {
          if (!recommendation) return null; // Ignorer les recommandations nulles
          
          try {
            return {
              id: recommendation.id,
              agentId: recommendation.agent_id,
              enterpriseId: recommendation.enterprise_id,
              reason: recommendation.reason || '',
              createdAt: new Date(recommendation.created_at || Date.now()),
              enterprise: recommendation.enterprise ? {
                name: recommendation.enterprise.name || 'Entreprise',
                location: recommendation.enterprise.location
              } : undefined
            };
          } catch (err) {
            console.error('Erreur lors du formatage d\'une recommandation:', err, recommendation);
            return null;
          }
        }).filter(Boolean) as RecommendationType[];

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
    // RealtimeChannel est un type générique pour éviter les erreurs TypeScript
    type RealtimeChannel = { unsubscribe: () => void };
    
    let agentsChannel: RealtimeChannel | undefined;
    let viewsChannel: RealtimeChannel | undefined;
    let contactsChannel: RealtimeChannel | undefined;
    
    // Vérification que Supabase est disponible avant de créer les channels
    if (supabase) {
      agentsChannel = supabase
        .channel(`creator-agents-${userId}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'agents',
          filter: `creator_id=eq.${userId}`
        }, () => fetchDashboardData())
        .subscribe();

      viewsChannel = supabase
        .channel(`creator-views-${userId}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'agent_views',
          filter: `creator_id=eq.${userId}`
        }, () => fetchDashboardData())
        .subscribe();

      contactsChannel = supabase
        .channel(`creator-contacts-${userId}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'contacts',
          filter: `creator_id=eq.${userId}`
        }, () => fetchDashboardData())
        .subscribe();
    }

    // Nettoyage des souscriptions
    return () => {
      if (agentsChannel) agentsChannel.unsubscribe();
      if (viewsChannel) viewsChannel.unsubscribe();
      if (contactsChannel) contactsChannel.unsubscribe();
    };
  }, [userId]);

  return state;
}
