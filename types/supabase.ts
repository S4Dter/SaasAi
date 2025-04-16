import { User, Agent } from '../types';

/**
 * Types spécifiques à Supabase pour notre application
 */

// Format de retour de Supabase Auth
export interface SupabaseUser {
  id: string;
  email: string;
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata: {
    name?: string;
    avatar_url?: string;
    company?: string;
    role?: string;
    bio?: string;
    [key: string]: any;
  };
  aud: string;
  created_at: string;
}

// Type pour la table favorites
export interface Favorite {
  id: string;
  user_id: string;
  agent_id: string;
  created_at: string;
  agent?: Agent;
}

// Type générique pour le retour des hooks
export interface HookState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Type pour les paramètres de filtrage
export interface FilterParams {
  [key: string]: any;
}
