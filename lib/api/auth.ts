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
    console.log('Inscription avec les métadonnées:', metadata);
    
    // Valider les métadonnées essentielles pour correspondre à la structure de la base de données
    if (!metadata?.role) {
      console.warn('Aucun rôle spécifié dans les métadonnées, utilisation de "enterprise" par défaut');
      metadata = { ...metadata, role: 'enterprise' };
    }
    
    // S'assurer que les métadonnées comprennent les champs requis par la table users
    if (!metadata.name && typeof email === 'string') {
      // Extraire un nom d'utilisateur de l'email si aucun nom n'est fourni
      const username = email.split('@')[0];
      metadata = { ...metadata, name: username };
    }
    
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

      // Note: Nous n'insérons plus l'utilisateur dans la table users ici
      // L'insertion sera effectuée seulement après confirmation de l'email
      // via la page de confirmation (/confirm)

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

      // Note: Nous n'insérons plus l'utilisateur dans la table users ici
      // L'insertion sera effectuée seulement après confirmation de l'email
      // via la page de confirmation (/confirm)

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
 * Fonction client uniquement qui nettoie localStorage et déconnecte Supabase
 * @returns Une promesse indiquant le succès ou l'échec de la déconnexion
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  if (typeof window === 'undefined') {
    throw new Error('La fonction signOut ne peut être utilisée que côté client');
  }

  try {
    // Nettoyer localStorage pour éviter les résidus de session
    localStorage.removeItem('user');
    localStorage.removeItem('supabase.auth.token');
    
    // Supprimer les cookies de session
    document.cookie = 'user-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'supabase-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    if (!supabase) {
      console.warn('Client Supabase non disponible, nettoyage manuel uniquement');
      return { error: null };
    }
    
    // Déconnexion côté Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Erreur lors de la déconnexion Supabase:', error);
      throw error;
    }
    
    console.log('Déconnexion réussie');
    
    // Force une actualisation complète pour effacer tout état en mémoire
    window.location.href = '/';
    
    return { error: null };
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return { error: error as AuthError };
  }
}
