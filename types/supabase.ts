export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'creator' | 'enterprise';
          created_at: string;
          updated_at?: string | null;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role: 'creator' | 'enterprise';
          created_at?: string;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      agents: {
        Row: {
          id: string;
          name: string;
          description: string;
          creator_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          creator_id: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['agents']['Insert']>;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          agent_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          agent_id: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['favorites']['Insert']>;
      };
      // Tu peux ajouter ici les autres tables comme contacts, agent_views, etc.
    };
    Views: {};
    Functions: {};
  };
};

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
