import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/api/supabase/client';
import { User } from '../types';
import { SupabaseUser, HookState } from '../types/supabase';
import { ROUTES } from '../constants';

/**
 * Hook d'authentification optimisé pour Next.js 15 avec App Router
 * - Synchronise les cookies, localStorage et état React
 * - Gère les redirections après authentification
 * - Supporte un système robuste de déconnexion
 */
export function useAuthOptimized(): HookState<User> & {
  signOut: () => Promise<void>;
  redirectToDashboard: () => void;
} {
  const router = useRouter();
  const [state, setState] = useState<HookState<User>>({
    data: null,
    loading: true,
    error: null,
  });

  /**
   * Récupère les données utilisateur depuis Supabase
   */
  const getUser = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      // Récupération de la session Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;

      // Si pas de session, l'utilisateur n'est pas connecté
      if (!session) {
        setState({
          data: null,
          loading: false,
          error: null,
        });
        return null;
      }

      // Récupération des données utilisateur Supabase
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const supaUser = userData.user as SupabaseUser;
      
      // Récupération des données utilisateur depuis la table users
      const { data: dbUser, error: dbUserError } = await supabase
        .from('users')
        .select('*')
        .eq('id', supaUser.id)
        .single();
      
      if (dbUserError) {
        console.error('Erreur lors de la récupération des données utilisateur:', dbUserError);
      }
      
      // Construction de l'objet utilisateur
      const user: User = {
        id: supaUser.id,
        email: supaUser.email,
        name: dbUser?.name || supaUser.user_metadata.name || 'Utilisateur',
        role: (dbUser?.role as User['role']) || (supaUser.user_metadata.role as User['role']) || 'enterprise',
        avatar: dbUser?.avatar || supaUser.user_metadata.avatar_url,
        company: dbUser?.company || supaUser.user_metadata.company,
        bio: dbUser?.bio || supaUser.user_metadata.bio,
        createdAt: dbUser?.created_at ? new Date(dbUser.created_at) : new Date(supaUser.created_at),
      };
      
      setState({
        data: user,
        loading: false,
        error: null,
      });

      // IMPORTANT: Synchroniser les données avec le cookie de session
      // Ce cookie est utilisé par le middleware pour les redirections côté serveur
      const sessionData = {
        id: user.id,
        email: user.email,
        role: user.role,
        timestamp: Date.now()
      };
      
      // Mise à jour du cookie avec les données actuelles
      document.cookie = `user-session=${encodeURIComponent(JSON.stringify(sessionData))}; path=/; max-age=604800; SameSite=Strict`;
      
      // Synchronisation avec localStorage pour la persistance client-side
      localStorage.setItem('user-id', user.id);
      localStorage.setItem('user-role', user.role);
      localStorage.setItem('user-email', user.email || '');
      localStorage.setItem('user-name', user.name);
      
      return user;
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Erreur d\'authentification inconnue'),
      });
      return null;
    }
  }, []);

  /**
   * Déconnexion de l'utilisateur
   */
  const signOut = useCallback(async () => {
    try {
      // Déconnexion côté Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Nettoyage des cookies
      document.cookie = 'user-session=; path=/; max-age=0; SameSite=Strict';
      
      // Nettoyage du localStorage
      localStorage.removeItem('user-id');
      localStorage.removeItem('user-role');
      localStorage.removeItem('user-email');
      localStorage.removeItem('user-name');
      
      // Mise à jour de l'état
      setState({
        data: null,
        loading: false,
        error: null,
      });
      
      // Redirection vers la page d'accueil
      router.push(ROUTES.HOME);
      
      // Forcer un rafraîchissement complet pour vider tous les états
      // Cette ligne est optionnelle mais résout de nombreux problèmes de persistance d'état
      window.location.href = ROUTES.HOME;
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }, [router]);

  /**
   * Fonction de redirection vers le tableau de bord approprié
   */
  const redirectToDashboard = useCallback(() => {
    if (!state.data) return;
    
    const userRole = state.data.role;
    if (userRole === 'creator') {
      router.push(ROUTES.DASHBOARD.CREATOR.ROOT);
    } else {
      router.push(ROUTES.DASHBOARD.ENTERPRISE.ROOT);
    }
  }, [router, state.data]);

  useEffect(() => {
    // Récupération initiale des données utilisateur
    getUser();
    
    // S'abonner aux changements d'état d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          await getUser();
        } else if (event === 'SIGNED_OUT') {
          setState({
            data: null,
            loading: false,
            error: null,
          });
          
          // Nettoyage des cookies et localStorage lors de la déconnexion
          document.cookie = 'user-session=; path=/; max-age=0; SameSite=Strict';
          localStorage.removeItem('user-id');
          localStorage.removeItem('user-role');
          localStorage.removeItem('user-email');
          localStorage.removeItem('user-name');
        }
      }
    );

    // Nettoyage de l'abonnement
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [getUser]);

  return {
    ...state,
    signOut,
    redirectToDashboard,
  };
}
