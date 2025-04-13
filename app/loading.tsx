import React from 'react';

/**
 * Composant de chargement global pour l'application
 * 
 * Ce composant est automatiquement utilisé par Next.js
 * lors du chargement d'une nouvelle page ou d'une route
 */
export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Chargement...</h2>
        <p className="text-gray-500">
          Nous préparons le contenu pour vous, merci de patienter.
        </p>
      </div>
    </div>
  );
}
