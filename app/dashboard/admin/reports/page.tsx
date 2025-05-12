import { withAdminProtection } from '@/lib/utils/withAdminProtection';
import { getReports } from '@/lib/api/admin';
import ReportManagementClient from './ReportManagementClient';

/**
 * Page de gestion des signalements pour les administrateurs
 * Permet de modérer les signalements effectués sur les agents
 */
export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Vérifier que l'utilisateur est authentifié et a le rôle admin
  await withAdminProtection();
  
  // Extraire les paramètres de recherche
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const status = searchParams.status as string | undefined;
  
  // Récupérer la liste des signalements avec pagination et filtres
  const reportsData = await getReports({
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
