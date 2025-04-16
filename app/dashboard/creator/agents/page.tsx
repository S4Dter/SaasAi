import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { APP_NAME, ROUTES, AGENT_CATEGORIES } from '@/constants';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getAllAgents } from '@/mock/agents';

export const metadata: Metadata = {
  title: `Mes agents | ${APP_NAME}`,
  description: 'Gérez vos agents IA et suivez leurs performances',
};

/**
 * Page de gestion des agents du créateur
 */
export default function CreatorAgentsPage() {
  // Simulation d'agents créés par l'utilisateur (utilise tous les agents pour la démo)
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
        <Link href={ROUTES.DASHBOARD.CREATOR.ADD_AGENT}>
          <Button>
            Ajouter un nouvel agent
          </Button>
        </Link>
      </div>
      
      <Card className="mb-6">
        <CardBody className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Rechercher un agent..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les catégories</option>
              {AGENT_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="draft">Brouillons</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </CardBody>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              {userAgents.length} agents
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Trier par:</span>
              <select className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="date-desc">Date (récent)</option>
                <option value="date-asc">Date (ancien)</option>
                <option value="name">Nom</option>
                <option value="views">Vues</option>
                <option value="conversions">Conversions</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardBody>
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
                    Tarification
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performances
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userAgents.map((agent) => {
                  const categoryLabel = agent.category
                    ? AGENT_CATEGORIES.find(c => c.value === agent.category)?.label
                    : 'Non catégorisé';
                    
                  // Génération aléatoire de statistiques pour la démo
                  const views = Math.floor(Math.random() * 1000) + 50;
                  const contacts = Math.floor(Math.random() * 100) + 5;
                  const conversionRate = ((contacts / views) * 100).toFixed(1);
                  
                  // Statut aléatoire pour la démo
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
                              <Link href={ROUTES.AGENT_DETAILS(agent.id)} className="hover:text-blue-600">
                                {agent.name}
                              </Link>
                            </div>
                            <div className="text-sm text-gray-500">
                              Créé le {new Date(agent.createdAt).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {categoryLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          {agent.pricing.startingPrice} {agent.pricing.currency}
                          <span className="block text-xs text-gray-400">
                            {agent.pricing.model === 'subscription' ? 'Abonnement' : 
                            agent.pricing.model === 'one-time' ? 'Achat unique' : 
                            'Basé sur l\'usage'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900 mr-2">{conversionRate}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  parseFloat(conversionRate) > 8 ? 'bg-green-500' : 
                                  parseFloat(conversionRate) > 5 ? 'bg-yellow-500' : 'bg-red-500'
                                }`} 
                                style={{ width: `${Math.min(parseFloat(conversionRate) * 5, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {views} vues, {contacts} contacts
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            status === 'active' ? 'bg-green-100 text-green-800' : 
                            status === 'draft' ? 'bg-gray-100 text-gray-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {status === 'active' ? 'Actif' : 
                           status === 'draft' ? 'Brouillon' : 
                           'En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button className="text-blue-600 hover:text-blue-900">
                            Modifier
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            Statistiques
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {userAgents.length === 0 && (
              <div className="py-16 text-center">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  Vous n&apos;avez pas encore d&apos;agents
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Commencez par créer votre premier agent IA pour le proposer sur la marketplace.
                </p>
                <div className="mt-6">
                  <Link href={ROUTES.DASHBOARD.CREATOR.ADD_AGENT}>
                    <Button>
                      Créer un agent
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {userAgents.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Affichage de <span className="font-medium">1</span> à <span className="font-medium">{userAgents.length}</span> sur <span className="font-medium">{userAgents.length}</span> agents
              </div>
              <div className="flex space-x-1">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-500">
                  Précédent
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-blue-600 text-white">
                  1
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-500">
                  Suivant
                </button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
