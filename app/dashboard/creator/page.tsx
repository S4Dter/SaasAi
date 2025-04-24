import { Metadata } from 'next';
import { APP_NAME } from '@/constants';
import { withRoleProtection } from '@/lib/utils/withRoleProtection';
import CreatorDashboardClient from './CreatorDashboardClient';

export const metadata: Metadata = {
  title: `Tableau de bord Créateur | ${APP_NAME}`,
  description: 'Gérez vos agents IA, suivez vos performances et développez votre activité',
};

/**
 * Page principale du dashboard créateur avec protection côté serveur
 */
export default async function CreatorDashboardPage() {
  // Vérifier l'authentification et le rôle côté serveur
  const userData = await withRoleProtection('creator');
  
  // Adapter le format des données utilisateur pour le composant client
  const clientUserData = {
    email: userData.email || '',
    name: userData.name
  };
  
  return (
    <CreatorDashboardClient userData={clientUserData} />
  );
}
