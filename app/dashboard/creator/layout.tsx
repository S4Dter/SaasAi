import React from 'react';
import { Metadata } from 'next';
import Sidebar from '@/components/dashboard/Sidebar';
import { APP_NAME } from '@/constants';

export const metadata: Metadata = {
  title: `Tableau de bord Créateur | ${APP_NAME}`,
  description: 'Gérez vos agents IA, suivez vos statistiques et utilisez les outils de prospection automatisée',
};

/**
 * Layout pour les pages du dashboard créateur
 */
export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar type="creator" />
      
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
