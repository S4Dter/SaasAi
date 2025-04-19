import { supabase } from '../supabaseClient';
import { AuthError, AuthResponse } from '@supabase/supabase-js';

/**
 * S'inscrire avec email et mot de passe
 * @param email - L'adresse email de l'utilisateur
 * @param password - Le mot de passe de l'utilisateur
 * @returns Une promesse contenant la réponse d'authentification
 */
export async function signUpWithEmail(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    if (response.error) {
      console.error("Erreur d'inscription:", response.error.message);
      throw response.error;
    }
    
    return response;
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    throw error;
  }
}

/**
 * Se connecter avec email et mot de passe
 * @param email - L'adresse email de l'utilisateur
 * @param password - Le mot de passe de l'utilisateur
 * @returns Une promesse contenant la réponse d'authentification
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await supabase.auth.signInWithPassword({ email, password });
    
    if (response.error) {
      console.error("Erreur de connexion:", response.error.message);
      throw response.error;
    }
    
    return response;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    throw error;
  }
}

/**
 * Se déconnecter
 * @returns Une promesse indiquant le succès ou l'échec de la déconnexion
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  return await supabase.auth.signOut();
}
