'use client';

import { supabase } from '../supabaseClient';
import { AuthError, AuthResponse } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

/**
 * S'inscrire avec email et mot de passe
 * Fonction client uniquement
 * @param email - L'adresse email de l'utilisateur
 * @param password - Le mot de passe de l'utilisateur
 * @param metadata - Les métadonnées utilisateur à stocker (optionnel)
 * @param options - Options supplémentaires (comme emailRedirectTo)
 * @returns Une promesse contenant la réponse d'authentification
 */
export async function signUpWithEmail(
  email: string, 
  password: string, 
  metadata?: Record<string, any>,
  options?: { emailRedirectTo?: string }
): Promise<AuthResponse> {
  if (typeof window === 'undefined') {
    throw new Error('La fonction signUpWithEmail ne peut être utilisée que côté client');
  }

  try {
    // Use global domain for redirects - important for email confirmation to work correctly
    const redirectUrl = options?.emailRedirectTo || `https://marketplaceagentai.vercel.app/auth/callback`;

    if (!supabase) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Variables d\'environnement Supabase manquantes');
      }

      const tempClient = createClient(supabaseUrl, supabaseKey);

      // S'inscrire avec Supabase Auth
      const response = await tempClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata,
        }
      });

      // Si l'inscription a réussi, insérer l'utilisateur dans la table users
      if (response.data.user && !response.error) {
        try {
          // Création de l'entrée dans la table users
          // Log de débogage
          console.log('Tentative d\'insertion utilisateur:', {
            id: response.data.user.id,
            email: email,
            role: metadata?.role || 'enterprise'
          });
          
          await tempClient
            .from('users')
            .insert({
              id: response.data.user.id,
              email: email,
              name: metadata?.name || email.split('@')[0], // Nom par défaut basé sur l'email
              role: metadata?.role || 'enterprise', // Rôle par défaut si non spécifié
              created_at: new Date().toISOString() // Utilisation de snake_case pour la compatibilité Supabase
            })
            .select();
        } catch (insertError) {
          console.error("Erreur lors de l'insertion dans la table users:", insertError);
          // On ne bloque pas l'inscription si l'insertion échoue
          // Le middleware de confirmation peut réessayer
        }
      }

      if (response.error) {
        console.error("Erreur d'inscription:", response.error.message);
        throw response.error;
      }

      return response;
    }

      // S'inscrire avec Supabase Auth
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata,
        }
      });

      // Si l'inscription a réussi, insérer l'utilisateur dans la table users
      if (response.data.user && !response.error) {
        try {
          // Création de l'entrée dans la table users
          // Log de débogage
          console.log('Tentative d\'insertion utilisateur:', {
            id: response.data.user.id,
            email: email,
            role: metadata?.role || 'enterprise'
          });
          
          await supabase
            .from('users')
            .insert({
              id: response.data.user.id,
              email: email,
              name: metadata?.name || email.split('@')[0], // Nom par défaut basé sur l'email
              role: metadata?.role || 'enterprise', // Rôle par défaut si non spécifié
              created_at: new Date().toISOString() // Utilisation de snake_case pour la compatibilité Supabase
            })
            .select(); // Ajout de select() pour voir si l'insertion réussit
        } catch (insertError) {
          console.error("Erreur lors de l'insertion dans la table users:", insertError);
          // On ne bloque pas l'inscription si l'insertion échoue
          // Le middleware de confirmation peut réessayer
        }
      }

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
  if (typeof window === 'undefined') {
    throw new Error('La fonction signInWithEmail ne peut être utilisée que côté client');
  }

  try {
    if (!supabase) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Variables d\'environnement Supabase manquantes');
      }

      const tempClient = createClient(supabaseUrl, supabaseKey);

      const response = await tempClient.auth.signInWithPassword({ email, password });

      if (response.error) {
        console.error("Erreur de connexion:", response.error.message);
        throw response.error;
      }

      return response;
    }

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
  if (typeof window === 'undefined') {
    throw new Error('La fonction signOut ne peut être utilisée que côté client');
  }

  if (!supabase) {
    throw new Error('Client Supabase non disponible');
  }

  return await supabase.auth.signOut();
}
