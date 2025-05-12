import { withAdminProtection } from '@/lib/utils/withAdminProtection';
import { getAgents } from '@/lib/api/admin';
import { ROUTES } from '@/constants';
import AgentManagementClient from './AgentManagementClient';

/**
 * Page de gestion des agents pour les administrateurs
 * Affiche la liste des agents avec options de modération et mise en avant
 */
export default async function AgentsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Vérifier que l'utilisateur est authentifié et a le rôle admin
  await withAdminProtection();
  
  // Extraire les paramètres de recherche
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const status = searchParams.status as string | undefined;
  const category = searchParams.category as string | undefined;
  const search = searchParams.search as string | undefined;
  const featured = searchParams.featured === 'true' ? true : 
                   searchParams.featured === 'false' ? false : undefined;
  
  // Récupérer la liste des agents avec pagination et filtres
  const agentsData = await getAgents({
    page,
    limit: 12,
    status,
    category,
    featured,
    search,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des agents</h1>
        
        <div>
          {/* Si besoin de boutons d'action globaux */}
        </div>
      </div>
      
      {/* Composant client pour la gestion des agents */}
      <AgentManagementClient 
        initialAgents={agentsData.agents} 
        totalAgents={agentsData.totalCount}
        currentPage={agentsData.currentPage}
        totalPages={agentsData.totalPages}
        initialFilters={{ status, category, featured, search }}
      />
    </div>
  );
}
