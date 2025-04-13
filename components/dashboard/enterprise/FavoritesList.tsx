import React from 'react';
import { Agent } from '@/types';
import AgentCard from '@/components/agents/AgentCard';

interface FavoritesListProps {
  favorites: string[]; // IDs des agents favoris
  agents: Record<string, Agent>;
  loading?: boolean;
  onRemove?: (agentId: string) => void;
}

/**
 * Composant affichant la liste des agents favoris d'un utilisateur entreprise
 */
const FavoritesList: React.FC<FavoritesListProps> = ({
  favorites,
  agents,
  loading = false,
  onRemove
}) => {
  // Filtrer les agents pour ne garder que les favoris
  const favoriteAgents = favorites
    .map(id => agents[id])
    .filter(Boolean);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (favoriteAgents.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun favori</h3>
        <p className="mt-1 text-sm text-gray-500">
          Parcourez notre catalogue et ajoutez des agents à vos favoris pour les retrouver facilement.
        </p>
        <div className="mt-6">
          <a
            href="/agents"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Découvrir des agents
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Vos agents favoris
        </h2>
        <span className="text-sm text-gray-500">
          {favoriteAgents.length} {favoriteAgents.length > 1 ? 'agents' : 'agent'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteAgents.map((agent) => (
          <div key={agent.id} className="relative">
            <AgentCard agent={agent} />
            
            {/* Bouton pour retirer des favoris */}
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(agent.id)}
                className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-sm border border-gray-200 text-red-400 hover:text-red-600"
                title="Retirer des favoris"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
      
      {favoriteAgents.length > 6 && (
        <div className="flex justify-center pt-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Afficher plus de favoris
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
