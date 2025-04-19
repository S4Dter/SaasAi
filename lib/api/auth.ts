'use client';

import { supabase } from '../supabaseClient';
import { AuthError, AuthResponse } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

/**
 * S'inscrire avec email et mot de passe
 * Fonction client uniquement
 * @param email - L'adresse email de l'utilisateur
 * @param password - Le mot de passe de l'utilisateur
 * @returns Une promesse contenant la réponse d'authentification
 */
export async function signUpWithEmail(email: string, password: string): Promise<AuthResponse> {
  // Vérifier que nous sommes bien côté client
  if (typeof window === 'undefined') {
    throw new Error('La fonction signUpWithEmail ne peut être utilisée que côté client');
  }

  try {
    // Vérifier si le client supabase est disponible
    if (!supabase) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Variables d\'environnement Supabase manquantes');
      }
      
      // Créer un client temporaire si nécessaire
      const tempClient = createClient(supabaseUrl, supabaseKey);
      
      const response = await tempClient.auth.signUp({
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
    }
    
    // Utiliser le client supabase global si disponible
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
 * Fonction client uniquement
 * @param email - L'adresse email de l'utilisateur
 * @param password - Le mot de passe de l'utilisateur
 * @returns Une promesse contenant la réponse d'authentification
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  // Vérifier que nous sommes bien côté client
  if (typeof window === 'undefined') {
    throw new Error('La fonction signInWithEmail ne peut être utilisée que côté client');
  }

  try {
    // Vérifier si le client supabase est disponible
    if (!supabase) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Variables d\'environnement Supabase manquantes');
      }
      
      // Créer un client temporaire si nécessaire
      const tempClient = createClient(supabaseUrl, supabaseKey);
      
      const response = await tempClient.auth.signInWithPassword({ email, password });
      
      if (response.error) {
        console.error("Erreur de connexion:", response.error.message);
        throw response.error;
      }
      
      return response;
    }
    
    // Utiliser le client supabase global si disponible
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
 * Fonction client uniquement
 * @returns Une promesse indiquant le succès ou l'échec de la déconnexion
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  // Vérifier que nous sommes bien côté client
  if (typeof window === 'undefined') {
    throw new Error('La fonction signOut ne peut être utilisée que côté client');
  }

  if (!supabase) {
    throw new Error('Client Supabase non disponible');
  }
  
  return await supabase.auth.signOut();
}
