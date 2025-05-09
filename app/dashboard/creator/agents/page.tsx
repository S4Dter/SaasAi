import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { APP_NAME, ROUTES, AGENT_CATEGORIES } from '@/constants';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { createServerSupabaseClient } from '@/lib/supabase-server';
// MOCK DATA: import { getAllAgents } from '@/mock/agents';
import { getServerSession } from '@/lib/api/auth-server';

export const metadata: Metadata = {
  title: `Mes agents | ${APP_NAME}`,
  description: 'Gérez vos agents IA et suivez leurs performances',
};

export default async function CreatorAgentsPage() {
  // Récupérer la session et l'utilisateur
  const session = await getServerSession();
  const userId = session?.user?.id;
  
  // Récupérer les agents de l'utilisateur depuis Supabase
  const supabase = createServerSupabaseClient();
  const { data: agentViews } = await supabase
    .from('agent_views')
    .select('agent_id, count')
    .eq('creator_id', userId || '');
  
  // Faire une requête pour obtenir le nombre de contacts par agent
  const { data: contacts } = await supabase
    .from('contacts')
    .select('agent_id')
    .eq('creator_id', userId || '');
    
  // Calculer manuellement le nombre de contacts par agent
  const agentContacts = contacts ? Array.from(
    contacts.reduce((acc, contact) => {
      const agentId = contact.agent_id;
      acc.set(agentId, (acc.get(agentId) || 0) + 1);
      return acc;
    }, new Map<string, number>())
  ).map(([agent_id, count]) => ({ agent_id, count })) : [];
  
  const { data: userAgents, error } = await supabase
    .from('agents')
    .select('*')
    .eq('creator_id', userId || '')
    .order('created_at', { ascending: false });

  // Préparer les données pour l'affichage
  const agents = userAgents || [];
  const viewsMap = new Map();
  const contactsMap = new Map();
  
  agentViews?.forEach(view => {
    viewsMap.set(view.agent_id, view.count || 0);
  });
  
  agentContacts.forEach((contact: { agent_id: string, count: number }) => {
    contactsMap.set(contact.agent_id, contact.count || 0);
  });

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

      {agents.length > 0 ? (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Liste de vos agents</h2>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vues
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacts
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taux
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      État
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agents.map((agent) => {
                    const categoryLabel = agent.category
                      ? AGENT_CATEGORIES.find((c) => c.value === agent.category)?.label
                      : 'Non catégorisé';

                    const views = viewsMap.get(agent.id) || 0;
                    const contacts = contactsMap.get(agent.id) || 0;
                    const conversionRate = views > 0 ? ((contacts / views) * 100).toFixed(1) : '0.0';

                    const status = agent.is_public ? 'active' : 'draft';
                    const statusColors = {
                      active: 'bg-green-100 text-green-800',
                      draft: 'bg-gray-100 text-gray-800',
                      pending: 'bg-yellow-100 text-yellow-800',
                    };
                    const statusLabels = {
                      active: 'Actif',
                      draft: 'Brouillon',
                      pending: 'En attente',
                    };

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
                                Créé le {new Date(agent.created_at).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{categoryLabel}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{views.toLocaleString('fr-FR')}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{contacts.toLocaleString('fr-FR')}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{conversionRate}%</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${statusColors[status as keyof typeof statusColors]}`}>
                            {statusLabels[status as keyof typeof statusLabels]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/dashboard/creator/edit/${agent.id}` as Route}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium mr-4"
                          >
                            Modifier
                          </Link>
                          <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="py-16 text-center bg-white rounded-lg shadow-sm border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun agent trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par créer votre premier agent IA pour qu'il apparaisse ici.
          </p>
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
