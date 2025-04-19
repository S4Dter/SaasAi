import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Gestionnaire de routes pour les callbacks d'authentification Supabase
 * Cette route est appelée après la vérification de l'email
 */
export const dynamic = 'force-dynamic'; // Éviter le prérendu des routes API

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    
    if (code) {
      // Créer un client Supabase spécifique pour cette requête serveur
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('Variables d\'environnement Supabase manquantes');
        // Rediriger vers la page d'accueil avec un paramètre d'erreur
        return NextResponse.redirect(
          new URL(`/?error=config_error`, request.url)
        );
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Échange du code d'autorisation contre une session
      await supabase.auth.exchangeCodeForSession(code);
      
      // Rediriger vers la page d'accueil après succès
      return NextResponse.redirect(new URL('/?verified=true', request.url));
    }
  } catch (error) {
    console.error('Erreur lors de l\'échange de code:', error);
    // Rediriger vers la page d'accueil avec un paramètre d'erreur
    return NextResponse.redirect(
      new URL(`/?error=auth_error`, request.url)
    );
  }

  // Rediriger vers la page d'accueil si aucun code trouvé
  return NextResponse.redirect(new URL('/', request.url));
}
