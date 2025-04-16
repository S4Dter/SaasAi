import React from 'react';
import { Metadata } from 'next';
import { APP_NAME, STATS_METRICS, AGENT_CATEGORIES } from '@/constants';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import { getAllAgents } from '@/mock/agents';

export const metadata: Metadata = {
  title: `Statistiques | ${APP_NAME}`,
  description: 'Analysez les performances de vos agents IA',
};

/**
 * Page de statistiques et analyses pour le créateur
 */
export default function CreatorStatsPage() {
  // Utilisation des agents pour la démo
  const agents = getAllAgents();
  
  // Génération de données aléatoires pour les statistiques
  const getRandomStat = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  // Données simulées pour le graphique de vues
  const viewsData = Array.from({ length: 30 }, () => getRandomStat(50, 300));
  
  // Données simulées pour le graphique de conversions
  const conversionsData = Array.from({ length: 30 }, () => getRandomStat(3, 20));
  
  // Données simulées pour le graphique de revenus
  const revenueData = Array.from({ length: 30 }, () => getRandomStat(50, 500));
  
  // Données simulées pour la distribution par catégorie
  const categoryDistribution = AGENT_CATEGORIES.slice(0, 5).map(category => ({
    ...category,
    count: getRandomStat(5, 30),
  }));
  const totalCategoryCount = categoryDistribution.reduce((acc, cat) => acc + cat.count, 0);
  
  // Données simulées pour les performances par agent
  const agentPerformance = agents.slice(0, 5).map(agent => ({
    ...agent,
    views: getRandomStat(500, 2000),
    contacts: getRandomStat(20, 100),
    revenue: getRandomStat(500, 5000),
  }));
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Statistiques et performances</h1>
        <p className="text-gray-600 mt-1">
          Analysez les performances de vos agents IA et suivez vos revenus
        </p>
      </div>
      
      {/* Période et filtres */}
      <Card className="mb-6">
        <CardBody className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-grow">
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
                <option value="6m">6 derniers mois</option>
                <option value="1y">Année en cours</option>
                <option value="all">Toutes les données</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Agent :</span>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les agents</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Catégorie :</span>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toutes les catégories</option>
                {AGENT_CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Appliquer
            </button>
          </div>
        </CardBody>
      </Card>
      
      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900 mr-2">
                      {/* Générer des statistiques en fonction du type */}
                      {metric.id === 'views' && getRandomStat(3000, 8000)}
                      {metric.id === 'clicks' && getRandomStat(800, 1500)}
                      {metric.id === 'contacts' && getRandomStat(100, 300)}
                      {metric.id === 'conversions' && getRandomStat(20, 60)}
                    </p>
                    <p className="text-sm text-green-600">
                      +{getRandomStat(5, 20)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      
      {/* Graphique des vues */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Évolution des vues</h2>
        </CardHeader>
        <CardBody>
          <div className="h-80 flex items-end space-x-1 pr-4">
            {viewsData.map((count, index) => {
              const height = (count / Math.max(...viewsData)) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="bg-blue-500 w-full rounded-t"
                    style={{ height: `${height}%` }}
                    title={`Jour ${index + 1}: ${count} vues`}
                  ></div>
                  {index % 5 === 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      {index + 1}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-4 text-sm font-medium text-gray-700">
            <div>1 Avril</div>
            <div>15 Avril</div>
            <div>30 Avril</div>
          </div>
        </CardBody>
      </Card>
      
      {/* Graphiques côte à côte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Conversions */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Contacts et conversions</h2>
          </CardHeader>
          <CardBody>
            <div className="h-64 flex items-end space-x-1">
              {conversionsData.map((count, index) => {
                const height = (count / Math.max(...conversionsData)) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="bg-green-500 w-full rounded-t"
                      style={{ height: `${height}%` }}
                      title={`Jour ${index + 1}: ${count} contacts`}
                    ></div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <div>1 Avril</div>
              <div>30 Avril</div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-xl font-bold text-gray-900">
                {conversionsData.reduce((a, b) => a + b, 0)} contacts
              </div>
              <div className="text-sm text-gray-500">
                Taux de conversion moyen: {getRandomStat(5, 12)}%
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Revenus */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Revenus générés</h2>
          </CardHeader>
          <CardBody>
            <div className="h-64 flex items-end space-x-1">
              {revenueData.map((amount, index) => {
                const height = (amount / Math.max(...revenueData)) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="bg-purple-500 w-full rounded-t"
                      style={{ height: `${height}%` }}
                      title={`Jour ${index + 1}: ${amount}€`}
                    ></div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <div>1 Avril</div>
              <div>30 Avril</div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-xl font-bold text-gray-900">
                {revenueData.reduce((a, b) => a + b, 0)}€
              </div>
              <div className="text-sm text-gray-500">
                Revenu moyen par jour: {Math.round(revenueData.reduce((a, b) => a + b, 0) / revenueData.length)}€
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Distribution par catégorie */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Distribution par catégorie</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Graphique de distribution */}
            <div className="flex items-center h-64">
              <div className="w-full">
                {categoryDistribution.map((category, index) => {
                  const percentage = (category.count / totalCategoryCount) * 100;
                  return (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{category.label}</span>
                        <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            index === 0 ? 'bg-blue-600' :
                            index === 1 ? 'bg-green-500' :
                            index === 2 ? 'bg-yellow-500' :
                            index === 3 ? 'bg-purple-500' :
                            'bg-pink-500'
                          }`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Tableau de distribution */}
            <div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agents
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vues
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversion
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categoryDistribution.map((category, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {category.label}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getRandomStat(500, 2000)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getRandomStat(5, 15)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardBody>
      </Card>
      
      {/* Performance par agent */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Top 5 des agents les plus performants</h2>
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
                    Vues
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacts
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenus
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agentPerformance.map((agent, index) => {
                  const conversionRate = ((agent.contacts / agent.views) * 100).toFixed(1);
                  const categoryLabel = agent.category
                    ? AGENT_CATEGORIES.find(c => c.value === agent.category)?.label
                    : 'Non catégorisé';
                    
                  return (
                    <tr key={agent.id} className={index === 0 ? 'bg-blue-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {index === 0 && (
                            <div className="flex-shrink-0 h-8 w-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold mr-2">
                              1
                            </div>
                          )}
                          <div className="text-sm font-medium text-gray-900">
                            {agent.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {categoryLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {agent.views}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {agent.contacts}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 mr-2">{conversionRate}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                parseFloat(conversionRate) > 8 ? 'bg-green-500' : 
                                parseFloat(conversionRate) > 5 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} 
                              style={{ width: `${Math.min(parseFloat(conversionRate) * 5, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {agent.revenue}€
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
