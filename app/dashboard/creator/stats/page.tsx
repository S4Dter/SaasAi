import React from 'react';
import { Metadata } from 'next';
import { APP_NAME } from '@/constants';
// MOCK DATA: import { getAllAgents } from '@/mock/agents';
import StatsClient from './StatsClient';

export const metadata: Metadata = {
  title: `Statistiques | ${APP_NAME}`,
  description: 'Analysez les performances de vos agents IA',
};

/**
 * Page de statistiques et analyses pour le créateur
 */
export default function CreatorStatsPage() {
  return <StatsClient />;
}
