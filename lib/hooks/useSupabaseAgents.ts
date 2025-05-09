'use client';

import { useState, useEffect } from 'react';
import { Agent } from '../../types';
import { supabase } from '../supabaseClient';
import { HookState } from '../../types/supabase';
import { useAuth } from '../context/AuthContext';

/**
 * Type pour les options de filtrage des agents
 */
export interface AgentFilterOptions {
  category?: string;
  query?: string;
  isPublic?: boolean;
  creatorId?: string;
  page?: number;
  limit?: number;
}

/**
 * Hook pour récupérer les agents avec Supabase directement
 * @param options Options de filtrage
 * @returns État contenant les agents, l'état de chargement et les erreurs
 */
export function useSupabaseAgents(options: AgentFilterOptions = {}): HookState<Agent[]> {
  const [state, setState] = useState<HookState<Agent[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const { user } = useAuth();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));

        if (!supabase) {
          throw new Error('Client Supabase non disponible');
        }

        // Débuter la requête
        let query = supabase
          .from('agents')
          .select(`
            id, name, slug, description, short_description, 
            category, creator_id, pricing, featured, logo_url, 
            integrations, demo_url, demo_video_url, screenshots, 
            created_at, updated_at, is_public
          `);

// Appliquer les filtres en fonction du rôle utilisateur
        if (user?.role === 'creator') {
          // Créateurs: voir ses propres agents ou les agents publics
          if (options.creatorId) {
            query = query.eq('creator_id', options.creatorId);
          } else {
            query = query.eq('creator_id', user.id);
          }
        } else if (user?.role === 'enterprise' || !user) {
          // Entreprises ou non-connectés: uniquement les agents publics
          query = query.eq('is_public', true);
        }
        // Admin: peut voir tous les agents, donc pas de filtre supplémentaire

        // Appliquer des filtres optionnels
        if (options.category) {
          query = query.eq('category', options.category);
        }

        if (options.query) {
          query = query.or(`name.ilike.%${options.query}%,description.ilike.%${options.query}%`);
        }

        // Pagination
        const page = options.page || 1;
        const limit = options.limit || 10;
        const startIndex = (page - 1) * limit;
        
        query = query
          .range(startIndex, startIndex + limit - 1)
          .order('created_at', { ascending: false });

        // Exécuter la requête
        const { data, error } = await query;

        if (error) {
          throw new Error(`Erreur Supabase: ${error.message}`);
        }

        // Transformer les données pour correspondre à notre modèle Agent
        const agents = data.map(agent => {
          // Besoin de créer un objet intermédiaire car TS ne reconnaît pas toujours les propriétés optionnelles
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
          
          // Ajouter la propriété isPublic séparément
          const formattedAgent = {
            ...agentData,
            isPublic: !!agent.is_public
          } as Agent;
          return formattedAgent;
        });

        setState({
          data: agents,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des agents:', error);
        setState({
          data: null,
          loading: false,
          error: error instanceof Error 
            ? error 
            : new Error('Erreur lors de la récupération des agents'),
        });
      }
    };

    fetchAgents();

    // S'abonner aux changements en temps réel si nécessaire
    const agentsChannel = supabase?.channel('agents-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'agents',
      }, () => fetchAgents())
      .subscribe();

    return () => {
      // Nettoyer la souscription
      agentsChannel?.unsubscribe();
    };
  }, [
    options.category,
    options.query,
    options.isPublic,
    options.creatorId,
    options.page,
    options.limit,
    user?.id,
    user?.role
  ]);

  return state;
}

/**
 * Hook pour récupérer un agent spécifique
 * @param id Identifiant de l'agent
 * @returns État contenant l'agent, l'état de chargement et les erreurs
 */
export function useSupabaseAgent(id: string | undefined): HookState<Agent> {
  const [state, setState] = useState<HookState<Agent>>({
    data: null,
    loading: true,
    error: null,
  });

  const { user } = useAuth();

  useEffect(() => {
    if (!id) {
      setState({
        data: null,
        loading: false,
        error: new Error('ID agent non fourni'),
      });
      return;
    }
    
    const fetchAgent = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));

        if (!supabase) {
          throw new Error('Client Supabase non disponible');
        }

        // Récupérer l'agent par son ID
        const { data, error } = await supabase
          .from('agents')
          .select(`
            id, name, slug, description, short_description, 
            category, creator_id, pricing, featured, logo_url, 
            integrations, demo_url, demo_video_url, screenshots, 
            created_at, updated_at, is_public
          `)
          .eq('id', id)
          .single();

        if (error) {
          throw new Error(`Erreur Supabase: ${error.message}`);
        }

        if (!data) {
          throw new Error('Agent non trouvé');
        }

        // Vérifier les permissions d'accès
        const isPublic = data.is_public || false; // Gérer le cas où is_public est undefined
        
        if (!isPublic) {
          if (!user) {
            throw new Error('Agent non accessible - connexion requise');
          }
          
          if (user.role === 'enterprise' && data.creator_id !== user.id) {
            throw new Error('Accès à cet agent non autorisé');
          }
          
          if (user.role === 'creator' && data.creator_id !== user.id) {
            throw new Error('Vous ne pouvez accéder qu\'à vos propres agents non publics');
          }
        }

        // Transformer les données pour correspondre à notre modèle Agent
        // Besoin de créer un objet intermédiaire car TS ne reconnaît pas toujours les propriétés optionnelles
        const agentData = {
          id: data.id,
          name: data.name,
          slug: data.slug || '',
          description: data.description || '',
          shortDescription: data.short_description || '',
          category: data.category || 'other',
          creatorId: data.creator_id,
          pricing: data.pricing || { model: 'subscription', startingPrice: 0, currency: 'EUR' },
          featured: data.featured || false,
          logoUrl: data.logo_url || '',
          integrations: data.integrations || [],
          demoUrl: data.demo_url,
          demoVideoUrl: data.demo_video_url,
          screenshots: data.screenshots || [],
          createdAt: new Date(data.created_at || Date.now()),
          updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(data.created_at || Date.now())
        };
        
        // Ajouter la propriété isPublic séparément et utiliser un type assertion
        const agent = {
          ...agentData,
          isPublic: !!data.is_public
        } as Agent;

        setState({
          data: agent,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'agent:', error);
        setState({
          data: null,
          loading: false,
          error: error instanceof Error 
            ? error 
            : new Error('Erreur lors de la récupération de l\'agent'),
        });
      }
    };

    fetchAgent();

    // S'abonner aux changements en temps réel
    const agentChannel = supabase?.channel(`agent-${id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'agents',
        filter: `id=eq.${id}`
      }, () => fetchAgent())
      .subscribe();

    return () => {
      // Nettoyer la souscription
      agentChannel?.unsubscribe();
    };
  }, [id, user?.id, user?.role]);

  return state;
}
