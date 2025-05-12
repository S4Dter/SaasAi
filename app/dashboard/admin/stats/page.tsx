import { withAdminProtection } from '@/lib/utils/withAdminProtection';
import { getAdminStats } from '@/lib/api/admin';
import StatsClient from './StatsClient';

/**
 * Page de statistiques globales pour les administrateurs
 */
export default async function StatsPage() {
  // Vérifier que l'utilisateur est authentifié et a le rôle admin
  await withAdminProtection();
  
  // Récupérer les statistiques globales
  const statsData = await getAdminStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Statistiques de la plateforme</h1>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300">
        Vue d'ensemble des statistiques et métriques de la plateforme. 
        Ces données sont mises à jour en temps réel pour vous aider à prendre des décisions informées.
      </p>
      
      {/* Composant client pour l'affichage des statistiques */}
      <StatsClient statsData={statsData} />
    </div>
  );
}
