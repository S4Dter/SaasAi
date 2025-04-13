import React, { useState, useEffect } from 'react';
import { Agent, AgentFilters, AgentCategory, IntegrationType } from '@/types';
import AgentCard from './AgentCard';
import { AGENT_CATEGORIES, DEFAULT_FILTERS, INTEGRATION_TYPES } from '@/constants';

interface AgentListProps {
  agents: Agent[];
  initialFilters?: Partial<AgentFilters>;
  onFilterChange?: (filters: AgentFilters) => void;
  loading?: boolean;
}

/**
 * Composant de liste d'agents avec filtres
 */
const AgentList: React.FC<AgentListProps> = ({ 
  agents, 
  initialFilters = {}, 
  onFilterChange,
  loading = false 
}) => {
  // État local pour les filtres avec valeurs par défaut
  const [filters, setFilters] = useState<Required<AgentFilters>>({
    category: initialFilters.category || 'all',
    integrations: initialFilters.integrations || [],
    priceRange: initialFilters.priceRange || { min: 0, max: 1000 },
    searchQuery: initialFilters.searchQuery || '',
  });

  // Mise à jour des filtres externes si nécessaire
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);

  // Gestion du changement de catégorie
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // Vérifie que la valeur est bien un type valide de catégorie ou 'all'
    const isValidCategory = (value === 'all' || AGENT_CATEGORIES.some(cat => cat.value === value));
    const categoryValue = isValidCategory ? (value as AgentCategory | 'all') : 'all';
    
    setFilters(prev => ({
      ...prev,
      category: categoryValue
    }));
  };

  // Gestion du changement de prix
  const handlePriceChange = (minMax: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [minMax]: numValue
      }
    }));
  };

  // Gestion du changement d'intégration
  const handleIntegrationChange = (integration: string, checked: boolean) => {
    // Vérifie que l'intégration est d'un type valide
    if (!INTEGRATION_TYPES.some(type => type.value === integration)) return;
    
    const validIntegration = integration as IntegrationType;
    
    setFilters(prev => {
      const currentIntegrations = prev.integrations;
      const newIntegrations = checked 
        ? [...currentIntegrations, validIntegration]
        : currentIntegrations.filter(i => i !== validIntegration);
      
      return {
        ...prev,
        integrations: newIntegrations
      };
    });
  };

  // Gestion de la recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: e.target.value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtre par catégorie */}
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              id="category-filter"
              value={filters.category}
              onChange={handleCategoryChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">Toutes les catégories</option>
              {AGENT_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Filtre par prix min */}
          <div>
            <label htmlFor="price-min-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Prix minimum
            </label>
            <input
              type="number"
              id="price-min-filter"
              value={filters.priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              min="0"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          {/* Filtre par prix max */}
          <div>
            <label htmlFor="price-max-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Prix maximum
            </label>
            <input
              type="number"
              id="price-max-filter"
              value={filters.priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              min="0"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          {/* Recherche */}
          <div>
            <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <input
              type="text"
              id="search-filter"
              value={filters.searchQuery}
              onChange={handleSearchChange}
              placeholder="Nom, description..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        {/* Types d'intégration */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Types d&apos;intégration</h3>
          <div className="flex flex-wrap gap-4">
            {INTEGRATION_TYPES.map(integration => (
              <div key={integration.value} className="flex items-center">
                <input
                  id={`integration-${integration.value}`}
                  type="checkbox"
                  checked={filters.integrations.includes(integration.value as IntegrationType)}
                  onChange={(e) => handleIntegrationChange(integration.value, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`integration-${integration.value}`} className="ml-2 text-sm text-gray-700">
                  {integration.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Affichage des résultats */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {agents.length} agent{agents.length > 1 ? 's' : ''} trouvé{agents.length > 1 ? 's' : ''}
        </h2>
        
        {loading ? (
          // Affichage du chargement
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-72 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : agents.length === 0 ? (
          // Message quand aucun résultat
          <div className="p-8 text-center border border-gray-200 rounded-lg bg-gray-50">
            <p className="text-gray-500">Aucun agent ne correspond à ces critères</p>
          </div>
        ) : (
          // Liste des agents
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentList;
