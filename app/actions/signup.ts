'use server';

import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants';
import { createServerSupabaseClient } from '@/lib/api/auth-server';

/**
 * Server Action pour l'inscription d'un nouvel utilisateur
 * - Compatible avec la logique de déclencheurs Supabase
 * - Gère à la fois l'authentification et la table users
 */
export async function signUpAction(formData: FormData) {
  // Récupération des données du formulaire
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const userRole = formData.get('userType') as string || 'enterprise';
  
  // Validation des champs
  if (!email || !password) {
    return {
      success: false,
      error: 'Email et mot de passe requis'
    };
  }
  
  try {
    // Utilisation du client Supabase côté serveur
    const supabase = createServerSupabaseClient();
    
    // 1. Inscription via auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Les metadata sont synchronisées automatiquement avec la table users par Supabase
        data: {
          name,
          role: userRole,
          email_confirmed: false
        },
        // URL de redirection pour la confirmation d'email
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback`
      }
    });
    
    if (authError) throw authError;
    
    if (!data?.user) {
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
    
    // 2. Insertion dans la table users
    // Cette étape peut être omise si vous avez configuré un trigger Supabase
    // qui synchronise automatiquement auth.users avec votre table users
    
    // Si votre configuration Supabase utilise un trigger, cette étape est automatique
    // Si vous n'avez pas de trigger, décommentez ce code :
    /*
    const { error: insertError } = await supabase
      .from('users')
      .insert([{
        id: data.user.id,
        email: data.user.email,
        name: name || data.user.email?.split('@')[0] || 'Utilisateur',
        role: userRole,
        created_at: new Date().toISOString(),
      }]);
    
    if (insertError) {
      console.error('Erreur lors de l\'insertion dans la table users:', insertError);
      throw insertError;
    }
    */
    
    // Redirection vers la page de confirmation
    // ou directement connecter l'utilisateur et rediriger vers le dashboard
    return {
      success: true,
      message: 'Inscription réussie! Veuillez vérifier votre email pour confirmer votre compte.'
    };
    
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription:', error);
    
    let errorMessage = "Une erreur est survenue lors de l'inscription";
    
    if (error.message?.includes('email')) {
      errorMessage = "Cette adresse email est déjà utilisée";
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Server Action pour vérifier et confirmer l'email
 */
export async function confirmEmailAction(token: string) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Vérifier le token de confirmation
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email'
    });
    
    if (error) throw error;
    
    // L'utilisateur est maintenant confirmé
    // Rediriger vers la page de connexion ou dashboard
    redirect(ROUTES.AUTH.SIGNIN);
    
  } catch (error) {
    console.error('Erreur lors de la confirmation d\'email:', error);
    
    return {
      success: false,
      error: 'Le lien de confirmation a expiré ou est invalide'
    };
  }
}
