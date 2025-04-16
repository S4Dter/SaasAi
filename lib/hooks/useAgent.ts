import { useState, useEffect } from 'react';
import { supabase } from '../api/supabase/client';
import { Agent } from '../../types';
import { HookState } from '../../types/supabase';

/**
 * Hook pour récupérer les détails d'un agent IA par son ID
 * @param id L'identifiant de l'agent à récupérer
 * @returns État contenant les données, l'état de chargement et les erreurs
 */
export function useAgent(id: string | undefined): HookState<Agent> {
  const [state, setState] = useState<HookState<Agent>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Ne pas exécuter la requête si aucun ID n'est fourni
    if (!id) {
      setState({
        data: null,
        loading: false,
        error: new Error('ID de l\'agent non fourni'),
      });
      return;
    }

    const fetchAgent = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));

        const { data, error } = await supabase
          .from('agents')
          .select('*, creator:creator_id(*)')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (!data) {
          throw new Error('Agent non trouvé');
        }

        // Conversion des dates et formatage des données
        const formattedAgent: Agent = {
          ...data,
          creatorId: data.creator_id,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        };

        setState({
          data: formattedAgent,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error 
            ? error 
            : new Error('Erreur lors du chargement des détails de l\'agent'),
        });
      }
    };

    fetchAgent();

    // S'abonner aux modifications en temps réel pour cet agent spécifique
    const subscription = supabase
      .channel(`agent-${id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'agents',
        filter: `id=eq.${id}`
      }, (payload) => {
        // Mettre à jour les données en conséquence
        fetchAgent();
      })
      .subscribe();

    // Nettoyage de la souscription
    return () => {
      subscription.unsubscribe();
    };
  }, [id]);

  return state;
}
