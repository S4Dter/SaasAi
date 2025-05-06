'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES, STATS_METRICS, AGENT_CATEGORIES } from '@/constants';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/context/AuthContext';

type UserData = {
  id: string;
  email: string;
  name?: string;
  role?: string;
};

type CreatorDashboardClientProps = {
  userData: UserData;
};

export default function CreatorDashboardClient({ userData }: CreatorDashboardClientProps) {
  const router = useRouter();
  const authInitialized = useRef(false);
  const { user: contextUser, loading: authLoading } = useAuth();
  
  // États
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [authState, setAuthState] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  
  // État pour stocker l'identifiant de l'utilisateur, avec priorité et réconciliation
  const [effectiveUserId, setEffectiveUserId] = useState<string | null>(null);
  
  // États pour les données du tableau de bord
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
  
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    userAgents: [],
    stats: { views: 0, clicks: 0, contacts: 0, conversions: 0 },
    agentViews: {},
    agentConversions: {},
    agentRevenue: {},
    contacts: [],
    recommendations: []
  });
  
  // Système de monitoring - logs et informations
  const [authAttempts, setAuthAttempts] = useState(0);
  const [authSource, setAuthSource] = useState<string>('Aucune source');
  const [loadAttempts, setLoadAttempts] = useState(0);
  
  // Système anti-boucle avancé
  const maxCheckAttempts = 3;
  const maxLoadAttempts = 3;
  const lastAuthCheck = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Step 1: Auth Reconciliation - priorité aux sources d'authentification
  useEffect(() => {
    // Anti-boucle: limite la fréquence des vérifications d'authentification
    const now = Date.now();
    if (now - lastAuthCheck.current < 2000 && authAttempts > 0) {
      console.log('🛑 Verification d\'auth trop fréquente, ignorée');
      return;
    }
    
    lastAuthCheck.current = now;
    setAuthAttempts(prev => prev + 1);
    
    // N'exécuter qu'un certain nombre de fois
    if (authAttempts >= maxCheckAttempts) {
      console.log(`⚠️ Limite d'authentification atteinte (${maxCheckAttempts}), arrêt des vérifications`);
      setAuthState(effectiveUserId ? 'authenticated' : 'unauthenticated');
      return;
    }
    
    const determineUserId = async () => {
      // Déjà authentifié?
      if (effectiveUserId) {
        console.log('🔑 ID déjà déterminé:', effectiveUserId);
        setAuthState('authenticated');
        return;
      }
      
      console.log('🔍 Vérification d\'authentification tentative #', authAttempts);
      
      // 1. Props venant du serveur (priority 1)
      if (userData?.id) {
        console.log('✅ Utilisation ID des props:', userData.id);
        setEffectiveUserId(userData.id);
        setAuthSource('props serveur');
        setAuthState('authenticated');
        return;
      }
      
      // 2. React Context (priority 2)
      if (!authLoading && contextUser?.id) {
        console.log('✅ Utilisation ID du context Auth:', contextUser.id);
        setEffectiveUserId(contextUser.id);
        setAuthSource('context React');
        setAuthState('authenticated');
        return;
      }
      
      // 3. Supabase Auth directement (priority 3)
      try {
        // Vérifier si Supabase est disponible
        if (!supabase) {
          console.error('Client Supabase non disponible pour la vérification d\'authentification');
          setAuthState('unauthenticated');
          return;
        }
        
        // Nous n'utilisons pas await directement pour éviter les problèmes de mémoire avec les
        // effets React, mais plutôt une approche avec gestion des promesses
        supabase.auth.getSession()
          .then(({ data, error }) => {
            if (error) throw error;
            
            if (data?.session?.user?.id) {
              console.log('✅ Utilisation ID de supabase.auth.getSession:', data.session.user.id);
              setEffectiveUserId(data.session.user.id);
              setAuthSource('Supabase getSession');
              setAuthState('authenticated');
              return;
            }
            
            // 4. LocalStorage comme fallback (priority 4)
            try {
              const storedUser = localStorage.getItem('user');
              if (storedUser) {
                const userObj = JSON.parse(storedUser);
                if (userObj?.id) {
                  console.log('✅ Utilisation ID depuis localStorage:', userObj.id);
                  setEffectiveUserId(userObj.id);
                  setAuthSource('localStorage');
                  setAuthState('authenticated');
                  return;
                }
              }
            } catch (lsError) {
              console.error('Erreur lors de la lecture localStorage:', lsError);
            }
            
            // Aucune source d'authentification trouvée
            console.log('❌ Aucun ID trouvé dans toutes les sources');
            setAuthState('unauthenticated');
          })
          .catch(error => {
            console.error('Erreur lors de la vérification Supabase:', error);
            setAuthState('unauthenticated');
          });
      } catch (e) {
        console.error('Exception lors de la vérification d\'authentification:', e);
        setAuthState('unauthenticated');
      }
    };
    
    determineUserId();
  }, [userData, contextUser, authLoading, authAttempts, effectiveUserId]);
  
  // Step 2: Chargement des données du dashboard seulement si authentifié
  useEffect(() => {
    // N'exécuter que si nous avons un ID utilisateur et passé l'étape d'authentification
    if (!effectiveUserId || authState !== 'authenticated') {
      return;
    }
    
    // Anti-boucle: limiter le nombre de tentatives de chargement
    if (loadAttempts >= maxLoadAttempts) {
      console.log(`⚠️ Limite de chargement atteinte (${maxLoadAttempts}), arrêt des tentatives`);
      setIsLoading(false);
      return;
    }
    
    const loadDashboardData = async () => {
      // Actualiser le compteur de tentatives
      setLoadAttempts(prev => prev + 1);
      setIsLoading(true);
      
      try {
        console.log('📊 Chargement des données pour l\'utilisateur:', effectiveUserId);
        
        // Établir un timeout de sécurité (circuit breaker pattern)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          console.log('⏱️ Timeout du chargement des données atteint');
          setIsLoading(false);
          setError(new Error('Le chargement des données a pris trop de temps'));
        }, 8000);
        
        // Vérifier si Supabase est disponible
        if (!supabase) {
          throw new Error('Client Supabase non disponible pour charger les données');
        }
        
        // Charger les agents
        const { data: agents, error } = await supabase
          .from('agents')
          .select('*')
          .eq('creator_id', effectiveUserId);
          
        if (error) throw error;
        
        // Si nous arrivons ici, le chargement a réussi
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        // Simuler des données de statistiques basiques
        // Dans un environnement réel, vous chargeriez ces données depuis Supabase
        const mockStats = {
          views: Math.floor(Math.random() * 1000),
          clicks: Math.floor(Math.random() * 200),
          contacts: Math.floor(Math.random() * 50),
          conversions: Math.floor(Math.random() * 20)
        };
        
        // Mettre à jour les données du dashboard
        setDashboardData(prev => ({
          ...prev,
          userAgents: agents || [],
          stats: mockStats,
          agentViews: (agents || []).reduce((acc, agent) => {
            acc[agent.id] = Math.floor(Math.random() * 500);
            return acc;
          }, {}),
          agentConversions: (agents || []).reduce((acc, agent) => {
            acc[agent.id] = Math.floor(Math.random() * 50);
            return acc;
          }, {})
        }));
        
        console.log('✅ Données chargées avec succès:', (agents || []).length, 'agents');
        setError(null);
      } catch (e: any) {
        console.error('Erreur lors du chargement des données:', e);
        setError(e);
      } finally {
        setIsLoading(false);
        
        // Nettoyage du timeout si nécessaire
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };
    
    loadDashboardData();
    
    // Nettoyage lors du démontage
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [effectiveUserId, authState, loadAttempts]);
  
  // Gérer le cas de non-authentification
  if (authState === 'unauthenticated') {
    return (
      <div className="p-8 text-center">
        <div className="mb-4 text-amber-500">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Authentification requise</h2>
        <p className="text-gray-600 mb-4">
          Veuillez vous connecter pour accéder à votre tableau de bord créateur.
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            onClick={() => router.push(ROUTES.AUTH.SIGNIN)}
            variant="primary"
          >
            Se connecter
          </Button>
          <Button 
            onClick={() => router.push(ROUTES.HOME)}
            variant="outline"
          >
            Retour à l'accueil
          </Button>
        </div>
        
        <div className="mt-8 p-4 bg-gray-100 rounded-lg max-w-lg mx-auto text-left">
          <h3 className="font-medium mb-2">Informations de diagnostic:</h3>
          <p className="text-sm text-gray-600">Tentatives d'authentification: {authAttempts}/{maxCheckAttempts}</p>
          <p className="text-sm text-gray-600">Source utilisée: {authSource}</p>
          {error && (
            <p className="text-sm text-red-600 mt-2">Erreur: {error.message}</p>
          )}
        </div>
      </div>
    );
  }
  
  // Afficher un écran de chargement
  if (isLoading || authState === 'checking') {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg text-gray-600">
              {authState === 'checking' ? 'Vérification de l\'authentification...' : 'Chargement des données...'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Source d'authentification: {authSource}
            </p>
            
            {loadAttempts > 1 && (
              <div className="mt-6">
                <p className="text-sm text-amber-600">
                  Tentative {loadAttempts}/{maxLoadAttempts}...
                </p>
              </div>
            )}
            
            {loadAttempts === maxLoadAttempts && (
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-lg">
                <h3 className="text-amber-700 font-medium mb-2">Chargement plus long que prévu</h3>
                <p className="text-sm text-amber-700 mb-2">
                  Le chargement prend plus de temps que d'habitude.
                </p>
                <button 
                  onClick={() => {
                    setIsLoading(false);
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
  
  // Extraire les données du dashboard
  const { userAgents, stats, agentViews, agentConversions } = dashboardData;
  
  // Affichage d'erreur
  if (error) {
    return (
      <div className="p-8">
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
              <div className="mt-3 flex space-x-2">
                <button 
                  onClick={() => {
                    setLoadAttempts(0);
                    setAuthAttempts(0);
                    setAuthState('checking');
                  }} 
                  className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-sm"
                >
                  Réessayer
                </button>
                <button 
                  onClick={() => router.push(ROUTES.HOME)} 
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-sm"
                >
                  Retour à l'accueil
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Afficher un tableau de bord limité malgré l'erreur */}
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Fonctionnalités limitées disponibles</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link href={ROUTES.DASHBOARD.CREATOR.ADD_AGENT} className="p-3 border rounded hover:bg-blue-50 text-center">
              Ajouter un agent
            </Link>
            <Link href={ROUTES.DASHBOARD.CREATOR.AGENTS} className="p-3 border rounded hover:bg-blue-50 text-center">
              Gérer mes agents
            </Link>
            <Link href={ROUTES.HOME} className="p-3 border rounded hover:bg-blue-50 text-center">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Fonction utilitaire pour les formatages
  const formatNumber = (num: number) => new Intl.NumberFormat('fr-FR').format(num);
  
  // Rendu normal du tableau de bord
  return (
    <div>
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
                    {metric.id === 'views' && formatNumber(stats.views)}
                    {metric.id === 'clicks' && formatNumber(stats.clicks)}
                    {metric.id === 'contacts' && formatNumber(stats.contacts)}
                    {metric.id === 'conversions' && formatNumber(stats.conversions)}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      
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
        <h3 className="font-medium mb-2">Informations de diagnostic</h3>
        <p><strong>ID utilisateur:</strong> {effectiveUserId}</p>
        <p><strong>Source d'authentification:</strong> {authSource}</p>
        <p><strong>Tentatives d'authentification:</strong> {authAttempts}/{maxCheckAttempts}</p>
        <p><strong>Tentatives de chargement:</strong> {loadAttempts}/{maxLoadAttempts}</p>
        <p><strong>État d'authentification:</strong> {authState}</p>
        <p><strong>Agents chargés:</strong> {userAgents.length}</p>
      </div>
    </div>
  );
}
