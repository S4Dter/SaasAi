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

  // Commencer une transaction explicite
  const { error: beginError } = await client.rpc('begin_transaction');
  if (beginError) {
    return { data: null, error: beginError };
  }
  
  try {
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

    if (authError) {
      // Annuler la transaction en cas d'erreur
      await client.rpc('rollback_transaction');
      throw authError;
    }
    
    if (!authData?.user) {
      await client.rpc('rollback_transaction');
      throw new Error("Échec de création du compte");
    }

    // 2. Insérer dans users
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

    if (profileError) {
      await client.rpc('rollback_transaction');
      throw profileError;
    }

    // 3. Valider la transaction
    const { error: commitError } = await client.rpc('commit_transaction');
    if (commitError) {
      await client.rpc('rollback_transaction');
      throw commitError;
    }

    return { 
      data: { 
        user: authData.user, 
        profile: profileData,
        session: authData.session
      }, 
      error: null 
    };
    
  } catch (error) {
    // S'assurer que la transaction est annulée en cas d'erreur
    try {
      await client.rpc('rollback_transaction');
    } catch (rollbackError) {
      // Erreur silencieuse pour éviter de briser le flux
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
