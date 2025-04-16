import React from 'react';
import { Metadata } from 'next';
import { getFeaturedAgents } from '@/mock/agents';
import { APP_NAME, ROUTES } from '@/constants';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import AgentCard from '@/components/agents/AgentCard';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: `Agents favoris | ${APP_NAME}`,
  description: 'Retrouvez et gérez vos agents IA favoris',
};

/**
 * Page des agents favoris de l'entreprise
 */
export default function FavoritesPage() {
  // Utilisation des agents en vedette comme favoris pour la démo
  const favoriteAgents = getFeaturedAgents();

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vos agents favoris</h1>
          <p className="text-gray-600 mt-1">
            Retrouvez rapidement vos agents préférés
          </p>
        </div>
        <Link href={ROUTES.AGENTS}>
          <Button variant="primary">Découvrir plus d&apos;agents</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              {favoriteAgents.length} agents favoris
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteAgents.map((agent) => (
              <div key={agent.id} className="relative">
                <button
                  className="absolute right-3 top-3 z-10 text-red-500 hover:text-red-700 bg-white rounded-full p-1.5 shadow-sm"
                  aria-label="Retirer des favoris"
                  title="Retirer des favoris"
                >
                  <svg
                    className="h-5 w-5"
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
                <AgentCard agent={agent} />
              </div>
            ))}
            {favoriteAgents.length === 0 && (
              <div className="col-span-3 py-16 text-center">
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
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  Aucun agent favori
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Vous n&apos;avez pas encore ajouté d&apos;agents à vos favoris.
                </p>
                <div className="mt-6">
                  <Link href={ROUTES.AGENTS}>
                    <Button>Explorer le catalogue</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
