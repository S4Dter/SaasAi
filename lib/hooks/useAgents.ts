import { useState, useEffect } from 'react';
import { supabase } from '../api/supabase/client';
import { Agent } from '../../types';
import { HookState, FilterParams } from '../../types/supabase';

/**
 * Hook pour récupérer la liste des agents IA
 * @param filters Paramètres optionnels de filtrage
 * @returns État contenant les données, l'état de chargement et les erreurs
 */
export function useAgents(filters?: FilterParams): HookState<Agent[]> {
  const [state, setState] = useState<HookState<Agent[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));

        // Initialiser la requête
        let query = supabase.from('agents').select('*');

        // Appliquer les filtres s'ils sont fournis
        if (filters) {
          // Exemple : filtre par catégorie
          if (filters.category && filters.category !== 'all') {
            query = query.eq('category', filters.category);
          }

          // Exemple : filtre par recherche textuelle
          if (filters.searchQuery) {
            query = query.or(`name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
          }

          // Exemple : filtre par intégrations
          if (filters.integrations && filters.integrations.length > 0) {
            // Supabase permet de chercher dans les tableaux avec l'opérateur cs (contains)
            filters.integrations.forEach((integration: string) => {
              query = query.contains('integrations', [integration]);
            });
          }

          // Exemple : filtre par prix
          if (filters.priceRange) {
            if (filters.priceRange.min !== undefined) {
              query = query.gte('pricing->>startingPrice', filters.priceRange.min);
            }
            if (filters.priceRange.max !== undefined) {
              query = query.lte('pricing->>startingPrice', filters.priceRange.max);
            }
          }
        }

        // Trier par date de création (plus récent d'abord)
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) throw error;

        // Conversion des dates et formatage des données
        const formattedAgents = data.map(agent => ({
          ...agent,
          createdAt: new Date(agent.created_at),
          updatedAt: new Date(agent.updated_at),
        })) as Agent[];

        setState({
          data: formattedAgents,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error('Erreur lors du chargement des agents'),
        });
      }
    };

    fetchAgents();

    // S'abonner aux modifications en temps réel (optionnel)
    const subscription = supabase
      .channel('agents-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, (payload) => {
        // Mettre à jour les données en conséquence
        fetchAgents();
      })
      .subscribe();

    // Nettoyage de la souscription
    return () => {
      subscription.unsubscribe();
    };
  }, [
    // Dépendances pour déclencher le rechargement
    filters?.category,
    filters?.searchQuery,
    // Convertir les tableaux en chaînes JSON pour les comparaisons
    filters?.integrations ? JSON.stringify(filters.integrations) : null,
    filters?.priceRange ? JSON.stringify(filters.priceRange) : null,
  ]);

  return state;
}
