import React from 'react';
import { ProspectSuggestion, Agent } from '@/types';
import AgentCard from '@/components/agents/AgentCard';

interface SuggestionsProps {
  suggestions: ProspectSuggestion[];
  agents?: Record<string, Agent>;
  loading?: boolean;
  onDismiss?: (suggestionId: string) => void;
}

/**
 * Composant affichant les suggestions d'agents IA basées sur les préférences utilisateur
 */
const Suggestions: React.FC<SuggestionsProps> = ({
  suggestions,
  agents = {},
  loading = false,
  onDismiss
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
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
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune suggestion</h3>
        <p className="mt-1 text-sm text-gray-500">
          Consultez plus d&apos;agents pour recevoir des suggestions personnalisées.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Suggestions pour vous
        </h2>
        <span className="text-sm text-gray-500">
          Basé sur votre historique de navigation
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.map((suggestion) => {
          const agent = agents[suggestion.agentId];
          
          if (!agent) {
            return null;
          }
          
          return (
            <div key={suggestion.id} className="relative">
              {/* Score de correspondance */}
              <div className="absolute top-2 right-2 z-10 flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full shadow-md">
                <span className="font-bold">{suggestion.matchScore}%</span>
              </div>
              
              {/* Badge avec la raison de la suggestion */}
              <div className="absolute top-14 right-0 z-10 bg-white px-2 py-1 rounded-l-md shadow-sm border border-gray-200">
                <span className="text-xs text-gray-600">{suggestion.reason}</span>
              </div>
              
              <div className="relative">
                <AgentCard agent={agent} />
                
                {/* Bouton pour ignorer la suggestion */}
                {onDismiss && (
                  <button
                    type="button"
                    onClick={() => onDismiss(suggestion.id)}
                    className="absolute top-2 left-2 z-10 p-1 bg-white rounded-full shadow-sm border border-gray-200 text-gray-400 hover:text-gray-600"
                    title="Ignorer cette suggestion"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {suggestions.length > 3 && (
        <div className="flex justify-center">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Voir plus de suggestions
          </button>
        </div>
      )}
    </div>
  );
};

export default Suggestions;
