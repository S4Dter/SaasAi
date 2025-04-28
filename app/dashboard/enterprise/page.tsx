import { Metadata } from 'next';
import { APP_NAME } from '@/constants';
import { withRoleProtection } from '@/lib/utils/withRoleProtection';
import EnterpriseDashboardClient from './EnterpriseDashboardClient';

export const metadata: Metadata = {
  title: `Tableau de bord Entreprise | ${APP_NAME}`,
  description: 'Gérez vos favoris, historique et retrouvez des suggestions personnalisées',
};

/**
 * Page principale du dashboard entreprise avec protection côté serveur
 */
export default async function EnterpriseDashboardPage() {
  // Vérifier l'authentification et le rôle côté serveur
  const userData = await withRoleProtection('enterprise');
  
  console.log('Enterprise page server component userData:', JSON.stringify(userData));
  
  // Adapter le format des données utilisateur pour le composant client
  // en s'assurant que les valeurs sont bien définies, y compris l'ID utilisateur
  const clientUserData = {
    id: userData?.user?.id || '',
    email: userData?.email || '',
    name: userData?.name || ''
  };
  
  console.log('Enterprise page passing to client:', JSON.stringify(clientUserData));
  
  return (
    <EnterpriseDashboardClient userData={clientUserData} />
  );
}
