import { Metadata } from 'next';
import { APP_NAME } from '@/constants';
import { createServerSupabaseClient } from '@/lib/api/auth-server';
import EnterpriseDashboardClient from './EnterpriseDashboardClient';

export const metadata: Metadata = {
  title: `Tableau de bord Entreprise | ${APP_NAME}`,
  description: 'Gérez vos favoris, historique et retrouvez des suggestions personnalisées',
};

/**
 * Page principale du dashboard entreprise avec nouvelle logique d'authentification
 * Implémentation robuste pour éviter les boucles infinies et redirections
 */
export default async function EnterpriseDashboardPage() {
  // Obtenir un client Supabase côté serveur
  const supabase = createServerSupabaseClient();
  
  // Tenter de récupérer les données utilisateur avec gestion d'erreur
  let userData = {
    id: '',
    email: '',
    name: '',
    role: 'enterprise'
  };
  
  try {
    // Récupérer la session utilisateur
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Erreur lors de la récupération de la session:', sessionError.message);
    } else if (sessionData?.session?.user) {
      const user = sessionData.session.user;
      
      // Essayer de récupérer des données supplémentaires depuis la BD
      try {
        const { data: userDBData } = await supabase
          .from('users')
          .select('name, role')
          .eq('id', user.id)
          .single();
          
        // Préparer les données utilisateur pour le client
        userData = {
          id: user.id,
          email: user.email || '',
          name: userDBData?.name || user.user_metadata?.name || user.email || '',
          role: userDBData?.role || user.user_metadata?.role || 'enterprise'
        };
        
      } catch (dbError) {
        console.error('Erreur BD lors de la récupération des données utilisateur:', dbError);
        // Utiliser les données de base même en cas d'erreur de BD
        userData = {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || user.email || '',
          role: user.user_metadata?.role || 'enterprise'
        };
      }
    }
  } catch (error) {
    console.error('Exception lors de la vérification d\'authentification:', error);
    // Ne pas redirect - laisser le client gérer l'état non authentifié
  }
  
  // Log des données transmises au client - supprimable en production
  console.log('EnterpriseDashboardPage transmit au client:', JSON.stringify(userData));
  
  // Passage des données au composant client (même si l'utilisateur n'est pas authentifié)
  return <EnterpriseDashboardClient userData={userData} />;
}
