import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants';
import { getCurrentUser } from '@/lib/auth';

/**
 * Middleware de protection pour les routes administrateurs
 * Vérifie que l'utilisateur est connecté et a le rôle "admin"
 * Redirige vers la page de connexion si non authentifié
 * Redirige vers le dashboard approprié si l'utilisateur n'est pas admin
 */
export async function withAdminProtection() {
  try {
    // Récupérer les informations de l'utilisateur connecté
    const user = await getCurrentUser();
    
    // Si l'utilisateur n'est pas connecté, rediriger vers la connexion
    if (!user) {
      redirect(ROUTES.AUTH.SIGNIN);
    }
    
    // Si l'utilisateur n'est pas un admin, rediriger vers son dashboard approprié
    if (user.role !== 'admin') {
      if (user.role === 'creator') {
        redirect(ROUTES.DASHBOARD.CREATOR.ROOT);
      } else {
        redirect(ROUTES.DASHBOARD.ENTERPRISE.ROOT);
      }
    }
    
    // Si l'utilisateur est un admin, permettre l'accès à la route
    return user;
  } catch (error) {
    // En cas d'erreur, rediriger vers la connexion
    console.error('Erreur lors de la vérification des permissions admin:', error);
    redirect(ROUTES.AUTH.SIGNIN);
  }
}
