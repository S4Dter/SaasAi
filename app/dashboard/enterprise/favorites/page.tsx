import React from 'react';
import { Metadata } from 'next';
// MOCK DATA: import { getFeaturedAgents } from '@/mock/agents';
import { APP_NAME } from '@/constants';
import FavoritesClient from './FavoritesClient';

export const metadata: Metadata = {
  title: `Agents favoris | ${APP_NAME}`,
  description: 'Retrouvez et gérez vos agents IA favoris',
};

/**
 * Page des agents favoris de l'entreprise
 */
export default function FavoritesPage() {
  return <FavoritesClient />;
}
