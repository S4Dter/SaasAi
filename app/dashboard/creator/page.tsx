import { Metadata } from 'next';
import { APP_NAME } from '@/constants';
import CreatorDashboardClient from './CreatorDashboardClient';

export const metadata: Metadata = {
  title: `Tableau de bord Créateur | ${APP_NAME}`,
  description: 'Gérez vos agents IA, suivez vos performances et développez votre activité',
};

// Version d'urgence sans vérification serveur
export default function CreatorDashboardPage() {
  // Passer un objet vide - le client récupèrera lui-même les informations
  return <CreatorDashboardClient userData={{ id: '', email: '', name: '' }} />;
}