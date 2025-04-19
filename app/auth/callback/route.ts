import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Gestionnaire de routes pour les callbacks d'authentification Supabase
 * Cette route est appelée après la vérification de l'email
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    try {
      // Créer un client Supabase spécifique pour cette requête serveur
      // En utilisant explicitement les variables d'environnement
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Échange du code d'autorisation contre une session
        await supabase.auth.exchangeCodeForSession(code);
      } else {
        console.error('Variables d\'environnement Supabase manquantes');
      }
    } catch (error) {
      console.error('Erreur lors de l\'échange de code:', error);
    }
  }

  // Rediriger vers la page d'accueil après vérification
  return NextResponse.redirect(new URL('/', request.url));
}
