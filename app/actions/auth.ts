"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { ROUTES } from "../../constants";
import { createServerSupabaseClient } from "../../lib/api/auth-server";

/**
 * Server Action Next.js 15 pour l'authentification
 * - Exécute l'authentification côté serveur
 * - Gère les cookies de session
 * - Redirige vers le tableau de bord approprié
 */
export async function signInAction(formData: FormData) {
  // Récupération des données du formulaire
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // Validation des champs
  if (!email || !password) {
    return { 
      success: false,
      error: "Email et mot de passe requis" 
    };
  }
  
  try {
    // Utilisation du client Supabase spécifique pour Server Action
    const supabase = createServerSupabaseClient();
    
    // Authentification
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    if (!data?.user) {
      throw new Error("Échec d'authentification: aucun utilisateur retourné");
    }
    
    const user = data.user;
    
    // Récupération du rôle depuis la base de données
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, name')
      .eq('id', user.id)
      .single();
    
    // Détermination du rôle
    const userRole = !userError ? 
      userData?.role : 
      (user.user_metadata?.role || 'enterprise');
    
    // Note: Dans un Server Action Next.js 15, 
    // la gestion des cookies est automatique via Supabase.
    // Supabase défini lui-même les cookies nécessaires lors de l'authentification.
    
    // Nous pouvons simplement rediriger vers le tableau de bord approprié
    const dashboardPath = userRole === 'creator' 
      ? ROUTES.DASHBOARD.CREATOR.ROOT 
      : ROUTES.DASHBOARD.ENTERPRISE.ROOT;
    
    // Rediriger vers le tableau de bord approprié
    redirect(dashboardPath);
    
  } catch (error: any) {
    // Gestion des erreurs
    console.error('Erreur de connexion:', error);
    
    let errorMessage = "Une erreur est survenue lors de la connexion";
    
    if (error.message?.includes('Invalid login credentials')) {
      errorMessage = "Email ou mot de passe incorrect";
    } else if (error.message?.includes('not found')) {
      errorMessage = "Aucun compte n'est associé à cette adresse email";
    }
    
    return { 
      success: false,
      error: errorMessage 
    };
  }
}
