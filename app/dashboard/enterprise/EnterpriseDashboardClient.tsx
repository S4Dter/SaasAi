'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES, STATS_METRICS } from '@/constants';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import AgentCard from '@/components/agents/AgentCard';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useEnterpriseDashboard } from '@/lib/hooks/useEnterpriseDashboard';
import { supabase } from '@/lib/supabaseClient';

type EnterpriseDashboardClientProps = {
  userData: {
    email: string;
    name?: string;
    id?: string;
  };
};

/**
 * Composant client du tableau de bord entreprise
 * Utilise les vraies données Supabase
 */
export default function EnterpriseDashboardClient({ userData }: EnterpriseDashboardClientProps) {
  console.log("userData:", userData, typeof userData);
  
  const router = useRouter();
  // État pour suivre le chargement
  const [isLoading, setIsLoading] = useState(true);
  const [isClientSideAuthChecked, setIsClientSideAuthChecked] = useState(false);
  
  // État pour stocker l'ID utilisateur réel à utiliser
  const [validUserId, setValidUserId] = useState<string | undefined>(undefined);
  
  // Vérification d'authentification côté client après hydratation
  useEffect(() => {
    // Fonction pour vérifier l'authentification côté client
    const checkClientSideAuth = async () => {
      try {
        // S'assurer que localStorage est disponible (hydratation complète)
        if (typeof window !== 'undefined') {
          console.log('EnterpriseDashboardClient: Vérification d\'authentification côté client');
          
          // Si l'ID utilisateur est déjà fourni dans les props et non vide
          if (userData?.id) {
            console.log('EnterpriseDashboardClient: ID utilisateur fourni dans les props:', userData.id);
            setValidUserId(userData.id);
            setIsClientSideAuthChecked(true);
            return;
          }
          
          // Vérifier la session utilisateur dans localStorage
          const storedUser = localStorage.getItem('user');
          let userIdFromStorage = '';
          
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              userIdFromStorage = parsedUser.id;
              console.log('EnterpriseDashboardClient: ID trouvé dans localStorage:', userIdFromStorage);
            } catch (e) {
              console.error('Erreur lors du parsing de l\'utilisateur dans localStorage:', e);
            }
          }
          
          // Si un ID est trouvé dans localStorage
          if (userIdFromStorage) {
            setValidUserId(userIdFromStorage);
            setIsClientSideAuthChecked(true);
            return;
          }
          
          // Si Supabase est disponible, vérifier la session côté client
          if (supabase) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.id) {
              console.log('EnterpriseDashboardClient: ID trouvé dans la session Supabase:', session.user.id);
              setValidUserId(session.user.id);
              setIsClientSideAuthChecked(true);
              return;
            }
          }
          
          // Aucune source d'ID utilisateur trouvée, rediriger vers login
          console.log('EnterpriseDashboardClient: Aucun ID utilisateur trouvé, redirection vers login');
          router.replace(ROUTES.AUTH.SIGNIN);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification d\'authentification côté client:', error);
        // En cas d'erreur grave, rediriger vers login
        router.replace(ROUTES.AUTH.SIGNIN);
      }
    };
    
    checkClientSideAuth();
  }, [router, userData?.id]);
  
  // Utiliser le hook pour récupérer les données du tableau de bord
  const { data: dashboardData, loading, error } = useEnterpriseDashboard(validUserId);
  
  // Mettre à jour l'état de chargement global
  useEffect(() => {
    if (isClientSideAuthChecked) {
      setIsLoading(loading);
    }
  }, [loading, isClientSideAuthChecked]);
  
  // Gérer les erreurs
  if (error) {
    console.error('Erreur lors du chargement des données du dashboard entreprise:', error);
  }
  
  // Extraire les agents depuis les données du tableau de bord
  const favoriteAgents = dashboardData?.favoriteAgents || [];
  const suggestedAgents = dashboardData?.suggestedAgents || [];
  const stats = dashboardData?.stats || { views: 0, clicks: 0, contacts: 0, conversions: 0 };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenue {userData?.name || userData?.email || 'Entreprise'} dans votre espace entreprise
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
            {/* Affichage conditionnel selon l'état de chargement */}
            {isLoading ? (
              // Indicateur de chargement
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex">
                    <div className="w-12 h-12 bg-gray-200 rounded-md mr-3 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded mb-1 w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : favoriteAgents.length > 0 ? (
              // Afficher les favoris réels
              favoriteAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} compact />
              ))
            ) : (
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
            {/* Affichage conditionnel selon l'état de chargement */}
            {isLoading ? (
              // Indicateur de chargement
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex">
                    <div className="w-12 h-12 bg-gray-200 rounded-md mr-3 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded mb-1 w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : suggestedAgents.length > 0 ? (
              // Afficher les suggestions réelles
              suggestedAgents.map((agent) => (
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
              ))
            ) : (
              // Message si aucune suggestion
              <div className="col-span-2 py-6 text-center">
                <p className="text-gray-500">
                  Aucune suggestion pour le moment. Explorez notre catalogue pour découvrir des agents.
                </p>
                <div className="mt-4">
                  <Link href="/agents">
                    <Button>Voir le catalogue</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
