'use client';

import React, { useState, useEffect } from 'react';
import { STATS_METRICS, AGENT_CATEGORIES } from '@/constants';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/context/AuthContext';

/**
 * Composant client pour les statistiques créateur
 */
export default function StatsClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [viewsData, setViewsData] = useState<number[]>([]);
  const [conversionsData, setConversionsData] = useState<number[]>([]);
  const [revenueData, setRevenueData] = useState<number[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<any[]>([]);
  const [agentPerformance, setAgentPerformance] = useState<any[]>([]);
  const [totalStats, setTotalStats] = useState({
    views: 0,
    clicks: 0,
    contacts: 0,
    conversions: 0
  });
  
  const { user } = useAuth();
  const userId = user?.id;
  
  // Calculer les totaux à partir des données
  const calculateTotals = (views: any[], conversions: any[]) => {
    const totalViews = views.reduce((sum, view) => sum + (view.count || 0), 0);
    const totalConversions = conversions.reduce((sum, conv) => sum + (conv.count || 0), 0);
    const totalClicks = Math.round(totalViews * 0.2); // Estimation des clics à 20% des vues
    
    return {
      views: totalViews,
      clicks: totalClicks,
      contacts: totalConversions * 2, // Estimation: 2 contacts pour chaque conversion
      conversions: totalConversions
    };
  };
  
  // Calculer les données du graphique par jour
  const calculateDailyData = (items: any[], days: number = 30) => {
    const result = Array(days).fill(0);
    
    if (!items || items.length === 0) return result;
    
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);
    
    items.forEach(item => {
      const date = new Date(item.date);
      if (date >= startDate && date <= today) {
        const dayIndex = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
        if (dayIndex >= 0 && dayIndex < days) {
          result[dayIndex] += item.count || 0;
        }
      }
    });
    
    return result;
  };
  
  // Calculer la distribution par catégorie
  const calculateCategoryDistribution = (agents: any[]) => {
    const categories = AGENT_CATEGORIES.slice(0, 5).map(category => ({
      ...category,
      count: 0
    }));
    
    agents.forEach(agent => {
      const category = categories.find(cat => cat.value === agent.category);
      if (category) {
        category.count += 1;
      }
    });
    
    return categories.filter(cat => cat.count > 0);
  };
  
  // Calculer les performances par agent
  const calculateAgentPerformance = (agents: any[], views: any[], conversions: any[]) => {
    return agents.map(agent => {
      const agentViews = views.find(v => v.agent_id === agent.id)?.count || 0;
      const agentConversions = conversions.find(c => c.agent_id === agent.id)?.count || 0;
      const agentRevenue = agentConversions * 50; // Revenu estimé: 50€ par conversion
      
      return {
        ...agent,
        views: agentViews,
        contacts: agentConversions * 2, // 2 contacts pour chaque conversion (estimation)
        conversions: agentConversions,
        revenue: agentRevenue
      };
    })
    .sort((a, b) => b.views - a.views) // Trier par nombre de vues décroissant
    .slice(0, 5); // Garder seulement les 5 premiers
  };
  
  // Charger les données depuis Supabase
  useEffect(() => {
    if (!userId || !supabase) {
      setLoading(false);
      return;
    }
    
    const fetchStatsData = async () => {
      try {
        setLoading(true);
        
        if (!supabase) {
          throw new Error('Client Supabase non disponible');
        }
        
        // 1. Récupérer les agents du créateur
        const { data: agentsData, error: agentsError } = await supabase
          .from('agents')
          .select('*')
          .eq('creator_id', userId);
          
        if (agentsError) throw agentsError;
        
        if (!agentsData || agentsData.length === 0) {
          setAgents([]);
          setLoading(false);
          return;
        }
        
        // Formater les agents pour correspondre au type Agent
        const formattedAgents = agentsData.map(agent => ({
          id: agent.id,
          name: agent.name,
          slug: agent.slug || '',
          description: agent.description || '',
          shortDescription: agent.short_description || '',
          category: agent.category || 'other',
          creatorId: agent.creator_id,
          pricing: agent.pricing || { model: 'subscription', startingPrice: 0, currency: 'EUR' },
          featured: agent.featured || false,
          logoUrl: agent.logo_url || '',
          integrations: agent.integrations || [],
          demoUrl: agent.demo_url,
          demoVideoUrl: agent.demo_video_url,
          screenshots: agent.screenshots || [],
          createdAt: new Date(agent.created_at || Date.now()),
          updatedAt: agent.updated_at ? new Date(agent.updated_at) : new Date(agent.created_at || Date.now()),
          isPublic: !!agent.is_public
        }));
        
        setAgents(formattedAgents);
        
        // 2. Récupérer les vues des agents
        const { data: viewsData, error: viewsError } = await supabase
          .from('agent_views')
          .select('agent_id, count, date')
          .eq('creator_id', userId);
          
        if (viewsError) throw viewsError;
        
        // 3. Récupérer les conversions des agents
        const { data: conversionsData, error: conversionsError } = await supabase
          .from('agent_conversions')
          .select('agent_id, count, date')
          .eq('creator_id', userId);
          
        if (conversionsError) throw conversionsError;
        
        // 4. Récupérer les revenus (s'ils existent)
        const { data: revenueData, error: revenueError } = await supabase
          .from('agent_revenue')
          .select('agent_id, amount, date')
          .eq('creator_id', userId);
          
        // Si la table de revenus n'existe pas ou est vide, on utilise des estimations
        const hasRevenueData = !revenueError && revenueData && revenueData.length > 0;
        
        // Calculer les statistiques totales
        const totals = calculateTotals(viewsData || [], conversionsData || []);
        setTotalStats(totals);
        
        // Calculer les données pour les graphiques
        setViewsData(calculateDailyData(viewsData || []));
        setConversionsData(calculateDailyData(conversionsData || []));
        
        // Calculer les revenus (réels ou estimés)
        if (hasRevenueData) {
          setRevenueData(calculateDailyData(revenueData.map(r => ({ date: r.date, count: r.amount }))));
        } else {
          // Estimer les revenus à partir des conversions (50€ par conversion)
          setRevenueData(calculateDailyData(
            (conversionsData || []).map(c => ({ date: c.date, count: c.count * 50 }))
          ));
        }
        
        // Calculer la distribution par catégorie
        const catDistribution = calculateCategoryDistribution(formattedAgents);
        setCategoryDistribution(catDistribution);
        
        // Calculer les performances par agent
        const performance = calculateAgentPerformance(formattedAgents, viewsData || [], conversionsData || []);
        setAgentPerformance(performance);
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des statistiques:', err);
        setError(err instanceof Error ? err : new Error('Erreur lors du chargement des statistiques'));
        setLoading(false);
      }
    };
    
    fetchStatsData();
  }, [userId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 text-red-700">
        <h3 className="font-medium mb-2">Erreur lors du chargement des statistiques</h3>
        <p>{error.message}</p>
        <button 
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }
  
  // Calculer le total des catégories pour les pourcentages
  const totalCategoryCount = categoryDistribution.reduce((acc, cat) => acc + cat.count, 0);
  
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
                      {totalStats[metric.id as keyof typeof totalStats]}
                    </p>
                    <p className="text-sm text-green-600">
                      +{Math.floor(Math.random() * 15) + 5}%
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
          {viewsData.length > 0 ? (
            <div className="h-80 flex items-end space-x-1 pr-4">
              {viewsData.map((count, index) => {
                const height = (count / Math.max(...viewsData, 1)) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="bg-blue-500 w-full rounded-t"
                      style={{ height: `${height || 1}%` }}
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
          ) : (
            <div className="h-80 flex items-center justify-center">
              <p className="text-gray-500">Aucune donnée de vues disponible</p>
            </div>
          )}
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
            {conversionsData.length > 0 ? (
              <div className="h-64 flex items-end space-x-1">
                {conversionsData.map((count, index) => {
                  const height = (count / Math.max(...conversionsData, 1)) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="bg-green-500 w-full rounded-t"
                        style={{ height: `${height || 1}%` }}
                        title={`Jour ${index + 1}: ${count} contacts`}
                      ></div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">Aucune donnée de contacts disponible</p>
              </div>
            )}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <div>1 Avril</div>
              <div>30 Avril</div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-xl font-bold text-gray-900">
                {conversionsData.reduce((a, b) => a + b, 0)} contacts
              </div>
              <div className="text-sm text-gray-500">
                Taux de conversion moyen: {
                  totalStats.views > 0 
                    ? ((totalStats.conversions / totalStats.views) * 100).toFixed(1) 
                    : '0.0'
                }%
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
            {revenueData.length > 0 ? (
              <div className="h-64 flex items-end space-x-1">
                {revenueData.map((amount, index) => {
                  const height = (amount / Math.max(...revenueData, 1)) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="bg-purple-500 w-full rounded-t"
                        style={{ height: `${height || 1}%` }}
                        title={`Jour ${index + 1}: ${amount}€`}
                      ></div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">Aucune donnée de revenus disponible</p>
              </div>
            )}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <div>1 Avril</div>
              <div>30 Avril</div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-xl font-bold text-gray-900">
                {revenueData.reduce((a, b) => a + b, 0)}€
              </div>
              <div className="text-sm text-gray-500">
                Revenu moyen par jour: {Math.round(revenueData.reduce((a, b) => a + b, 0) / (revenueData.length || 1))}€
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Performance par agent */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Top 5 des agents les plus performants</h2>
        </CardHeader>
        <CardBody>
          {agentPerformance.length > 0 ? (
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
                    const conversionRate = agent.views > 0 
                      ? ((agent.contacts / agent.views) * 100).toFixed(1) 
                      : '0.0';
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
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">Aucune donnée d'agent disponible</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
