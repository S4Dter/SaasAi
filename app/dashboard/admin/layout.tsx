'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/admin/Sidebar';
import { ROUTES } from '@/constants';

/**
 * Layout commun pour toutes les pages du tableau de bord administrateur
 */
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen lg:flex-row">
      <Sidebar />
      
      <main className="flex-1 p-4 lg:p-6 bg-gray-50 dark:bg-gray-900">
        <Suspense fallback={<div className="animate-pulse">Chargement...</div>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
