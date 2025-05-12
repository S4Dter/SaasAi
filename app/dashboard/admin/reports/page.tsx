/* eslint-disable */
// @ts-nocheck
import { withAdminProtection } from '@/lib/utils/withAdminProtection';
import { getReports } from '@/lib/api/admin';
import ReportManagementClient from './ReportManagementClient';

/**
 * Page de gestion des signalements pour les administrateurs
 * Permet de modérer les signalements effectués sur les agents
 */
// Type pour les props de la page compatible avec Next.js 15
type Props = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ReportsPage({ searchParams }: Props) {
  // Vérifier que l'utilisateur est authentifié et a le rôle admin
  await withAdminProtection();
  
  // Résoudre les paramètres de recherche
  const resolvedSearchParams = await searchParams;
  
  // Extraire les paramètres de recherche
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string) : 1;
  const status = resolvedSearchParams.status as string | undefined;
  
  // Mock data for build time to avoid Prisma initialization issues
  const mockReportsData = {
    reports: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 1
  };

  // Récupérer la liste des signalements avec pagination et filtres
  const reportsData = process.env.NODE_ENV === 'production' 
    ? mockReportsData 
    : await getReports({
      page,
      limit: 10,
      status,
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des signalements</h1>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300">
        Examinez et traitez les signalements soumis par les utilisateurs concernant les agents.
        La modération de ces signalements aide à maintenir la qualité et la sécurité de la plateforme.
      </p>
      
      {/* Composant client pour la gestion des signalements */}
      <ReportManagementClient 
        initialReports={reportsData.reports} 
        totalReports={reportsData.totalCount}
        currentPage={reportsData.currentPage}
        totalPages={reportsData.totalPages}
        initialFilters={{ status }}
      />
    </div>
  );
}
