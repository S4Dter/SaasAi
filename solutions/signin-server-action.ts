"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "../constants";
import { supabase } from "../lib/api/supabase/client";

/**
 * Server Action Next.js 15 pour l'authentification
 * - Exécute l'authentification côté serveur
 * - Gère les cookies de session
 * - Redirige directement vers le tableau de bord approprié
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
    // Utilisation du client Supabase côté serveur
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
    
    // IMPORTANT: Créer le cookie de session avec le rôle pour le middleware
    const sessionData = {
      id: user.id,
      email: user.email || email,
      role: userRole,
      timestamp: Date.now()
    };
    
    // Configuration du cookie de session (accessible côté client pour le middleware)
    // Utilisation de l'API compatible avec Next.js 15
    const cookieJar = cookies();
    
    cookieJar.set('user-session', encodeURIComponent(JSON.stringify(sessionData)), {
      httpOnly: false, // Nécessaire pour que le middleware y accède
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    
    // Cookie Supabase (stocké par Supabase, mais nous assurons qu'il est correctement configuré)
    // C'est optionnel car Supabase gère déjà ce cookie, mais cela garantit qu'il est configuré correctement
    const supaSessionToken = data.session?.access_token;
    if (supaSessionToken) {
      cookieJar.set('supabase-auth-token', supaSessionToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
    }
    
    // Redirection basée sur le rôle
    if (userRole === 'creator') {
      redirect(ROUTES.DASHBOARD.CREATOR.ROOT);
    } else {
      redirect(ROUTES.DASHBOARD.ENTERPRISE.ROOT);
    }
    
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
