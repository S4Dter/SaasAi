import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { APP_NAME, ROUTES, STATS_METRICS, AGENT_CATEGORIES } from '@/constants';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getAllAgents } from '@/mock/agents';

export const metadata: Metadata = {
  title: `Tableau de bord Créateur | ${APP_NAME}`,
  description: 'Gérez vos agents IA, suivez vos statistiques et trouvez de nouveaux clients',
};

/**
 * Page principale du dashboard créateur
 */
export default function CreatorDashboardPage() {
  // Simulation d'agents créés par l'utilisateur (les 3 premiers de la liste)
  const userAgents = getAllAgents().slice(0, 3);
  
  // Génération de statistiques aléatoires pour la démo
  const getRandomStat = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenue dans votre espace créateur
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez vos agents IA, suivez vos performances et développez votre activité
          </p>
        </div>
        <Link href={ROUTES.DASHBOARD.CREATOR.ADD_AGENT}>
          <Button>
            Ajouter un nouvel agent
          </Button>
        </Link>
      </div>
      
      {/* Résumé des métriques */}
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
                    {/* Générer des statistiques aléatoires pour la démo */}
                    {metric.id === 'views' && getRandomStat(500, 1500)}
                    {metric.id === 'clicks' && getRandomStat(100, 300)}
                    {metric.id === 'contacts' && getRandomStat(20, 50)}
                    {metric.id === 'conversions' && getRandomStat(5, 15)}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      
      {/* Revenus récents */}
      <Card className="mb-8">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Revenus du mois
          </h2>
          <Link href={ROUTES.DASHBOARD.CREATOR.STATS}>
            <Button variant="outline" size="sm">
              Voir les statistiques détaillées
            </Button>
          </Link>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col-reverse md:flex-row gap-6">
            <div className="md:w-2/3">
              {/* Graphique simplifié pour la démo */}
              <div className="bg-gray-50 p-4 rounded-lg h-64 flex items-end space-x-2">
                {Array.from({ length: 30 }).map((_, i) => {
                  const height = Math.floor(Math.random() * 70) + 10;
                  return (
                    <div 
                      key={i} 
                      className="bg-blue-500 rounded-t w-full"
                      style={{ height: `${height}%` }}
                      title={`Jour ${i + 1}: ${height * 10}€`}
                    ></div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>1 Avril</span>
                <span>15 Avril</span>
                <span>30 Avril</span>
              </div>
            </div>
            <div className="md:w-1/3 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total du mois</h3>
                <p className="text-3xl font-bold text-gray-900">4 320 €</p>
                <p className="text-sm text-green-600">+12% par rapport au mois dernier</p>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Abonnements</h4>
                    <span className="text-sm font-bold">3 240 €</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Usage</h4>
                    <span className="text-sm font-bold">980 €</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Achats uniques</h4>
                    <span className="text-sm font-bold">100 €</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      
      {/* Agents récents */}
      <Card className="mb-8">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Vos agents récents
          </h2>
          <Link href={ROUTES.DASHBOARD.CREATOR.AGENTS}>
            <Button variant="outline" size="sm">
              Gérer tous vos agents
            </Button>
          </Link>
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
                    Prix
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performances
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
                    
                  // Statistiques simulées
                  const views = getRandomStat(150, 500);
                  const conversions = getRandomStat(5, 20);
                  const conversionRate = ((conversions / views) * 100).toFixed(1);
                  
                  return (
                    <tr key={agent.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
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
                        {agent.pricing.startingPrice} {agent.pricing.currency}
                        <span className="block text-xs text-gray-400">
                          {agent.pricing.model === 'subscription' ? 'Abonnement' : 
                           agent.pricing.model === 'one-time' ? 'Achat unique' : 
                           'Basé sur l\'usage'}
                        </span>
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
                            {views} vues, {conversions} conversions
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                          Modifier
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Stats
                        </button>
                      </td>
                    </tr>
                  )
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
        </CardBody>
      </Card>
      
      {/* Prospects */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Prospects récents
          </h2>
          <Link href={ROUTES.DASHBOARD.CREATOR.PROSPECTION}>
            <Button variant="outline" size="sm">
              Voir l&apos;outil de prospection
            </Button>
          </Link>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-bold mr-3">
                      {['E', 'J', 'C'][index]}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {['Entreprise Tech', 'Jardin Connecté', 'Cabinet Conseil'][index]}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {['Paris, France', 'Lyon, France', 'Bordeaux, France'][index]}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Nouveau
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    {[
                      'Entreprise en croissance recherchant des solutions d\'automatisation marketing.',
                      'Startup spécialisée dans les objets connectés pour jardins, intéressée par des agents IA.',
                      'Cabinet de conseil cherchant à intégrer l\'IA dans ses services clients.'
                    ][index]}
                  </p>
                </div>
                <div className="mt-4 flex justify-between">
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Voir le profil
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-800">
                    Contacter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
