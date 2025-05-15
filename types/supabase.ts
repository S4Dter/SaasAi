export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'creator' | 'enterprise' | 'admin';
          avatar?: string | null;
          company?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role: 'creator' | 'enterprise' | 'admin';
          avatar?: string | null;
          company?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      agents: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          category?: string | null;
          creator_id: string;
          pricing: any; // JSON type
          featured?: boolean | null;
          logo_url?: string | null;
          integrations: string[];
          demo_url?: string | null;
          demo_video_url?: string | null;
          screenshots: string[];
          created_at?: string;
          updated_at?: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          category?: string | null;
          creator_id: string;
          pricing: any; // JSON type
          featured?: boolean | null;
          logo_url?: string | null;
          integrations?: string[];
          demo_url?: string | null;
          demo_video_url?: string | null;
          screenshots?: string[];
          created_at?: string;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['agents']['Insert']>;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          agent_id: string;
          created_at?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          agent_id: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['favorites']['Insert']>;
      };
      agent_views: {
        Row: {
          id: string;
          agent_id: string;
          creator_id: string;
          count?: number;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          creator_id: string;
          count?: number;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['agent_views']['Insert']>;
      };
      agent_conversions: {
        Row: {
          id: string;
          agent_id: string;
          creator_id: string;
          count?: number;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          creator_id: string;
          count?: number;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['agent_conversions']['Insert']>;
      };
      contacts: {
        Row: {
          id: string;
          agent_id: string;
          enterprise_id: string;
          creator_id: string;
          message: string;
          status: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          enterprise_id: string;
          creator_id: string;
          message: string;
          status: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['contacts']['Insert']>;
      };
      prospects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          company: string;
          email: string;
          avatar?: string | null;
          location?: string | null;
          industry_interest: string;
          budget: string;
          company_size: string;
          needs?: string | null;
          match_score: number;
          contacted: boolean;
          last_activity?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          company: string;
          email: string;
          avatar?: string | null;
          location?: string | null;
          industry_interest: string;
          budget: string;
          company_size: string;
          needs?: string | null;
          match_score?: number;
          contacted?: boolean;
          last_activity?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['prospects']['Insert']>;
      };
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
