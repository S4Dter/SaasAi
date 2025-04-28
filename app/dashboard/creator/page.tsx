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
  
  console.log('Creator page server component userData:', JSON.stringify(userData));
  
  // Adapter le format des données utilisateur pour le composant client
  // en s'assurant que les valeurs sont bien définies
  const clientUserData = {
    id: userData?.user?.id || '',
    email: userData?.email || '',
    name: userData?.name || ''
  };
  
  console.log('Creator page passing to client:', JSON.stringify(clientUserData));
  
  return (
    <CreatorDashboardClient userData={clientUserData} />
  );
}
