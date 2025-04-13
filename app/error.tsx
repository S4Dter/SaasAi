'use client';

import React from 'react';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Composant d'erreur global pour l'application
 * 
 * Ce composant est automatiquement utilisé par Next.js
 * lorsqu'une erreur non gérée se produit dans l'application
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Vous pouvez logger l'erreur dans un service d'analyse ou un outil de surveillance
    console.error('Erreur non gérée :', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-red-50 p-5 rounded-lg border border-red-100 mb-6">
          <svg
            className="h-16 w-16 text-red-500 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Oups, quelque chose s&apos;est mal passé
          </h2>
          <p className="text-gray-500 mb-4">
            Une erreur inattendue s&apos;est produite. Notre équipe a été notifiée de ce problème.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="bg-white p-3 rounded border border-red-100 mb-4 text-left">
              <p className="text-sm font-medium text-red-800">Détails de l&apos;erreur (visible en développement uniquement):</p>
              <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap break-all overflow-x-auto">
                {error.message}
                {'\n'}
                {error.stack}
              </pre>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Réessayer
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retour à l&apos;accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
