"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
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
    
    // Dans Next.js 15, on utilise la méthode set de NextResponse.cookies
    // au lieu d'utiliser cookies() directement pour les Server Actions
    const dashboardPath = userRole === 'creator' 
      ? ROUTES.DASHBOARD.CREATOR.ROOT 
      : ROUTES.DASHBOARD.ENTERPRISE.ROOT;
    
    const response = NextResponse.redirect(new URL(dashboardPath, "http://localhost:3000"));
    
    // Configurer les cookies sur la réponse
    response.cookies.set({
      name: 'user-session',
      value: encodeURIComponent(JSON.stringify(sessionData)),
      httpOnly: false, // Nécessaire pour que le middleware y accède
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    
    // Stocker le token Supabase
    if (data.session?.access_token) {
      response.cookies.set({
        name: 'sb-auth-token',
        value: data.session.access_token,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }
    
    // Retourner la réponse avec les cookies et la redirection
    return response;
    
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
