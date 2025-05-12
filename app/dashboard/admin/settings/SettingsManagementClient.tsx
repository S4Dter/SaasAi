'use client';

import { useState } from 'react';
import { Settings, Save, Database, UploadCloud, Mail, DollarSign, Lock } from 'lucide-react';
import { updateSystemSetting } from '@/lib/api/admin';

// Types pour les paramètres et catégories
type SettingValue = string | number | boolean | object | null;

type Setting = {
  id: string;
  value: SettingValue;
  description?: string;
  updated_at?: string;
};

type SystemSettings = {
  [key: string]: Setting;
};

interface SettingsManagementClientProps {
  initialSettings: SystemSettings;
}

export default function SettingsManagementClient({
  initialSettings,
}: SettingsManagementClientProps) {
  // État local
  const [settings, setSettings] = useState<SystemSettings>(initialSettings);
  const [editedSettings, setEditedSettings] = useState<Record<string, SettingValue>>({});
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Catégories de paramètres
  const settingCategories = [
    {
      id: 'general',
      name: 'Général',
      icon: <Settings className="w-5 h-5" />,
      settings: [
        'site_name',
        'site_description',
        'contact_email',
        'maintenance_mode',
        'enable_registration',
      ],
    },
    {
      id: 'agents',
      name: 'Agents',
      icon: <Database className="w-5 h-5" />,
      settings: [
        'agents_require_approval',
        'max_agents_per_creator',
        'featured_agents_limit',
        'enable_agent_reports',
      ],
    },
    {
      id: 'uploads',
      name: 'Téléchargements',
      icon: <UploadCloud className="w-5 h-5" />,
      settings: [
        'max_file_size',
        'allowed_file_types',
        'storage_provider',
        'image_compression',
      ],
    },
    {
      id: 'email',
      name: 'Emails',
      icon: <Mail className="w-5 h-5" />,
      settings: [
        'smtp_host',
        'smtp_port',
        'smtp_user',
        'smtp_password',
        'email_from',
        'email_signature',
      ],
    },
    {
      id: 'payment',
      name: 'Paiement',
      icon: <DollarSign className="w-5 h-5" />,
      settings: [
        'stripe_publishable_key',
        'stripe_secret_key',
        'platform_fee_percentage',
        'minimum_payout_amount',
        'payment_currencies',
      ],
    },
    {
      id: 'security',
      name: 'Sécurité',
      icon: <Lock className="w-5 h-5" />,
      settings: [
        'max_login_attempts',
        'session_timeout',
        'password_min_length',
        'require_2fa_for_admins',
        'allowed_login_ips',
      ],
    },
  ];

  // Formatter les dates pour l'affichage
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Gestionnaire de changement de valeur
  const handleSettingChange = (key: string, value: SettingValue) => {
    setEditedSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Obtenir la valeur actuelle d'un paramètre (éditée ou originale)
  const getSettingValue = (key: string): SettingValue => {
    if (key in editedSettings) {
      return editedSettings[key];
    }
    return settings[key]?.value || '';
  };

  // Sauvegarder un paramètre
  const saveSetting = async (key: string) => {
    if (!(key in editedSettings)) {
      return; // Aucun changement à sauvegarder
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const newValue = editedSettings[key];
      const result = await updateSystemSetting(key, newValue);

      // Mettre à jour l'état local avec la nouvelle valeur
      setSettings((prev) => ({
        ...prev,
        [key]: {
          id: result.id,
          value: result.setting_value,
          description: result.description,
          updated_at: result.updated_at,
        },
      }));

      // Supprimer de l'état d'édition
      setEditedSettings((prev) => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });

      setSuccess(`Paramètre "${key}" mis à jour avec succès.`);
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du paramètre:', err);
      setError(`Erreur lors de la mise à jour: ${err.message || 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Sauvegarder tous les paramètres modifiés dans la catégorie active
  const saveAllInCategory = async () => {
    const categorySettings = settingCategories.find((cat) => cat.id === activeTab)?.settings || [];
    const keysToSave = Object.keys(editedSettings).filter((key) => categorySettings.includes(key));

    if (keysToSave.length === 0) {
      return; // Aucun changement à sauvegarder
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const promises = keysToSave.map((key) => updateSystemSetting(key, editedSettings[key]));
      const results = await Promise.all(promises);

      // Mettre à jour l'état local avec les nouvelles valeurs
      const newSettings = { ...settings };
      results.forEach((result) => {
        newSettings[result.setting_key] = {
          id: result.id,
          value: result.setting_value,
          description: result.description,
          updated_at: result.updated_at,
        };
      });
      setSettings(newSettings);

      // Supprimer les paramètres sauvegardés de l'état d'édition
      setEditedSettings((prev) => {
        const newState = { ...prev };
        keysToSave.forEach((key) => {
          delete newState[key];
        });
        return newState;
      });

      setSuccess(`${keysToSave.length} paramètre(s) mis à jour avec succès.`);
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour des paramètres:', err);
      setError(`Erreur lors de la mise à jour: ${err.message || 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier si un paramètre a été modifié
  const isSettingModified = (key: string): boolean => {
    return key in editedSettings;
  };

  // Obtenir une description lisible pour un paramètre
  const getSettingDescription = (key: string): string => {
    const existingDescription = settings[key]?.description;
    if (existingDescription) return existingDescription;

    // Générer une description automatique basée sur la clé
    const formatted = key
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return `Paramètre de configuration pour "${formatted}"`;
  };

  // Générer un input approprié selon le type de valeur
  const renderSettingInput = (key: string) => {
    const value = getSettingValue(key);
    const currentType = typeof value;

    // Détecter le type et rendre l'input approprié
    if (typeof value === 'boolean') {
      return (
        <select
          value={value ? 'true' : 'false'}
          onChange={(e) => handleSettingChange(key, e.target.value === 'true')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        >
          <option value="true">Activé</option>
          <option value="false">Désactivé</option>
        </select>
      );
    } else if (typeof value === 'number') {
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => handleSettingChange(key, parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        />
      );
    } else if (typeof value === 'object' && value !== null) {
      // Pour un objet, nous utilisons un textarea avec JSON
      return (
        <textarea
          value={JSON.stringify(value, null, 2)}
          onChange={(e) => {
            try {
              const parsedValue = JSON.parse(e.target.value);
              handleSettingChange(key, parsedValue);
            } catch (err) {
              // En cas d'erreur de parsing, ne pas mettre à jour
              console.error('Erreur de parsing JSON:', err);
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          rows={5}
          disabled={isLoading}
        />
      );
    } else {
      // Pour les chaînes de caractères
      if (key.includes('password') || key.includes('secret') || key.includes('key')) {
        return (
          <input
            type="password"
            value={value as string}
            onChange={(e) => handleSettingChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        );
      }
      
      if (key.includes('email')) {
        return (
          <input
            type="email"
            value={value as string}
            onChange={(e) => handleSettingChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        );
      }
      
      if (key.includes('description') || key.includes('signature')) {
        return (
          <textarea
            value={value as string}
            onChange={(e) => handleSettingChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            disabled={isLoading}
          />
        );
      }
      
      return (
        <input
          type="text"
          value={value as string}
          onChange={(e) => handleSettingChange(key, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        />
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Messages de notification */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Erreur : </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Succès : </strong>
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      
      {/* Onglets de catégories */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px space-x-8 overflow-x-auto">
          {settingCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${
                  activeTab === category.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              <span className="flex items-center">
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Section des paramètres selon l'onglet actif */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="space-y-6">
            {settingCategories.find((cat) => cat.id === activeTab)?.settings.map((key) => (
              <div key={key} className="border-b border-gray-200 dark:border-gray-700 pb-5 last:border-b-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <div className="mb-2 md:mb-0">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {getSettingDescription(key)}
                    </p>
                  </div>
                  
                  {isSettingModified(key) && (
                    <button
                      onClick={() => saveSetting(key)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      disabled={isLoading}
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Enregistrer
                    </button>
                  )}
                </div>
                
                <div className="mt-2">
                  {renderSettingInput(key)}
                </div>
                
                {settings[key]?.updated_at && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Dernière modification: {formatDate(settings[key].updated_at)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bouton d'enregistrement global */}
      {Object.keys(editedSettings).length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={saveAllInCategory}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            <Save className="w-5 h-5 mr-2" />
            {isLoading ? 'Enregistrement en cours...' : 'Enregistrer tous les changements'}
          </button>
        </div>
      )}
    </div>
  );
}
