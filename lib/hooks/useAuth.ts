import { useState, useEffect } from 'react';
import { supabase } from '../api/supabase/client';
import { User } from '../../types';
import { SupabaseUser, HookState } from '../../types/supabase';

/**
 * Hook pour gérer l'état d'authentification
 * Retourne l'utilisateur connecté, l'état de chargement et les erreurs éventuelles
 */
export function useAuth(): HookState<User> {
  const [state, setState] = useState<HookState<User>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    const getUser = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        
        // Récupère la session en cours
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (!session) {
          setState({
            data: null,
            loading: false,
            error: null,
          });
          return;
        }

        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        // Conversion du format Supabase vers notre format d'utilisateur
        const supaUser = userData.user as SupabaseUser;
        
        const user: User = {
          id: supaUser.id,
          email: supaUser.email,
          name: supaUser.user_metadata.name || 'Utilisateur',
          role: (supaUser.user_metadata.role as User['role']) || 'enterprise',
          avatar: supaUser.user_metadata.avatar_url,
          company: supaUser.user_metadata.company,
          bio: supaUser.user_metadata.bio,
          createdAt: new Date(supaUser.created_at),
        };
        
        setState({
          data: user,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error('Erreur d\'authentification inconnue'),
        });
      }
    };

    // Exécuter la fonction au montage du composant
    getUser();

    // S'abonner aux changements d'état d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          getUser();
        } else if (event === 'SIGNED_OUT') {
          setState({
            data: null,
            loading: false,
            error: null,
          });
        }
      }
    );

    // Nettoyage de l'abonnement
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return state;
}
