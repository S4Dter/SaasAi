import React from 'react';
import { Metadata } from 'next';
import Sidebar from '@/components/dashboard/Sidebar';
import { APP_NAME } from '@/constants';

export const metadata: Metadata = {
  title: `Tableau de bord Entreprise | ${APP_NAME}`,
  description: 'Gérez vos agents IA favoris et suivez vos interactions avec les créateurs',
};

/**
 * Layout pour les pages du dashboard entreprise
 */
export default function EnterpriseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar type="enterprise" />
      
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
