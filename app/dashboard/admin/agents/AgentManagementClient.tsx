'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { 
  Search, Filter, CheckCircle, XCircle, Star, 
  BotIcon, MoreHorizontal, Archive, Eye
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { updateAgentStatus, updateAgentFeatured } from '@/lib/api/admin';
import { ROUTES, AGENT_CATEGORIES } from '@/constants';

// Types pour les agents et filtres
type Agent = {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
  category?: string;
  pricing: any;
  featured?: boolean;
  logo_url?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  approval_date?: string;
  rejection_reason?: string;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
};

type Filters = {
  status?: string;
  category?: string;
  featured?: boolean;
  search?: string;
};

interface AgentManagementClientProps {
  initialAgents: Agent[];
  totalAgents: number;
  currentPage: number;
  totalPages: number;
  initialFilters: Filters;
}

export default function AgentManagementClient({
  initialAgents,
  totalAgents,
  currentPage,
  totalPages,
  initialFilters,
}: AgentManagementClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // État local
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [searchInput, setSearchInput] = useState(initialFilters.search || '');
  const [isLoading, setIsLoading] = useState(false);
  const [actionMenuVisible, setActionMenuVisible] = useState<{ [key: string]: boolean }>({});
  const [rejectionReason, setRejectionReason] = useState('');
  const [agentToReject, setAgentToReject] = useState<string | null>(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  // Options de filtrage
  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'approved', label: 'Approuvés' },
    { value: 'rejected', label: 'Rejetés' },
    { value: 'archived', label: 'Archivés' },
  ];
  
  const categoryOptions = [
    { value: '', label: 'Toutes les catégories' },
    ...AGENT_CATEGORIES,
  ];
  
  const featuredOptions = [
    { value: '', label: 'Tous les agents' },
    { value: 'true', label: 'Agents à la une' },
    { value: 'false', label: 'Agents standard' },
  ];

  // Formatter les dates pour l'affichage
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Mettre à jour l'URL avec les filtres
  const updateURLParams = (newFilters: Filters, page: number = 1) => {
    const params = new URLSearchParams();
    
    if (newFilters.status) params.set('status', newFilters.status);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.featured !== undefined) params.set('featured', newFilters.featured.toString());
    if (newFilters.search) params.set('search', newFilters.search);
    if (page > 1) params.set('page', page.toString());
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // Gestionnaire de changement de filtre
  const handleFilterChange = (filterType: keyof Filters, value: any) => {
    const newFilters = { ...filters, [filterType]: value === '' ? undefined : value };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  // Gestionnaire de recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters = { ...filters, search: searchInput };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  // Gestionnaire de changement de page
  const handlePageChange = (page: number) => {
    updateURLParams(filters, page);
  };

  // Afficher/masquer le menu d'action pour un agent
  const toggleActionMenu = (agentId: string) => {
    setActionMenuVisible(prev => ({
      ...prev,
      [agentId]: !prev[agentId]
    }));
  };

  // Ouvrir le modal de rejet
  const openRejectModal = (agentId: string) => {
    setAgentToReject(agentId);
    setRejectionReason('');
    setShowRejectionModal(true);
    setActionMenuVisible({});
  };

  // Fermer le modal de rejet
  const closeRejectModal = () => {
    setAgentToReject(null);
    setRejectionReason('');
    setShowRejectionModal(false);
  };

  // Actions sur les agents
  const handleAgentStatusChange = async (agentId: string, newStatus: 'pending' | 'approved' | 'rejected' | 'archived') => {
    try {
      setIsLoading(true);
      
      if (newStatus === 'rejected') {
        // Si le statut est "rejected", on utilise la raison de rejet
        if (!agentToReject || !rejectionReason.trim()) {
          alert('Veuillez saisir une raison de rejet');
          return;
        }
        
        await updateAgentStatus(agentId, newStatus, rejectionReason);
        closeRejectModal();
      } else {
        // Pour les autres statuts, on fait une mise à jour simple
        await updateAgentStatus(agentId, newStatus);
      }
      
      // Mettre à jour l'état local après succès
      setAgents(prevAgents => 
        prevAgents.map(agent => 
          agent.id === agentId ? { ...agent, status: newStatus } : agent
        )
      );
      setActionMenuVisible({});
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert(`Erreur lors de la mise à jour du statut: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgentFeaturedChange = async (agentId: string, featured: boolean) => {
    try {
      setIsLoading(true);
      await updateAgentFeatured(agentId, featured);
      
      // Mettre à jour l'état local après succès
      setAgents(prevAgents => 
        prevAgents.map(agent => 
          agent.id === agentId ? { ...agent, featured } : agent
        )
      );
      setActionMenuVisible({});
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut featured:', error);
      alert(`Erreur lors de la mise à jour du statut featured: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtenir le label d'une catégorie à partir de sa valeur
  const getCategoryLabel = (categoryValue?: string) => {
    if (!categoryValue) return 'Non catégorisé';
    const category = AGENT_CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  // Composant pour les badges de statut
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            Approuvé
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            Rejeté
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            En attente
          </span>
        );
      case 'archived':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            Archivé
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex-1 flex gap-2 flex-wrap">
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-auto flex-1">
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Statut
            </label>
            <select
              id="statusFilter"
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-auto flex-1">
            <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Catégorie
            </label>
            <select
              id="categoryFilter"
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-auto flex-1">
            <label htmlFor="featuredFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mise en avant
            </label>
            <select
              id="featuredFilter"
              value={filters.featured === undefined ? '' : filters.featured.toString()}
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange('featured', value === 'true' ? true : value === 'false' ? false : undefined);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              {featuredOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex-1">
          <form onSubmit={handleSearch}>
            <label htmlFor="searchInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recherche
            </label>
            <div className="relative">
              <input
                id="searchInput"
                type="text"
                placeholder="Nom, description, créateur..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-3 flex items-center bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                disabled={isLoading}
              >
                Rechercher
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Grille des agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div 
            key={agent.id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col"
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 relative">
                  {agent.logo_url ? (
                    <img
                      src={agent.logo_url}
                      alt={agent.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <BotIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                  {agent.featured && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1" title="Agent à la une">
                      <Star className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{agent.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    par {agent.creator?.name}
                  </p>
                </div>
              </div>
              
              {/* Menu d'actions */}
              <div className="relative">
                <button
                  onClick={() => toggleActionMenu(agent.id)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                
                {actionMenuVisible[agent.id] && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {/* Option d'approbation */}
                      {agent.status !== 'approved' && (
                        <button
                          onClick={() => handleAgentStatusChange(agent.id, 'approved')}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                          role="menuitem"
                          disabled={isLoading}
                        >
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          Approuver
                        </button>
                      )}
                      
                      {/* Option de rejet */}
                      {agent.status !== 'rejected' && (
                        <button
                          onClick={() => openRejectModal(agent.id)}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                          role="menuitem"
                          disabled={isLoading}
                        >
                          <XCircle className="h-4 w-4 mr-2 text-red-500" />
                          Rejeter
                        </button>
                      )}
                      
                      {/* Option d'archivage */}
                      {agent.status !== 'archived' && (
                        <button
                          onClick={() => handleAgentStatusChange(agent.id, 'archived')}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                          role="menuitem"
                          disabled={isLoading}
                        >
                          <Archive className="h-4 w-4 mr-2 text-gray-500" />
                          Archiver
                        </button>
                      )}
                      
                      {/* Option de mise en avant */}
                      {!agent.featured && agent.status === 'approved' && (
                        <button
                          onClick={() => handleAgentFeaturedChange(agent.id, true)}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                          role="menuitem"
                          disabled={isLoading}
                        >
                          <Star className="h-4 w-4 mr-2 text-yellow-500" />
                          Mettre à la une
                        </button>
                      )}
                      
                      {/* Option de retrait de la une */}
                      {agent.featured && (
                        <button
                          onClick={() => handleAgentFeaturedChange(agent.id, false)}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                          role="menuitem"
                          disabled={isLoading}
                        >
                          <Star className="h-4 w-4 mr-2 text-gray-500" />
                          Retirer de la une
                        </button>
                      )}
                      
                      {/* Lien vers la page publique */}
                      <Link
                        href={ROUTES.AGENT_DETAILS(agent.slug)}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        role="menuitem"
                        target="_blank"
                      >
                        <Eye className="h-4 w-4 mr-2 text-blue-500" />
                        Voir la page publique
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="px-4 py-2 flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {agent.short_description || 'Aucune description disponible'}
              </p>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <StatusBadge status={agent.status} />
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {getCategoryLabel(agent.category)}
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Créé le {formatDate(agent.created_at)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {agents.length === 0 && (
        <div className="bg-white dark:bg-gray-800 p-8 text-center text-gray-500 dark:text-gray-400 rounded-lg shadow">
          Aucun agent trouvé avec les filtres actuels
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Affichage de {agents.length} agents sur {totalAgents}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              className={`px-3 py-1 rounded-md ${
                currentPage <= 1
                  ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Précédent
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logique pour limiter le nombre de pages affichées
              let pageToShow;
              if (totalPages <= 5) {
                pageToShow = i + 1;
              } else if (currentPage <= 3) {
                pageToShow = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageToShow = totalPages - 4 + i;
              } else {
                pageToShow = currentPage - 2 + i;
              }
              
              // Afficher seulement si la page à montrer est valide
              if (pageToShow > 0 && pageToShow <= totalPages) {
                return (
                  <button
                    key={pageToShow}
                    onClick={() => handlePageChange(pageToShow)}
                    disabled={isLoading}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === pageToShow
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {pageToShow}
                  </button>
                );
              }
              return null;
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className={`px-3 py-1 rounded-md ${
                currentPage >= totalPages
                  ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Modal de rejet */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Motif de rejet
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Veuillez indiquer la raison pour laquelle vous rejetez cet agent. 
              Cette information sera visible par le créateur.
            </p>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-4"
              rows={4}
              placeholder="Motif du rejet..."
              disabled={isLoading}
            ></textarea>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                disabled={isLoading}
              >
                Annuler
              </button>
              
              <button
                onClick={() => agentToReject && handleAgentStatusChange(agentToReject, 'rejected')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={isLoading || !rejectionReason.trim()}
              >
                {isLoading ? 'En cours...' : 'Confirmer le rejet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
