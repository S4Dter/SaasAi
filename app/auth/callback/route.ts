import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * Gestionnaire de routes pour les callbacks d'authentification Supabase
 * Cette route est appelée après la vérification de l'email
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    try {
      // Échange du code d'autorisation contre une session
      // Note: Ceci est simplifié car normalement on utiliserait createRouteHandlerClient 
      // avec auth-helpers-nextjs pour gérer les cookies correctement
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error('Erreur lors de l\'échange de code:', error);
    }
  }

  // Rediriger vers la page d'accueil après vérification
  return NextResponse.redirect(new URL('/', request.url));
}
