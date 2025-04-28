'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES, STATS_METRICS, AGENT_CATEGORIES } from '@/constants';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProspectionTool from '@/components/dashboard/creator/ProspectionTool';
import { useCreatorDashboard } from '@/lib/hooks/useCreatorDashboard';
import { supabase } from '@/lib/supabaseClient';

type CreatorDashboardClientProps = {
  userData: {
    email: string;
    name?: string;
    id?: string;
  };
};

/**
 * Composant client du tableau de bord créateur
 * Inclut une vérification d'authentification côté client pour éviter les redirections en boucle
 */
export default function CreatorDashboardClient({ userData }: CreatorDashboardClientProps) {
  console.log("userData:", userData, typeof userData);
  
  const router = useRouter();
  // État pour suivre le chargement
  const [isLoading, setIsLoading] = useState(true);
  const [isClientSideAuthChecked, setIsClientSideAuthChecked] = useState(false);
  
  // Vérification d'authentification côté client après hydratation
  useEffect(() => {
    // Fonction pour vérifier l'authentification côté client
    const checkClientSideAuth = async () => {
      try {
        // S'assurer que localStorage est disponible (hydratation complète)
        if (typeof window !== 'undefined') {
          // Vérifier la session utilisateur dans localStorage
          const storedUser = localStorage.getItem('user');
          
          // Si pas d'utilisateur dans localStorage et pas d'ID utilisateur dans les props
          if (!storedUser && !userData?.id) {
            console.log('CreatorDashboardClient: Aucun utilisateur trouvé, redirection vers login');
            router.replace(ROUTES.AUTH.SIGNIN);
            return;
          }
          
          // Si Supabase est disponible, vérifier également la session côté client
          if (supabase) {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
              console.log('CreatorDashboardClient: Aucune session Supabase, redirection vers login');
              router.replace(ROUTES.AUTH.SIGNIN);
              return;
            }
          }
          
          console.log('CreatorDashboardClient: Authentification validée côté client');
          setIsClientSideAuthChecked(true);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification d\'authentification côté client:', error);
        // En cas d'erreur, on considère que la vérification est faite pour éviter les boucles
        setIsClientSideAuthChecked(true);
      }
    };
    
    checkClientSideAuth();
  }, [router, userData?.id]);
  
  // Utiliser le hook pour récupérer les données seulement après vérification d'authentification
  const { data: dashboardData, loading, error } = useCreatorDashboard(
    isClientSideAuthChecked ? userData?.id : undefined
  );
  
  // Mettre à jour l'état de chargement global
  useEffect(() => {
    if (isClientSideAuthChecked) {
      setIsLoading(loading);
    }
  }, [loading, isClientSideAuthChecked]);
  
  // Gérer les erreurs
  if (error) {
    console.error('Erreur lors du chargement des données du dashboard:', error);
  }
  
  // Si une erreur est survenue, afficher un message d'erreur et un bouton pour réessayer
  if (error && !loading) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4 text-red-500">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Erreur de chargement des données</h2>
        <p className="text-gray-600 mb-4">{error.message || "Une erreur est survenue lors du chargement de vos données."}</p>
        <div className="flex justify-center">
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }
  
  // Extraire les données du dashboard - utiliser les données réelles de Supabase
  const userAgents = dashboardData?.userAgents || [];
  const stats = dashboardData?.stats || { views: 0, clicks: 0, contacts: 0, conversions: 0 };
  const agentViews = dashboardData?.agentViews || {};
  const agentConversions = dashboardData?.agentConversions || {};
  const agentRevenue = dashboardData?.agentRevenue || {};
  const contacts = dashboardData?.contacts || [];
  const recommendations = dashboardData?.recommendations || [];
  
// Fonction utilitaire pour les calculs et formatages
const formatNumber = (num: number) => new Intl.NumberFormat('fr-FR').format(num);

  // Afficher un indicateur de chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-600">Chargement des données...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenue {userData?.name || userData?.email || 'Créateur'} dans votre espace créateur
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
                    {/* Afficher les statistiques réelles */}
                    {metric.id === 'views' && stats.views}
                    {metric.id === 'clicks' && stats.clicks}
                    {metric.id === 'contacts' && stats.contacts}
                    {metric.id === 'conversions' && stats.conversions}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      
      {/* Statistiques rapides */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">
            Statistiques rapides
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Agents publiés</p>
                  <p className="text-2xl font-bold text-gray-900">{userAgents.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Prospects contactés</p>
                  <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      
      {/* Outil de prospection */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">
            Outil de prospection
          </h2>
        </CardHeader>
        <CardBody>
          <ProspectionTool 
            agents={userAgents}
            onContactEnterprise={async (enterpriseId, agentId, message) => {
              console.log('Contact entreprise', {enterpriseId, agentId, message});
              
              // Appel Supabase pour enregistrer le contact
              try {
                if (!supabase) {
                  throw new Error("Client Supabase non disponible");
                }
                
                const { error } = await supabase
                  .from('contacts')
                  .insert({
                    enterprise_id: enterpriseId,
                    agent_id: agentId,
                    creator_id: userData?.id,
                    message: message,
                    status: 'pending'
                  });
                
                if (error) throw error;
                // Retourne void au lieu de data pour être compatible avec le type attendu
              } catch (error) {
                console.error('Erreur lors de l\'enregistrement du contact:', error);
                throw error;
              }
            }}
          />
        </CardBody>
      </Card>
      
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
              {/* Graphique basé sur les revenus réels par agent */}
              <div className="bg-gray-50 p-4 rounded-lg h-64 flex items-end space-x-2">
                {/* Afficher les données réelles de revenus */}
                {Object.entries(agentRevenue).length > 0 ? (
                  // Données réelles
                  Object.entries(agentRevenue).map(([agentId, amount], i) => {
                    const agent = userAgents.find(a => a.id === agentId);
                    const maxRevenue = Math.max(...Object.values(agentRevenue));
                    const height = maxRevenue > 0 ? (amount / maxRevenue) * 100 : 10;
                    
                    return (
                      <div 
                        key={agentId} 
                        className="bg-blue-500 rounded-t w-full"
                        style={{ height: `${height}%` }}
                        title={`${agent?.name}: ${amount}€`}
                      ></div>
                    );
                  })
                ) : (
                  // Si aucun revenu enregistré, afficher un message plutôt que des données simulées
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <p>Aucune donnée de revenu disponible</p>
                      <p className="text-xs mt-2">Les revenus s'afficheront ici dès que vous aurez des transactions</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Revenus par agent</span>
              </div>
            </div>
            <div className="md:w-1/3 flex flex-col justify-between">
              {/* Calcul du total des revenus avec données réelles */}
              {(() => {
                // Calcul avec les données réelles de Supabase
                const totalRevenue = Object.values(agentRevenue).reduce((sum, amount) => sum + amount, 0);
                
                // Initialisation des valeurs
                let subscriptionRevenue = 0;
                let usageRevenue = 0;
                let onetimeRevenue = 0;
                
                // Parcourir les agents pour calculer les revenus par type
                userAgents.forEach(agent => {
                  const revenue = agentRevenue[agent.id] || 0;
                  if (agent.pricing.model === 'subscription') {
                    subscriptionRevenue += revenue;
                  } else if (agent.pricing.model === 'usage-based') {
                    usageRevenue += revenue;
                  } else if (agent.pricing.model === 'one-time') {
                    onetimeRevenue += revenue;
                  }
                });
                
                // Si aucune donnée disponible, utiliser des estimations pour l'interface
                if (totalRevenue === 0) {
                  subscriptionRevenue = 0;
                  usageRevenue = 0;
                  onetimeRevenue = 0;
                }
                
                return (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Total du mois</h3>
                      <p className="text-3xl font-bold text-gray-900">{totalRevenue} €</p>
                      {totalRevenue > 0 ? (
                        <p className="text-sm text-green-600">Données en temps réel</p>
                      ) : (
                        <p className="text-sm text-gray-500">Aucune transaction enregistrée</p>
                      )}
                    </div>
                    
                    <div className="space-y-3 mt-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium">Abonnements</h4>
                          <span className="text-sm font-bold">{subscriptionRevenue} €</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ 
                              width: totalRevenue > 0 
                                ? `${(subscriptionRevenue / totalRevenue) * 100}%` 
                                : '0%' 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium">Usage</h4>
                          <span className="text-sm font-bold">{usageRevenue} €</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full" 
                            style={{ 
                              width: totalRevenue > 0 
                                ? `${(usageRevenue / totalRevenue) * 100}%` 
                                : '0%' 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium">Achats uniques</h4>
                          <span className="text-sm font-bold">{onetimeRevenue} €</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div 
                            className="bg-purple-500 h-1.5 rounded-full" 
                            style={{ 
                              width: totalRevenue > 0 
                                ? `${(onetimeRevenue / totalRevenue) * 100}%` 
                                : '0%'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </CardBody>
      </Card>
      
      {/* Agents récents */}
      <Card className="mb-8">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Vos agents
          </h2>
          <div>
            <Link href={ROUTES.DASHBOARD.CREATOR.ADD_AGENT} className="mr-2">
              <Button>
                Créer un agent
              </Button>
            </Link>
            <Link href={ROUTES.DASHBOARD.CREATOR.AGENTS}>
              <Button variant="outline" size="sm">
                Voir tous
              </Button>
            </Link>
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
                    
                  // Statistiques réelles
                  const views = agentViews[agent.id] || 0;
                  const conversions = agentConversions[agent.id] || 0;
                  const conversionRate = views > 0 ? ((conversions / views) * 100).toFixed(1) : '0.0';
                  
                  return (
                    <tr key={agent.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center text-blue-600 font-bold">
                            {agent.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                            <Link href={ROUTES.AGENT_DETAILS(agent.id) as unknown as URL} className="hover:text-blue-600">
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
                          Éditer
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Supprimer
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
            Contacts récents
          </h2>
          <Link href={ROUTES.DASHBOARD.CREATOR.PROSPECTION}>
            <Button variant="outline" size="sm">
              Voir l&apos;outil de prospection
            </Button>
          </Link>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contacts.length > 0 ? (
              // Afficher les contacts réels
              contacts.slice(0, 3).map((contact, index) => (
                <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                        {contact.enterprise?.name?.charAt(0) || 'E'}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {contact.enterprise?.name || 'Entreprise'}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {contact.enterprise?.location || 'Localisation inconnue'}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${contact.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        contact.status === 'contacted' ? 'bg-blue-100 text-blue-800' : 
                        contact.status === 'meeting-scheduled' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {contact.status === 'pending' ? 'En attente' : 
                       contact.status === 'contacted' ? 'Contacté' : 
                       contact.status === 'meeting-scheduled' ? 'RDV programmé' : 
                       'Fermé'}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {contact.message}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <button className="text-sm text-gray-600 hover:text-gray-800">
                      Voir détails
                    </button>
                  </div>
                </div>
              ))
            ) : (
              // Message si aucun contact
              <div className="col-span-3 py-8 text-center">
                <p className="text-gray-500">Aucun contact récent. Utilisez l'outil de prospection pour contacter des entreprises.</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
      
      {/* Recommandations */}
      <Card className="mt-8">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Recommandations pour entreprises
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.length > 0 ? (
              // Afficher les recommandations réelles
              recommendations.slice(0, 3).map((recommendation) => (
                <div key={recommendation.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-3">
                        {recommendation.enterprise?.name?.charAt(0) || 'E'}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {recommendation.enterprise?.name || 'Entreprise'}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Agent recommandé: {userAgents.find(a => a.id === recommendation.agentId)?.name || 'Agent'}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Recommandation
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {recommendation.reason || "Recommandation basée sur les besoins de l'entreprise."}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(recommendation.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Contacter
                    </button>
                  </div>
                </div>
              ))
            ) : (
              // Message si aucune recommandation
              <div className="col-span-3 py-8 text-center">
                <p className="text-gray-500">Aucune recommandation récente. Les recommandations apparaîtront ici quand vous en aurez fait aux entreprises.</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
