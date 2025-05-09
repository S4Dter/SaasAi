import React from 'react';
import { Metadata } from 'next';
import { APP_NAME } from '@/constants';
// MOCK DATA: import { getFeaturedAgents } from '@/mock/agents';
import HistoryClient from './HistoryClient';

export const metadata: Metadata = {
  title: `Historique de contacts | ${APP_NAME}`,
  description: 'Historique de vos échanges avec les créateurs d\'agents IA',
};

/**
 * Page d'historique des contacts entreprise
 */
export default function HistoryPage() {
  return <HistoryClient />;
}
