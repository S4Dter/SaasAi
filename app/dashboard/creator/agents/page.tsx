
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { APP_NAME, ROUTES, AGENT_CATEGORIES } from '@/constants';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getAllAgents } from '@/mock/agents';

export const metadata: Metadata = {
  title: `Mes agents | ${APP_NAME}`,
  description: 'Gérez vos agents IA et suivez leurs performances',
};

export default function CreatorAgentsPage() {
  const userAgents = getAllAgents();

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes agents IA</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos agents IA et suivez leurs performances
          </p>
        </div>
        <Link href={ROUTES.DASHBOARD.CREATOR.ADD_AGENT as Route}>
          <Button>Ajouter un nouvel agent</Button>
        </Link>
      </div>

      {/* ... reste inchangé ... */}

      <tbody className="bg-white divide-y divide-gray-200">
        {userAgents.map((agent) => {
          const categoryLabel = agent.category
            ? AGENT_CATEGORIES.find((c) => c.value === agent.category)?.label
            : 'Non catégorisé';

          const views = Math.floor(Math.random() * 1000) + 50;
          const contacts = Math.floor(Math.random() * 100) + 5;
          const conversionRate = ((contacts / views) * 100).toFixed(1);

          const statuses = ['active', 'draft', 'pending'];
          const status = statuses[Math.floor(Math.random() * statuses.length)];

          return (
            <tr key={agent.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center text-blue-600 font-bold">
                    {agent.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      <Link
                        href={ROUTES.AGENT_DETAILS(agent.id) as Route}
                        className="hover:text-blue-600"
                      >
                        {agent.name}
                      </Link>
                    </div>
                    <div className="text-sm text-gray-500">
                      Créé le {new Date(agent.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              </td>

              {/* ... reste inchangé ... */}

            </tr>
          );
        })}
      </tbody>

      {/* ... reste inchangé ... */}

      {userAgents.length === 0 && (
        <div className="py-16 text-center">
          {/* ... contenu SVG ... */}
          <div className="mt-6">
            <Link href={ROUTES.DASHBOARD.CREATOR.ADD_AGENT as Route}>
              <Button>Créer un agent</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
