import React from 'react';
import { Agent } from '../../types';
import Button from '../ui/Button';
import { AGENT_CATEGORIES, INTEGRATION_TYPES } from '../../constants';

interface AgentDetailsProps {
  agent: Agent;
}

/**
 * Composant détaillé d'un agent IA
 * 
 * @param {Agent} agent - L'agent à afficher en détail
 */
const AgentDetails: React.FC<AgentDetailsProps> = ({ agent }) => {
  // Fonction pour formater le prix
  const formatPrice = () => {
    const { pricing } = agent;
    const currencySymbol = pricing.currency === 'EUR' ? '€' : pricing.currency === 'USD' ? '$' : '£';
    
    if (pricing.model === 'subscription') {
      return `${pricing.startingPrice}${currencySymbol}/mois`;
    } else if (pricing.model === 'one-time') {
      return `${pricing.startingPrice}${currencySymbol}`;
    } else {
      return `À partir de ${pricing.startingPrice}${currencySymbol}`;
    }
  };

  // Obtenir le label de la catégorie
  const getCategoryLabel = (categoryValue: string) => {
    const category = AGENT_CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  // Obtenir les labels des types d'intégration
  const getIntegrationLabels = (integrationValues: string[]) => {
    return integrationValues.map(value => {
      const integration = INTEGRATION_TYPES.find(int => int.value === value);
      return integration ? integration.label : value;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* En-tête avec logo et informations principales */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start">
          {/* Logo de l'agent (placeholder en attendant les vraies images) */}
          <div className="w-16 h-16 bg-blue-100 rounded-md flex items-center justify-center mr-4">
            <span className="text-blue-600 text-xl font-bold">{agent.name.charAt(0)}</span>
          </div>
          
          <div className="flex-grow">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {agent.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {getCategoryLabel(agent.category)}
              </span>
              
              {agent.featured && (
                <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  Coup de cœur
                </span>
              )}
            </div>
            
            <p className="text-gray-700">
              {agent.shortDescription}
            </p>
          </div>
          
          {/* Prix et bouton */}
          <div className="ml-6 flex flex-col items-end">
            <div className="text-xl font-semibold text-gray-900 mb-2">
              {formatPrice()}
            </div>
            {agent.pricing.details && (
              <div className="text-sm text-gray-500 mb-4">
                {agent.pricing.details}
              </div>
            )}
            <Button size="lg">
              Contacter le créateur
            </Button>
          </div>
        </div>
      </div>
      
      {/* Contenu principal en deux colonnes sur desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Colonne principale - Description */}
        <div className="lg:col-span-2 prose prose-blue max-w-none">
          {/* Note: Dans une vraie application, utilisez un parser markdown comme react-markdown */}
          <div className="prose max-w-none">
            {/* Utilisation temporaire d'un rendu simple */}
            <div dangerouslySetInnerHTML={{ __html: agent.description.replace(/\n/g, '<br/>') }} />
          </div>
        </div>
        
        {/* Colonne latérale - Informations et vidéo */}
        <div className="space-y-6">
          {/* Vidéo démo */}
          {agent.demoVideoUrl && (
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {/* Note: Dans une vraie application, utilisez un vrai player vidéo */}
                <div className="flex items-center justify-center">
                  <p className="text-gray-500 text-center p-4">
                    Vidéo démo serait intégrée ici: {agent.demoVideoUrl}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Lien démo */}
          {agent.demoUrl && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Démo interactive
              </h3>
              <a 
                href={agent.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm flex items-center"
              >
                Essayer la démo
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
          
          {/* Intégrations */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Types d&apos;intégration
            </h3>
            <div className="flex flex-wrap gap-2">
              {getIntegrationLabels(agent.integrations).map((label, index) => (
                <span 
                  key={index}
                  className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          
          {/* Informations additionnelles */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Informations
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-500">Date de création:</span>
                <span className="text-gray-900">{agent.createdAt.toLocaleDateString()}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Dernière mise à jour:</span>
                <span className="text-gray-900">{agent.updatedAt.toLocaleDateString()}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">ID:</span>
                <span className="text-gray-900">{agent.id}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;
