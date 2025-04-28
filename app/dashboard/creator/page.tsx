import { Metadata } from 'next';
import { APP_NAME } from '@/constants';
import { withRoleProtection } from '@/lib/utils/withRoleProtection';
import CreatorDashboardClient from './CreatorDashboardClient';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: `Tableau de bord Créateur | ${APP_NAME}`,
  description: 'Gérez vos agents IA, suivez vos performances et développez votre activité',
};

/**
 * Page principale du dashboard créateur avec protection côté serveur
 * Avec gestion améliorée de l'état d'authentification
 */
export default async function CreatorDashboardPage() {
  try {
    // Vérifier l'authentification et le rôle côté serveur
    const userData = await withRoleProtection('creator');
    
    console.log('Creator page server component userData:', JSON.stringify(userData));
    
    // Adapter le format des données utilisateur pour le composant client
    // en s'assurant que les valeurs sont bien définies
    const clientUserData = {
      id: userData?.user?.id || '',
      email: userData?.email || '',
      name: userData?.name || ''
    };
    
    // Vérifier que les données essentielles sont présentes avant de rendre le composant client
    if (!clientUserData.id) {
      console.error('Données utilisateur insuffisantes pour le rendu du dashboard');
      // Si aucun ID utilisateur n'est disponible, on laisse le composant client gérer la redirection
      // après l'hydratation pour éviter les redirections incohérentes entre serveur et client
    }
    
    console.log('Creator page passing to client:', JSON.stringify(clientUserData));
    
    // Note: La vérification du cookie est déjà faite dans withRoleProtection
    // donc nous n'avons pas besoin de la refaire ici
    
    // Si nous arrivons jusqu'ici, c'est que l'authentification côté serveur 
    // a réussi, et nous pouvons rendre le composant client
    
    return (
      <CreatorDashboardClient userData={clientUserData} />
    );
  } catch (error) {
    // En cas d'erreur dans la vérification d'authentification,
    // on passe des données vides au client qui s'occupera de la redirection après hydratation
    console.error('Erreur dans la protection par rôle:', error);
    
    return (
      <CreatorDashboardClient userData={{ id: '', email: '', name: '' }} />
    );
  }
}
