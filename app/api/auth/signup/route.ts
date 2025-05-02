import { createServerSupabaseClient } from '@/lib/api/auth-server';
import { validateSignUp } from '@/lib/validators/auth';
import { NextResponse } from 'next/server';

/**
 * API de gestion de l'inscription
 * Implémente la validation des données et la gestion des erreurs
 * Applique une valeur par défaut pour le champ name si non fourni
 */
export async function POST(request: Request) {
  try {
    // Extraire les données de la requête
    const body = await request.json();

    // Valider les données d'inscription avec Zod
    const validation = validateSignUp(body);

    if (!validation.success || !validation.data) {
      // Si la validation échoue, retourner les erreurs
      return NextResponse.json(
        {
          success: false,
          message: 'Erreur de validation',
          errors: validation.errors || { general: 'Données invalides' }
        },
        { status: 400 }
      );
    }

    // Données validées (avec transformation, ex: name="Anonymous" si vide)
    const validatedData = validation.data;

    // Créer un client Supabase côté serveur
    const supabase = createServerSupabaseClient();

    // Inscription via Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        // Inclure les métadonnées validées
        data: {
          name: validatedData.name, // Sera "Anonymous" si non fourni (grâce à Zod)
          role: validatedData.userType,
          email_confirmed: false
        },
        // URL de redirection pour la confirmation d'email
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback`
      }
    });

    // Gestion des erreurs d'authentification
    if (error) {
      console.error('Erreur Supabase Auth:', error);
      
      // Retourner une réponse d'erreur structurée
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          code: error.code || 'auth/unknown'
        },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur a bien été créé
    if (!data.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Échec de création de l'utilisateur"
        },
        { status: 500 }
      );
    }

    // Option: Si vous n'utilisez pas de trigger Supabase, vous pouvez
    // insérer manuellement l'utilisateur dans la table users ici.
    /* 
    try {
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          id: data.user.id,
          email: data.user.email,
          name: validatedData.name, // Nom validé (sera "Anonymous" si vide grâce à Zod)
          role: validatedData.userType,
          created_at: new Date().toISOString(),
        }]);
      
      if (insertError) {
        console.error('Erreur insertion utilisateur:', insertError);
        
        // Si l'erreur est une violation de contrainte NOT NULL
        if (insertError.code === '23502') {
          return NextResponse.json(
            {
              success: false,
              message: "Le champ nom est requis",
              code: 'database/not-null-violation',
              field: 'name'
            },
            { status: 400 }
          );
        }
        
        throw insertError;
      }
    } catch (dbError: any) {
      console.error('Erreur base de données:', dbError);
      
      // L'utilisateur a été créé dans auth mais pas dans la table users
      // On pourrait essayer de supprimer l'utilisateur auth ici pour éviter les incohérences
      
      return NextResponse.json(
        {
          success: false,
          message: 'Erreur lors de la création du profil utilisateur',
          dbError: dbError.message
        },
        { status: 500 }
      );
    }
    */

    // Succès - utilisateur créé
    return NextResponse.json(
      {
        success: true,
        message: 'Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.',
        user: {
          id: data.user.id,
          email: data.user.email,
          role: validatedData.userType,
          name: validatedData.name
        }
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    // Log détaillé côté serveur
    console.error('Erreur serveur lors de l\'inscription:', error);
    
    // Réponse générique pour l'utilisateur, sans détails sensibles
    return NextResponse.json(
      {
        success: false,
        message: 'Une erreur est survenue lors de l\'inscription',
        // Informations utiles pour le debug sans exposer de détails sensibles
        errorCode: error.code || 'unknown'
      },
      { status: 500 }
    );
  }
}
