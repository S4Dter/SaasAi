import { withAdminProtection } from '@/lib/utils/withAdminProtection';
import { getSystemSettings } from '@/lib/api/admin';
import SettingsManagementClient from './SettingsManagementClient';

/**
 * Page de gestion des paramètres système pour les administrateurs
 */
export default async function SettingsPage() {
  // Vérifier que l'utilisateur est authentifié et a le rôle admin
  await withAdminProtection();
  
  // Récupérer les paramètres système
  const settingsData = await getSystemSettings();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Paramètres système</h1>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300">
        Configurez les paramètres globaux de la plateforme qui affectent son fonctionnement. 
        Les modifications apportées ici s'appliqueront à l'ensemble du système.
      </p>
      
      {/* Composant client pour la gestion des paramètres */}
      <SettingsManagementClient initialSettings={settingsData} />
    </div>
  );
}
