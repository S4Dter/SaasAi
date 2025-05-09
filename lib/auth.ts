import { createServerSupabaseClient, getServerSession } from './api/auth-server';
import prisma from './prisma';

/**
 * Récupère l'utilisateur actuel dans un context serveur
 * À utiliser pour les Server Components et Server Actions
 */
export async function getCurrentUser() {
  const session = await getServerSession();
  if (!session || !session.user) return null;

  // Récupérer les données utilisateur depuis la base de données
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    // Ajouter d'autres champs selon votre schéma
  };
}

/**
 * Vérifie si l'utilisateur est autorisé pour une action spécifique
 */
export async function checkPermission(requiredRoles: string[]) {
  const user = await getCurrentUser();
  if (!user) return false;
  return requiredRoles.includes(user.role);
}

/**
 * Fonction helper pour simplifier l'accès aux clients Supabase côté serveur
 */
export const getSupabaseServer = () => {
  return createServerSupabaseClient();
};
