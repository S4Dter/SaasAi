import React from 'react';

/**
 * Composant de chargement spécifique à la page détail d'un agent
 */
export default function AgentLoading() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Fil d'Ariane - skeleton */}
        <div className="mb-6">
          <nav className="flex text-sm">
            <div className="bg-gray-200 h-5 w-16 rounded animate-pulse"></div>
            <span className="mx-2 text-gray-300">/</span>
            <div className="bg-gray-200 h-5 w-20 rounded animate-pulse"></div>
            <span className="mx-2 text-gray-300">/</span>
            <div className="bg-gray-200 h-5 w-32 rounded animate-pulse"></div>
          </nav>
        </div>
        
        {/* Skeleton de l'en-tête */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start">
              {/* Logo de l'agent */}
              <div className="w-16 h-16 bg-gray-200 rounded-md animate-pulse mr-4"></div>
              
              <div className="flex-grow">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
              
              {/* Prix et bouton */}
              <div className="ml-6 flex flex-col items-end">
                <div className="h-7 bg-gray-200 w-24 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 w-32 rounded mb-4 animate-pulse"></div>
                <div className="h-10 bg-gray-200 w-40 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Skeleton du contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Description */}
          <div className="lg:col-span-2 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="h-5 bg-gray-200 rounded animate-pulse" 
                style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
              ></div>
            ))}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-200 rounded-lg h-40 animate-pulse"></div>
            <div className="bg-gray-200 rounded-lg h-24 animate-pulse"></div>
            <div className="bg-gray-200 rounded-lg h-32 animate-pulse"></div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-8 flex justify-between">
          <div className="h-10 bg-gray-200 w-40 rounded animate-pulse"></div>
          <div className="flex gap-4">
            <div className="h-10 bg-gray-200 w-40 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 w-40 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
