'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Les variables d'environnement Supabase sont manquantes");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

import { AuthError, AuthResponse } from '@supabase/supabase-js';

/**
 * S'inscrire avec email et mot de passe
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

  if (!userData?.role) {
    userData = { ...userData, role: 'enterprise' };
  }

  if (!userData.name || (typeof userData.name === 'string' && userData.name.trim() === '')) {
    userData = { ...userData, name: email.split('@')[0] || 'Anonymous' };
  }

  const redirectUrl = options?.emailRedirectTo || `${window.location.origin}/auth/callback`;

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: userData.role,
          name: userData.name,
        },
        emailRedirectTo: redirectUrl
      }
    });

    if (authError) throw authError;
    if (!authData?.user) throw new Error("Échec de création du compte");

    const { data: profileData, error: profileError } = await supabase
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

    return {
      data: {
        user: authData.user,
        profile: profileError ? null : profileData,
        session: authData.session
      },
      error: null
    };

  } catch (error) {
    if (error instanceof Error && error.message.includes('debug_logs')) {
      const customError = new Error("Erreur de configuration de base de données. Veuillez contacter l'administrateur.");
      return { data: null, error: customError };
    }
    return { data: null, error };
  }
}

/**
 * Se connecter avec email et mot de passe
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  if (typeof window === 'undefined') {
    throw new Error('La fonction signInWithEmail ne peut être utilisée que côté client');
  }

  const response = await supabase.auth.signInWithPassword({ email, password });
  if (response.error) throw response.error;
  return response;
}

/**
 * Se déconnecter
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  if (typeof window === 'undefined') {
    throw new Error('La fonction signOut ne peut être utilisée que côté client');
  }

  try {
    localStorage.removeItem('user');
    localStorage.removeItem('supabase.auth.token');
    document.cookie = 'user-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'supabase-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    window.location.href = '/';
    return { error: null };
  } catch (error) {
    return { error: error as AuthError };
  }
}
