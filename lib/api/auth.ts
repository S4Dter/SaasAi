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
  userData?: Record<string, any>,
  options?: { emailRedirectTo?: string }
): Promise<{ data: any; error: any }> {
  if (typeof window === 'undefined') {
    throw new Error('La fonction signUpWithEmail ne peut être utilisée que côté client');
  }

  // Sauvegarder la fonction debug originale
  const originalDebug = console.debug;
  
  // Valider les métadonnées essentielles pour correspondre à la structure de la base de données
  if (!userData?.role) {
    userData = { ...userData, role: 'enterprise' };
  }
  
  // S'assurer que les métadonnées comprennent un nom (obligatoire en base de données)
  if (!userData.name || (typeof userData.name === 'string' && userData.name.trim() === '')) {
    userData = { ...userData, name: email.split('@')[0] || 'Anonymous' };
  }
  
  // Use global domain for redirects - important for email confirmation to work correctly
  const redirectUrl = options?.emailRedirectTo || 
    (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : `https://marketplaceagentai.vercel.app/auth/callback`);

  // Si supabase n'est pas disponible, créer un client temporaire
  const client = supabase || (() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Variables d\'environnement Supabase manquantes');
    }

    return createClient(supabaseUrl, supabaseKey);
  })();

  try {
    // Désactiver temporairement console.debug pour éviter des erreurs debug_logs
    console.debug = () => {};
    
    // 1. Créer l'auth user
    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: userData.role,
          name: userData.name || email.split('@')[0],
        },
        emailRedirectTo: redirectUrl
      }
    });
    
    // Restaurer console.debug
    console.debug = originalDebug;

    if (authError) {
      throw authError;
    }
    
    if (!authData?.user) {
      throw new Error("Échec de création du compte");
    }

    // 2. Insérer dans users - pas besoin de transactions explicites
    // Supabase gère automatiquement la transaction implicite
    // Désactiver à nouveau console.debug pour l'opération d'insertion
    console.debug = () => {};
    
    const { data: profileData, error: profileError } = await client
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        role: userData.role,
        name: userData.name || email.split('@')[0] || 'Anonymous',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    // Restaurer console.debug
    console.debug = originalDebug;

    // Si erreur d'insertion dans le profil, on continue quand même
    // L'utilisateur pourra compléter son profil plus tard
    
    return { 
      data: { 
        user: authData.user, 
        profile: profileError ? null : profileData,
        session: authData.session
      }, 
      error: null 
    };
    
  } catch (error) {
    // En cas d'erreur, s'assurer que console.debug est restauré
    if (typeof window !== 'undefined' && console.debug.toString().includes('() => {}')) {
      console.debug = originalDebug || console.log;
    }
    
    // Si l'erreur mentionne debug_logs, modifier le message pour plus de clarté
    if (error instanceof Error && error.message.includes('debug_logs')) {
      const customError = new Error('Erreur de configuration de base de données. Veuillez contacter l\'administrateur.');
      return { data: null, error: customError };
    }
    
    return { data: null, error };
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
        throw response.error;
      }

      return response;
    }

    const response = await supabase.auth.signInWithPassword({ email, password });

    if (response.error) {
      throw response.error;
    }

    return response;
  } catch (error) {
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
      return { error: null };
    }
    
    // Déconnexion côté Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    // Force une actualisation complète pour effacer tout état en mémoire
    window.location.href = '/';
    
    return { error: null };
  } catch (error) {
    return { error: error as AuthError };
  }
}
