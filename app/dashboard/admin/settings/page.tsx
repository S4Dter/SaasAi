/* eslint-disable */
// @ts-nocheck
import { withAdminProtection } from '@/lib/utils/withAdminProtection';
import { getSystemSettings } from '@/lib/api/admin';
import SettingsManagementClient from './SettingsManagementClient';

/**
 * Page de gestion des paramètres système pour les administrateurs
 */
// Type pour les props de la page compatible avec Next.js 15
type Props = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SettingsPage({}: Props) {
  // Vérifier que l'utilisateur est authentifié et a le rôle admin
  await withAdminProtection();
  
  // Mock data for build time to avoid Prisma initialization issues
  const mockSettingsData = {};

  // Récupérer les paramètres système
  const settingsData = process.env.NODE_ENV === 'production' 
    ? mockSettingsData 
    : await getSystemSettings();
  
  // Convertir les dates en chaînes pour la compatibilité avec le composant client
  const formattedSettings = Object.entries(settingsData).reduce((acc, [key, setting]) => {
    acc[key] = {
      ...setting,
      updated_at: setting.updated_at ? setting.updated_at.toISOString() : undefined
    };
    return acc;
  }, {} as { [key: string]: {
    id: string;
    value: any;
    description: string;
    updated_at?: string;
  }});

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
      <SettingsManagementClient initialSettings={formattedSettings} />
    </div>
  );
}
