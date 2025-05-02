import { Session, User as SupabaseUser, UserMetadata } from '@supabase/supabase-js';

/**
 * Types pour l'authentification et les événements de session
 */

// Type pour les événements d'authentification Supabase
export type AuthChangeEvent = 
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'USER_UPDATED'
  | 'PASSWORD_RECOVERY'
  | 'TOKEN_REFRESHED';

// Type pour les données de session utilisateur stockées dans les cookies
export interface SessionCookieData {
  id: string;
  email: string | null;
  role: string;
  timestamp: number;
}

// Structure d'erreur d'authentification
export interface AuthError {
  message: string;
  code?: string;
  statusCode?: number;
}

// Types pour la réponse d'authentification
export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  error?: string;
  redirectTo?: string;
}

// Type pour les données utilisateur personnalisées
export interface CustomUserData {
  name?: string;
  role?: string;
  avatar?: string;
  company?: string;
  bio?: string;
  created_at?: string;
}

// Type pour les options de cookie
export interface CookieOptions {
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
}
