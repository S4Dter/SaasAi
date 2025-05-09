import React from 'react';
import { Metadata } from 'next';
import { APP_NAME } from '@/constants';
// MOCK DATA: import { filterAgents } from '@/mock/agents';
import SuggestionsClient from './SuggestionsClient';

export const metadata: Metadata = {
  title: `Suggestions d'agents | ${APP_NAME}`,
  description: 'Découvrez des agents IA recommandés pour votre entreprise',
};

/**
 * Page des suggestions d'agents pour entreprise
 */
export default function SuggestionsPage() {
  return <SuggestionsClient />;
}
