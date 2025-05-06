'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES, STATS_METRICS, AGENT_CATEGORIES } from '@/constants';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProspectionTool from '@/components/dashboard/creator/ProspectionTool';
import { supabase } from '@/lib/supabaseClient';

type CreatorDashboardClientProps = {
  userData: {
    email: string;
    name?: string;
    id?: string;
  };
};

export default function CreatorDashboardClient({ userData }: CreatorDashboardClientProps) {
  console.log("CreatorDashboardClient initialisation avec userData:", userData);
  
  const router = useRouter();
  
  // États de base
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  
  // Définir les types pour les données du tableau de bord
  interface AgentData {
    id: string;
    name?: string;
    category?: string;
    createdAt?: string;
    pricing?: {
      startingPrice?: number;
      currency?: string;
      model?: string;
    };
    [key: string]: any;
  }
  
  interface DashboardData {
    userAgents: AgentData[];
    stats: { 
      views: number; 
      clicks: number; 
      contacts: number; 
      conversions: number;
    };
    agentViews: Record<string, number>;
    agentConversions: Record<string, number>;
    agentRevenue: Record<string, number>;
    contacts: any[];
    recommendations: any[];
  }
  
  // État pour les données du tableau de bord
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    userAgents: [],
    stats: { views: 0, clicks: 0, contacts: 0, conversions: 0 },
    agentViews: {},
    agentConversions: {},
    agentRevenue: {},
    contacts: [],
    recommendations: []
  });
  
  // État pour l'ID utilisateur
  const [userId, setUserId] = useState<string | undefined>(userData?.id || undefined);
  
  // Vérification de l'état de Supabase (diagnostic)
  const [supabaseStatus, setSupabaseStatus] = useState<string>('Vérification...');
  
  // Timeout global pour éviter le chargement infini
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('⚠️ Timeout global atteint - arrêt forcé du chargement');
        setHasTimedOut(true);
        setIsLoading(false);
      }
    }, 8000); // 8 secondes maximum
    
    return () => clearTimeout(timeoutId);
  }, [isLoading]);
  
  // Effet pour vérifier l'authentification côté client
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Si l'ID est déjà présent dans les props, on l'utilise
        if (userData?.id) {
          console.log('ID trouvé dans les props:', userData.id);
          setUserId(userData.id);
          setSupabaseStatus('Utilisation de l\'ID depuis les props');
          return;
        }
        
        // Vérifier si Supabase est disponible
        if (!supabase) {
          throw new Error('Client Supabase non disponible');
        }
        
        // Tester la connexion Supabase avec timeout
        const authPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout de la requête Supabase')), 5000)
        );
        
        const result = await Promise.race([authPromise, timeoutPromise]) as any;
        const { data, error } = result;
        
        if (error) {
          throw error;
        }
        
        if (data?.session?.user?.id) {
          console.log('ID trouvé dans la session Supabase:', data.session.user.id);
          setUserId(data.session.user.id);
          setSupabaseStatus('Session Supabase active');
        } else {
          console.warn('Aucun ID utilisateur trouvé dans la session Supabase');
          setSupabaseStatus('Pas de session Supabase');
        }
      } catch (e: any) {
        console.error('Erreur lors de la vérification d\'authentification:', e);
        setError(e);
        setSupabaseStatus(`Erreur: ${e.message}`);
      }
    };
    
    checkAuth();
  }, [userData?.id]);
  
  // Effet pour charger les données du dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Si aucun ID utilisateur n'est disponible, on ne peut pas charger les données
        if (!userId) {
          console.warn('Impossible de charger les données sans ID utilisateur');
          // Ne pas définir d'erreur ici - afficher un message dans l'interface
          setIsLoading(false);
          return;
        }
        
        // Vérifier si Supabase est disponible
        if (!supabase) {
          throw new Error('Client Supabase non disponible pour charger les données');
        }
        
        console.log('Chargement des données pour l\'utilisateur:', userId);
        
        // Charger les agents avec timeout
        const loadPromise = supabase
          .from('agents')
          .select('*')
          .eq('creator_id', userId);
          
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout du chargement des données')), 5000)
        );
        
        const result = await Promise.race([loadPromise, timeoutPromise]) as any;
        const { data: agents, error } = result;
        
        if (error) {
          throw error;
        }
        
        // Mettre à jour les données du dashboard
        // Les autres données seront vides/factices pour cette version simplifiée
        setDashboardData(prev => ({
          ...prev,
          userAgents: agents || []
        }));
        
        console.log('Données chargées avec succès, nombre d\'agents:', agents?.length || 0);
      } catch (e: any) {
        console.error('Erreur lors du chargement des données:', e);
        setError(e);
      } finally {
        // Terminer le chargement dans tous les cas
        setIsLoading(false);
      }
    };
    
    // Ne charger les données que si un ID utilisateur est disponible
    if (userId) {
      loadDashboardData();
    } else if (supabaseStatus !== 'Vérification...') {
      // Si la vérification d'authentification est terminée et qu'il n'y a pas d'ID
      setIsLoading(false);
    }
  }, [userId, supabaseStatus]);
  
  // Afficher un écran de chargement
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg text-gray-600">Chargement des données...</p>
            <p className="text-sm text-gray-500 mt-2">État Supabase: {supabaseStatus}</p>
            
            {hasTimedOut && (
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-lg">
                <h3 className="text-amber-700 font-medium mb-2">Chargement plus long que prévu</h3>
                <p className="text-sm text-amber-700 mb-2">
                  Le chargement prend plus de temps que d'habitude.
                </p>
                <button 
                  onClick={() => {
                    setIsLoading(false);
                    setHasTimedOut(true);
                  }}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded text-sm"
                >
                  Afficher le tableau de bord limité
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Afficher un message si aucun ID utilisateur n'est disponible
  if (!userId) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4 text-red-500">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Session utilisateur introuvable</h2>
        <p className="text-gray-600 mb-4">
          Nous n'avons pas pu identifier votre session. Veuillez vous reconnecter pour accéder à votre tableau de bord.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => window.location.reload()}>
            Rafraîchir
          </Button>
          <Button 
            onClick={() => router.push(ROUTES.AUTH.SIGNIN)}
            variant="primary"
          >
            Se connecter
          </Button>
        </div>
        
        <div className="mt-8 p-4 bg-gray-100 rounded-lg max-w-lg mx-auto text-left">
          <h3 className="font-medium mb-2">Détails techniques:</h3>
          <p className="text-sm text-gray-600">État Supabase: {supabaseStatus}</p>
          {error && (
            <p className="text-sm text-red-600 mt-2">Erreur: {error.message}</p>
          )}
        </div>
      </div>
    );
  }
  
  // Extraire les données du dashboard
  const { userAgents, stats, agentViews, agentConversions, agentRevenue, contacts, recommendations } = dashboardData;
  
  // Fonction utilitaire pour les calculs et formatages
  const formatNumber = (num: number) => new Intl.NumberFormat('fr-FR').format(num);
  
  // Rendu normal du tableau de bord
  return (
    <div>
      {/* Bandeau de notification si le chargement a été forcé par timeout */}
      {hasTimedOut && (
        <div className="p-4 mb-6 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-amber-800">Le chargement a été interrompu</h3>
              <p className="text-sm text-amber-700 mt-1">
                Certaines données peuvent être incomplètes. Vous pouvez essayer de rafraîchir la page.
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded text-sm"
              >
                Rafraîchir la page
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* En-tête du tableau de bord */}
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
      
      {/* Afficher un message d'erreur si nécessaire */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-red-800">Erreur lors du chargement des données</h3>
              <p className="text-sm text-red-700 mt-1">
                {error.message}
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-sm"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      )}
      
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
                    {/* Afficher les statistiques */}
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
      
      {/* Liste des agents */}
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
          {userAgents.length > 0 ? (
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
                      ? AGENT_CATEGORIES.find((c: any) => c.value === agent.category)?.label || 'Autre'
                      : 'Non catégorisé';
                      
                    // Statistiques
                    const views = agent.id ? agentViews[agent.id] || 0 : 0;
                    const conversions = agent.id ? agentConversions[agent.id] || 0 : 0;
                    const conversionRate = views > 0 ? ((conversions / views) * 100).toFixed(1) : '0.0';
                    
                    return (
                      <tr key={agent.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center text-blue-600 font-bold">
                              {agent.name?.charAt(0) || 'A'}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                <Link href={ROUTES.AGENT_DETAILS(agent.id) as unknown as URL} className="hover:text-blue-600">
                                  {agent.name || 'Agent sans nom'}
                                </Link>
                              </div>
                              <div className="text-sm text-gray-500">
                                Créé le {new Date(agent.createdAt || new Date()).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {categoryLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900 mr-2">{conversionRate}%</span>
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full bg-green-500"
                                  style={{ width: `${Math.min(parseFloat(conversionRate as string) * 5, 100)}%` }}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
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
        </CardBody>
      </Card>
      
      {/* Informations techniques (pour le débogage) */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm">
        <h3 className="font-medium mb-2">Informations de débogage</h3>
        <p><strong>ID utilisateur:</strong> {userId}</p>
        <p><strong>État Supabase:</strong> {supabaseStatus}</p>
        <p><strong>Agents chargés:</strong> {userAgents.length}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
        >
          Rafraîchir la page
        </button>
      </div>
    </div>
  );
}