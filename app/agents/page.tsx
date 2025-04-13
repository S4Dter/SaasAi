import React from 'react';
import { Metadata } from 'next';
import { getAllAgents } from '@/mock/agents';
import { AGENT_CATEGORIES, INTEGRATION_TYPES, APP_NAME } from '@/constants';
import AgentCard from '@/components/agents/AgentCard';

export const metadata: Metadata = {
  title: `Catalogue des agents IA | ${APP_NAME}`,
  description: 'Découvrez et filtrez notre catalogue d\'agents IA pour trouver la solution idéale pour votre entreprise',
};

/**
 * Page de catalogue des agents IA
 * 
 * Affiche tous les agents avec des filtres par catégorie, type d'intégration et recherche
 */
export default function AgentsPage() {
  // Dans une vraie application, ces états seraient gérés côté client avec useState
  // Ici on utilise simplement les données statiques car c'est une page server component
  const agents = getAllAgents();
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Catalogue des agents IA
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Découvrez notre sélection d&apos;agents IA innovants pour transformer votre entreprise
          </p>
        </div>
        
        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filtre par catégorie */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                defaultValue="all"
              >
                <option value="all">Toutes les catégories</option>
                {AGENT_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filtre par type d'intégration */}
            <div>
              <label htmlFor="integration" className="block text-sm font-medium text-gray-700 mb-1">
                Type d&apos;intégration
              </label>
              <select
                id="integration"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                defaultValue=""
              >
                <option value="">Tous les types</option>
                {INTEGRATION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Recherche */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Recherche
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Rechercher un agent..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Note: Dans une vraie application, il y aurait un bouton pour appliquer les filtres et/ou un code JavaScript pour filtrer en temps réel */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Note: Les filtres seraient fonctionnels avec JavaScript côté client. Pour ce prototype, les données sont statiques.
            </p>
          </div>
        </div>
        
        {/* Liste des agents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
        
        {/* Pagination (statique pour le prototype) */}
        <div className="flex justify-center">
          <nav className="inline-flex rounded-md shadow-sm -space-x-px">
            <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Précédent</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100"
            >
              1
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              2
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              3
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Suivant</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}

type AgentDetailPageProps = {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function AgentDetailPage({ params }: { 
  params: { id: string },
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // ...existing code...
}
