import React from 'react';
import { Metadata } from 'next';
import { getFeaturedAgents } from '@/mock/agents';
import { ROUTES, APP_NAME, STATS_METRICS } from '@/constants';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import AgentCard from '@/components/agents/AgentCard';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: `Tableau de bord Entreprise | ${APP_NAME}`,
  description: 'Gérez vos favoris, historique et retrouvez des suggestions personnalisées',
};

/**
 * Page principale du dashboard entreprise
 */
export default function EnterpriseDashboardPage() {
  // Utiliser les agents en vedette comme suggestions pour la démo
  const suggestedAgents = getFeaturedAgents().slice(0, 2);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenue dans votre espace entreprise
        </h1>
        <p className="text-gray-600 mt-1">
          Retrouvez vos agents favoris, contactez des créateurs et découvrez de nouvelles solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Widgets de statistiques */}
        {STATS_METRICS.map((metric) => (
          <Card key={metric.id}>
            <CardBody>
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full ${metric.color} flex items-center justify-center mr-4`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {metric.id === 'views' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                    {metric.id === 'clicks' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    )}
                    {metric.id === 'contacts' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    )}
                    {metric.id === 'conversions' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    )}
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.floor(Math.random() * 100) + 10}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Agents favoris récents */}
      <Card className="mb-8">
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Vos agents favoris récents
          </h2>
          <Link href="/dashboard/enterprise/favorites">
            <Button variant="outline" size="sm">
              Voir tous
            </Button>
          </Link>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestedAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} compact />
            ))}
            {suggestedAgents.length === 0 && (
              <p className="text-gray-500 col-span-2 text-center py-4">
                Vous n&apos;avez pas encore d&apos;agents favoris. 
                <Link href="/agents" className="text-blue-600 ml-1 hover:underline">
                  Découvrez notre catalogue
                </Link>
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Suggestions personnalisées */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Suggestions personnalisées
          </h2>
          <Link href="/dashboard/enterprise/suggestions">
            <Button variant="outline" size="sm">
              Voir toutes
            </Button>
          </Link>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestedAgents.map((agent) => (
              <div key={agent.id} className="flex">
                <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600 font-bold">{agent.name.charAt(0)}</span>
                </div>
                <div>
                  <Link 
                    href={`/agents/${agent.id}`}
                    className="text-gray-900 font-medium hover:text-blue-600"
                  >
                    {agent.name}
                  </Link>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {agent.shortDescription}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="text-blue-600">Recommandé</span> car il correspond à votre secteur d&apos;activité
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
