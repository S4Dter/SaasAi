import React, { useState } from 'react';
import { User, Agent, AgentCategory } from '@/types';
import { AGENT_CATEGORIES } from '@/constants';

interface ProspectionToolProps {
  agents?: Agent[];
  enterprises?: User[];
  onContactEnterprise?: (enterpriseId: string, agentId: string, message: string) => Promise<void>;
}

/**
 * Outil de prospection pour les créateurs d'agents IA
 * Permet de rechercher et contacter des entreprises susceptibles d'être intéressées
 */
const ProspectionTool: React.FC<ProspectionToolProps> = ({
  agents = [],
  enterprises = [],
  onContactEnterprise
}) => {
  // État des filtres
  const [filters, setFilters] = useState({
    searchQuery: '',
    industry: 'all',
    recentActivity: false,
    notContacted: false
  });

  // État pour le modal de contact
  const [contactModal, setContactModal] = useState<{
    isOpen: boolean;
    enterpriseId: string;
    agentId: string;
    message: string;
  }>({
    isOpen: false,
    enterpriseId: '',
    agentId: '',
    message: '',
  });

  // État pour le chargement
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrer les entreprises en fonction des critères
  const filteredEnterprises = enterprises.filter(enterprise => {
    // Filtre par recherche de texte
    if (filters.searchQuery && !enterprise.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !enterprise.company?.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filtre par industrie (simulation - dans un vrai système, les entreprises auraient une propriété 'industry')
    if (filters.industry !== 'all') {
      // Simuler un filtre d'industrie (par exemple, on suppose que certaines entreprises correspondent à chaque industrie)
      const matchIndustry = enterprise.id.charCodeAt(0) % AGENT_CATEGORIES.length === 
                            AGENT_CATEGORIES.findIndex(cat => cat.value === filters.industry);
      if (!matchIndustry) return false;
    }
    
    // Autres filtres (simulation)
    if (filters.recentActivity) {
      // Simuler "activité récente" (par exemple, par l'ID)
      if (parseInt(enterprise.id.replace(/\D/g, '')) % 3 !== 0) return false;
    }
    
    if (filters.notContacted) {
      // Simuler "non contacté" (par exemple, par l'ID)
      if (parseInt(enterprise.id.replace(/\D/g, '')) % 2 === 0) return false;
    }
    
    return true;
  });

  // Gestionnaire de changement de filtre
  const handleFilterChange = (name: string, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Ouvrir le modal de contact
  const openContactModal = (enterpriseId: string, agentId: string) => {
    const enterprise = enterprises.find(e => e.id === enterpriseId);
    const agent = agents.find(a => a.id === agentId);
    
    if (enterprise && agent) {
      // Template de message prérempli
      const messageTemplate = `Bonjour ${enterprise.name},

J'ai remarqué que votre entreprise ${enterprise.company ? enterprise.company : ''} pourrait être intéressée par notre agent IA "${agent.name}".

${agent.shortDescription}

Seriez-vous disponible pour échanger à ce sujet ?

Cordialement,
${/* Ici le nom du créateur - pour l'exemple on met juste "L'équipe" */ ''}
L'équipe ${agent.name}`;
      
      setContactModal({
        isOpen: true,
        enterpriseId,
        agentId,
        message: messageTemplate
      });
    }
  };

  // Fermer le modal de contact
  const closeContactModal = () => {
    setContactModal(prev => ({ ...prev, isOpen: false }));
  };

  // Envoyer le message de contact
  const sendContactMessage = async () => {
    if (!onContactEnterprise) return;
    
    try {
      setIsSubmitting(true);
      await onContactEnterprise(
        contactModal.enterpriseId,
        contactModal.agentId,
        contactModal.message
      );
      closeContactModal();
      // Ajouter une notification de succès ici si nécessaire
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message', error);
      // Ajouter une notification d'erreur ici si nécessaire
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Outil de prospection</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="md:col-span-2">
            <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <input
              type="text"
              id="search-query"
              placeholder="Nom d'entreprise, secteur..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          {/* Filtre par industrie */}
          <div>
            <label htmlFor="industry-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Secteur d&apos;activité
            </label>
            <select
              id="industry-filter"
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">Tous les secteurs</option>
              {AGENT_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Filtres supplémentaires */}
          <div className="space-y-2 flex flex-col justify-end">
            <div className="flex items-center">
              <input
                id="recent-activity"
                type="checkbox"
                checked={filters.recentActivity}
                onChange={(e) => handleFilterChange('recentActivity', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="recent-activity" className="ml-2 block text-sm text-gray-700">
                Activité récente
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="not-contacted"
                type="checkbox"
                checked={filters.notContacted}
                onChange={(e) => handleFilterChange('notContacted', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="not-contacted" className="ml-2 block text-sm text-gray-700">
                Non contactés
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Résultats */}
      <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-base font-medium text-gray-900">
            Entreprises potentielles ({filteredEnterprises.length})
          </h3>
          <span className="text-sm text-gray-500">
            Sélectionnez un agent pour contacter
          </span>
        </div>
        
        {filteredEnterprises.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Aucune entreprise ne correspond à ces critères</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredEnterprises.map(enterprise => (
              <li key={enterprise.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {enterprise.name}
                    </h4>
                    {enterprise.company && (
                      <p className="text-sm text-gray-500">{enterprise.company}</p>
                    )}
                    {enterprise.bio && (
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{enterprise.bio}</p>
                    )}
                  </div>
                  
                  {/* Liste déroulante d'agents pour contacter */}
                  {agents.length > 0 && (
                    <div className="ml-4">
                      <select
                        className="rounded-l-md border-r-0 border-gray-300 bg-white py-2 pl-3 pr-7 text-sm font-medium text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) {
                            openContactModal(enterprise.id, e.target.value);
                            e.target.value = ""; // Reset après sélection
                          }
                        }}
                      >
                        <option value="" disabled>Contacter avec...</option>
                        {agents.map(agent => (
                          <option key={agent.id} value={agent.id}>
                            {agent.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        
        {filteredEnterprises.length > 10 && (
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Voir plus
            </button>
          </div>
        )}
      </div>
      
      {/* Modal de contact */}
      {contactModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Contact entreprise
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-4">
                        Envoyez un message personnalisé à l&apos;entreprise concernant votre agent.
                      </p>
                      
                      <textarea
                        rows={8}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={contactModal.message}
                        onChange={(e) => setContactModal(prev => ({ ...prev, message: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  onClick={sendContactMessage}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Envoi...' : 'Envoyer'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeContactModal}
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProspectionTool;
