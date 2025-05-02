import { supabase } from '../supabaseClient';
import { createServerSupabaseClient } from './auth-server';
import { User } from '@/types';

/**
 * Fonction pour créer un nouvel utilisateur avec Supabase
 * Gère à la fois l'authentification et l'insertion dans la table users
 * Compatible avec le client (use client) et le serveur (server actions)
 */
export async function signUpUser(
  email: string,
  password: string,
  userData: Partial<User>
) {
  const isClient = typeof window !== 'undefined';
  
  try {
    // Utiliser le client approprié selon le contexte
    const client = isClient ? supabase : createServerSupabaseClient();
    
    // 1. Inscription via auth
    const { data, error: authError } = await client.auth.signUp({
      email,
      password,
      options: {
        // Les metadata sont automatiquement synchronisées avec la base
        data: {
          name: userData.name,
          role: userData.role || 'enterprise', // Valeur par défaut
          // Autres métadonnées importantes
          email_confirmed: false
        },
        // Ajoutez ici l'URL de redirection pour la confirmation d'email
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback`
      }
    });
    
    if (authError) throw authError;
    
    if (!data?.user) {
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
    
    const user = data.user;
    
    // 2. Insérer dans la table users
    // Note: Cette étape peut être remplacée par un trigger Supabase
    // qui synchronise automatiquement auth.users avec votre table users
    
    // Option 1: Si vous avez un trigger configuré
    // Dans ce cas, aucune action supplémentaire n'est nécessaire
    
    // Option 2: Insertion manuelle (en commentaire si vous avez un trigger)
    /* 
    const { error: insertError } = await client
      .from('users')
      .insert([{
        id: user.id, // Même ID que auth.users
        email: user.email,
        name: userData.name || user.email?.split('@')[0] || 'Utilisateur',
        role: userData.role || 'enterprise',
        company: userData.company,
        bio: userData.bio,
        avatar: userData.avatar,
        created_at: new Date().toISOString(),
      }]);
    
    if (insertError) {
      console.error('Erreur lors de l\'insertion dans la table users:', insertError);
      throw insertError;
    }
    */
    
    return {
      success: true,
      user: user,
      message: 'Inscription réussie! Veuillez vérifier votre email pour confirmer votre compte.'
    };

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Récupère les données utilisateur depuis la table users
 * @param userId ID de l'utilisateur
 */
export async function getUserData(userId: string) {
  const isClient = typeof window !== 'undefined';
  const client = isClient ? supabase : createServerSupabaseClient();
  
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    return null;
  }
  
  return data;
}

/**
 * Met à jour les données utilisateur dans la table users
 * @param userId ID de l'utilisateur
 * @param userData Données à mettre à jour
 */
export async function updateUserData(userId: string, userData: Partial<User>) {
  const isClient = typeof window !== 'undefined';
  const client = isClient ? supabase : createServerSupabaseClient();
  
  // Mise à jour des metadata de l'utilisateur pour garder la cohérence
  await client.auth.updateUser({
    data: {
      name: userData.name,
      role: userData.role,
      company: userData.company,
      avatar_url: userData.avatar
    }
  });
  
  // Mise à jour dans la table users
  const { data, error } = await client
    .from('users')
    .update(userData)
    .eq('id', userId)
    .select();
  
  if (error) {
    console.error('Erreur lors de la mise à jour des données utilisateur:', error);
    throw error;
  }
  
  return data?.[0] || null;
}
