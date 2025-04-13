'use client';

import React from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Composant d'erreur spécifique à la page détail d'un agent
 */
export default function AgentError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Vous pouvez logger l'erreur dans un service d'analyse ou un outil de surveillance
    console.error('Erreur de chargement de l\'agent :', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mb-6">
          <svg
            className="h-16 w-16 text-blue-500 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Impossible de charger les détails de l&apos;agent
          </h2>
          <p className="text-gray-600 mb-4">
            Nous rencontrons des difficultés pour afficher les informations de cet agent.
            L&apos;agent peut ne plus être disponible ou une erreur temporaire s&apos;est produite.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="bg-white p-3 rounded border border-blue-100 mb-4 text-left">
              <p className="text-sm font-medium text-blue-800">Détails de l&apos;erreur (visible en développement uniquement):</p>
              <pre className="mt-2 text-xs text-blue-600 whitespace-pre-wrap break-all overflow-x-auto">
                {error.message}
                {'\n'}
                {error.stack}
              </pre>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Réessayer
            </button>
            <Link
              href={ROUTES.AGENTS}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retour au catalogue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
