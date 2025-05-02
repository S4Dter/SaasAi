'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@/types';
import { ROUTES } from '@/constants';
import { AuthChangeEvent } from '@/types/auth';
import { Session } from '@supabase/supabase-js';

// Types pour le contexte d'authentification
interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

type AuthAction =
  | { type: 'LOADING' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ERROR'; payload: Error };

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  redirectToDashboard: () => void;
}

// État initial
const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

// Créer le contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Réducteur pour les actions d'authentification
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { user: action.payload, loading: false, error: null };
    case 'LOGOUT':
      return { user: null, loading: false, error: null };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

// Provider pour envelopper l'application
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // Fonction pour rediriger vers le tableau de bord approprié
  const redirectToDashboard = () => {
    if (!state.user) return;

    const userRole = state.user.role;
    if (userRole === 'creator') {
      router.push(ROUTES.DASHBOARD.CREATOR.ROOT);
    } else {
      router.push(ROUTES.DASHBOARD.ENTERPRISE.ROOT);
    }
  };

  // Connexion de l'utilisateur
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOADING' });

      // Connexion à Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data?.user) {
        throw new Error("Échec d'authentification: aucun utilisateur retourné");
      }

      const user = data.user;

      // Récupération du rôle depuis la base de données
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, name')
        .eq('id', user.id)
        .single();

      // Construction de l'objet utilisateur
      const userObj: User = {
        id: user.id,
        email: user.email!,
        name: userData?.name || user.user_metadata.name || 'Utilisateur',
        role: (userData?.role as User['role']) || (user.user_metadata.role as User['role']) || 'enterprise',
        avatar: userData?.avatar || user.user_metadata.avatar_url,
        company: userData?.company || user.user_metadata.company,
        bio: userData?.bio || user.user_metadata.bio,
        createdAt: userData?.created_at ? new Date(userData.created_at) : new Date(user.created_at),
      };

      // Mettre à jour le contexte
      dispatch({ type: 'LOGIN_SUCCESS', payload: userObj });

      // Stocker les informations dans le cookie pour le middleware
      const sessionData = {
        id: userObj.id,
        email: userObj.email,
        role: userObj.role,
        timestamp: Date.now(),
      };

      document.cookie = `user-session=${encodeURIComponent(
        JSON.stringify(sessionData)
      )}; path=/; max-age=604800; SameSite=Lax; secure=${location.protocol === 'https:'}`;

      // Stockage localStorage pour persistance client
      localStorage.setItem('user-id', userObj.id);
      localStorage.setItem('user-role', userObj.role);
      localStorage.setItem('user-email', userObj.email);
      localStorage.setItem('user-name', userObj.name);

      return { success: true };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      const err = error instanceof Error ? error : new Error('Erreur de connexion inconnue');
      dispatch({ type: 'ERROR', payload: err });
      return {
        success: false,
        error: err.message,
      };
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      
      // Nettoyer les cookies et localStorage
      document.cookie = 'user-session=; path=/; max-age=0; SameSite=Lax';
      localStorage.removeItem('user-id');
      localStorage.removeItem('user-role');
      localStorage.removeItem('user-email');
      localStorage.removeItem('user-name');
      
      dispatch({ type: 'LOGOUT' });
      router.push(ROUTES.HOME);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Récupération de la session Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (!session) {
          dispatch({ type: 'LOGOUT' });
          return;
        }

        // Récupérer les données utilisateur à partir de la session
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        const user = userData.user;

        // Récupération des données supplémentaires depuis la base de données
        const { data: dbUser, error: dbError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        // Construction de l'objet utilisateur
        const userObj: User = {
          id: user.id,
          email: user.email!,
          name: dbUser?.name || user.user_metadata.name || 'Utilisateur',
          role: (dbUser?.role as User['role']) || (user.user_metadata.role as User['role']) || 'enterprise',
          avatar: dbUser?.avatar || user.user_metadata.avatar_url,
          company: dbUser?.company || user.user_metadata.company,
          bio: dbUser?.bio || user.user_metadata.bio,
          createdAt: dbUser?.created_at ? new Date(dbUser.created_at) : new Date(user.created_at),
        };

        dispatch({ type: 'LOGIN_SUCCESS', payload: userObj });

        // Mise à jour du cookie pour le middleware
        const sessionData = {
          id: userObj.id,
          email: userObj.email,
          role: userObj.role,
          timestamp: Date.now(),
        };

        document.cookie = `user-session=${encodeURIComponent(
          JSON.stringify(sessionData)
        )}; path=/; max-age=604800; SameSite=Lax; secure=${location.protocol === 'https:'}`;

      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        dispatch({ type: 'LOGOUT' });
      }
    };

    checkAuth();

    // S'abonner aux changements d'état d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          checkAuth();
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'LOGOUT' });
        }
      }
    );

    return () => {
      // Nettoyer l'abonnement
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  // Exposer l'état et les fonctions d'authentification
  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        redirectToDashboard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte d'authentification
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}
