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
  // Création d'un client Supabase côté serveur
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  // Nous n'avons pas besoin de récupérer manuellement les cookies,
  // car Supabase le fait automatiquement côté client et serveur

  // Vérifier si l'utilisateur est connecté
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  // Si l'utilisateur n'est pas connecté ou en cas d'erreur, rediriger vers la page de connexion
  if (userError || !user) {
    console.error('Authentification échouée:', userError);
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
    return {
      user,
      role: userMetadataRole,
      // Autres informations des métadonnées qui pourraient être utiles
      email: user.email,
      name: user.user_metadata?.name || user.email,
    };
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
  return {
    user,
    role: userData.role,
    email: user.email,
    name: user.user_metadata?.name || user.email,
  };
}
