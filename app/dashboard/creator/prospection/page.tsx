import React from 'react';
import { Metadata } from 'next';
import { APP_NAME } from '@/constants';
import ProspectionClient from './ProspectionClient';

export const metadata: Metadata = {
  title: `Prospection | ${APP_NAME}`,
  description: 'Trouvez de nouveaux clients pour vos agents IA',
};

/**
 * Page de prospection pour les créateurs d'agents
 * Cette page utilise le composant client pour gérer les interactions et l'état.
 * La connexion à Supabase est faite dans le composant client.
 */
export default function ProspectionPage() {
  return <ProspectionClient />;
}
