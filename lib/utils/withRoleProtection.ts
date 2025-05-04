'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { ROUTES } from '@/constants';

/**
 * Fonction utilitaire pour vérifier l'authentification et le rôle de l'utilisateur côté serveur.
 * Utilisée pour protéger les routes du dashboard selon le rôle attendu.
 * 
 * @param expectedRole - Le rôle attendu pour accéder à la page ('creator' ou 'enterprise')
 * @returns Les données utilisateur si l'authentification et le rôle sont valides
 */
export async function withRoleProtection(expectedRole: 'creator' | 'enterprise') {
  // Détecter si nous sommes en mode génération statique (build)
  const isStaticGeneration = process.env.NEXT_PHASE === 'phase-production-build';
  
  // Si nous sommes en génération statique, retourner des données factices pour éviter les erreurs
  if (isStaticGeneration) {
    console.log('Mode génération statique détecté. Retour de données placeholder.');
    return {
      user: { id: 'static-generation-user-id' },
      role: expectedRole,
      email: `placeholder@example.com`,
      name: `Placeholder ${expectedRole.charAt(0).toUpperCase() + expectedRole.slice(1)}`,
    };
  }
  
  // Créer les variables en dehors du bloc try pour les rendre accessibles plus tard
  let supabase;
  let user;

  try {
    // Importation de notre client serveur Supabase personnalisé
    const { createServerSupabaseClient } = await import('@/lib/api/auth-server');
    
    // Utilisation du client serveur qui gère correctement les cookies
    supabase = createServerSupabaseClient();
    
    // Vérifier si l'utilisateur est connecté, avec gestion d'erreur renforcée
    const { data: userData, error: userError } = await supabase.auth.getUser()
      .catch(error => {
        console.error('Erreur Supabase lors de getUser:', error);
        return { data: { user: null }, error };
      });

    // Assigner l'utilisateur à la variable déclarée plus haut
    user = userData.user;

    // Si l'utilisateur n'est pas connecté ou en cas d'erreur, rediriger vers la page de connexion
    if (userError || !user) {
      console.error('Authentification échouée:', userError);
      redirect(ROUTES.AUTH.SIGNIN);
    }
  } catch (error) {
    console.error('Exception lors de la vérification d\'authentification:', error);
    redirect(ROUTES.AUTH.SIGNIN);
  }

  // S'assurer que supabase et user sont définis
  if (!supabase || !user) {
    console.error('Variables supabase ou user non définies après la vérification');
    redirect(ROUTES.AUTH.SIGNIN);
  }

  // Récupérer le rôle de l'utilisateur depuis la table users
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  // Si on ne trouve pas le rôle dans la BD, essayer de le récupérer depuis les métadonnées utilisateur
  if (roleError) {
    console.error('Erreur lors de la récupération du rôle:', roleError);
    
    // Vérifier les métadonnées de l'utilisateur pour le rôle
    const userMetadataRole = user.user_metadata?.role;
    
    // Si le rôle ne correspond pas à celui attendu, rediriger vers la page appropriée
    if (userMetadataRole !== expectedRole) {
      // Rediriger vers le dashboard correspondant au rôle de l'utilisateur
      if (userMetadataRole === 'creator') {
        redirect(ROUTES.DASHBOARD.CREATOR.ROOT);
      } else if (userMetadataRole === 'enterprise') {
        redirect(ROUTES.DASHBOARD.ENTERPRISE.ROOT);
      } else {
        // Si le rôle n'est pas défini ou n'est pas reconnu, rediriger vers la page de connexion
        redirect(ROUTES.AUTH.SIGNIN);
      }
    }
    
    // Si le rôle est correct, on continue avec les métadonnées comme informations utilisateur
    // Garantir que toutes les valeurs retournées sont bien définies
    const safeData = {
      user,
      role: userMetadataRole || 'unknown',
      email: user?.email || '',
      name: user?.user_metadata?.name || user?.email || '',
    };
    
    console.log('withRoleProtection (metadata path):', JSON.stringify(safeData));
    return safeData;
  }

  // Vérifier si le rôle correspond à celui attendu
  if (userData.role !== expectedRole) {
    // Rediriger vers le dashboard correspondant au rôle de l'utilisateur
    if (userData.role === 'creator') {
      redirect(ROUTES.DASHBOARD.CREATOR.ROOT);
    } else if (userData.role === 'enterprise') {
      redirect(ROUTES.DASHBOARD.ENTERPRISE.ROOT);
    } else {
      // Si le rôle n'est pas reconnu, rediriger vers la page de connexion
      redirect(ROUTES.AUTH.SIGNIN);
    }
  }

  // Si le rôle est correct, retourner les informations utilisateur
  // Garantir que toutes les valeurs retournées sont bien définies
  const safeData = {
    user,
    role: userData?.role || 'unknown',
    email: user?.email || '',
    name: user?.user_metadata?.name || user?.email || '',
  };
  
  console.log('withRoleProtection (users DB path):', JSON.stringify(safeData));
  return safeData;
}
