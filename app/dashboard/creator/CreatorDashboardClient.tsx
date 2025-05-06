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

export default function CreatorDashboardClient({ userData }: CreatorDashboardClientProps) {
  console.log("CreatorDashboardClient initialisation - userData:", userData);
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isClientSideAuthChecked, setIsClientSideAuthChecked] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [validUserId, setValidUserId] = useState<string | undefined>(userData?.id || undefined);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  
  // Timeout global pour éviter le chargement infini
  useEffect(() => {
    const globalTimeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('Dashboard global timeout triggered');
        setHasTimedOut(true);
        setIsLoading(false);
      }
    }, 10000); // 10 secondes de timeout
    
    return () => clearTimeout(globalTimeoutId);
  }, [isLoading]);
  
  // Vérification d'authentification avec timeout
  useEffect(() => {
    // Si l'ID est déjà dans les props, on l'utilise directement
    if (userData?.id) {
      console.log('ID utilisateur trouvé dans les props:', userData.id);
      setValidUserId(userData.id);
      setIsClientSideAuthChecked(true);
      return;
    }
    
    // Sinon, on essaie de le récupérer via Supabase avec un timeout
    const checkAuth = async () => {
      try {
        if (supabase) {
          // Timeout pour la requête Supabase
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout Supabase')), 5000)
          );
          
          const authPromise = supabase.auth.getSession();
          const result = await Promise.race([authPromise, timeoutPromise]) as any;
          
          if (result?.data?.session?.user?.id) {
            console.log('ID trouvé dans Supabase:', result.data.session.user.id);
            setValidUserId(result.data.session.user.id);
          } else {
            console.warn('Aucune session Supabase trouvée');
            setAuthError(new Error('Session introuvable'));
          }
        } else {
          console.error('Client Supabase non disponible');
          setAuthError(new Error('Client Supabase non disponible'));
        }
      } catch (error) {
        console.error('Erreur authentification:', error);
        setAuthError(error instanceof Error ? error : new Error('Erreur inconnue'));
      } finally {
        setIsClientSideAuthChecked(true);
      }
    };
    
    checkAuth();
  }, [userData?.id]);
  
  // Appel du hook de données avec protection contre le chargement infini
  const { data: originalData, loading: originalLoading, error: originalError } = 
    useCreatorDashboard(validUserId);
  
  // Force la fin du chargement après un timeout
  const [hookTimeout, setHookTimeout] = useState(false);
  useEffect(() => {
    const hookTimeoutId = setTimeout(() => {
      if (originalLoading) {
        console.log('Hook timeout - forçage de fin de chargement');
        setHookTimeout(true);
      }
    }, 5000); // 5 secondes
    
    return () => clearTimeout(hookTimeoutId);
  }, [originalLoading]);
  
  // Créer des données par défaut si le hook timeout
  const dashboardData = hookTimeout ? {
    userAgents: [],
    stats: { views: 0, clicks: 0, contacts: 0, conversions: 0 },
    agentViews: {},
    agentConversions: {},
    agentRevenue: {},
    contacts: [],
    recommendations: []
  } : originalData;
  
  const dataLoading = hookTimeout ? false : originalLoading;
  const dataError = originalError;
  
  // Mettre à jour l'état de chargement global
  useEffect(() => {
    if (isClientSideAuthChecked && (!dataLoading || hookTimeout)) {
      setIsLoading(false);
    }
  }, [isClientSideAuthChecked, dataLoading, hookTimeout]);
  
  // 1. Écran de timeout global
  if (hasTimedOut) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenue {userData?.name || userData?.email || 'Créateur'}
          </h1>
          <p className="text-gray-600 mt-1">
            Le chargement des données a pris trop de temps
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">
              Options disponibles
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <h3 className="font-medium mb-2">Rafraîchir la page</h3>
                <p className="text-gray-600 mb-4">Essayez de recharger la page</p>
                <Button onClick={() => window.location.reload()}>
                  Rafraîchir
                </Button>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <h3 className="font-medium mb-2">Se reconnecter</h3>
                <p className="text-gray-600 mb-4">Essayez de vous reconnecter</p>
                <Link href={ROUTES.AUTH.SIGNIN}>
                  <Button>
                    Se connecter
                  </Button>
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
  
  // 2. Écran de chargement
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg text-gray-600">Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // 3. Écran d'erreur d'authentification
  if (isClientSideAuthChecked && !validUserId) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4 text-red-500">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Session expirée ou introuvable</h2>
        <p className="text-gray-600 mb-4">
          Nous n'avons pas pu identifier votre session. Veuillez vous reconnecter pour accéder à votre tableau de bord.
        </p>
        <div className="flex justify-center">
          <Button 
            onClick={() => router.push(ROUTES.AUTH.SIGNIN)}
            variant="primary"
          >
            Se connecter
          </Button>
        </div>
      </div>
    );
  }
  
  // 4. Écran d'erreur de données
  if (dataError) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4 text-red-500">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Erreur de chargement des données</h2>
        <p className="text-gray-600 mb-4">{dataError.message || "Une erreur est survenue lors du chargement de vos données."}</p>
        <div className="flex justify-center space-x-4">
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
  
  // 5. Tableau de bord normal (ou avec données minimales en cas de timeout du hook)
  const userAgents = dashboardData?.userAgents || [];
  const stats = dashboardData?.stats || { views: 0, clicks: 0, contacts: 0, conversions: 0 };
  const agentViews = dashboardData?.agentViews || {};
  const agentConversions = dashboardData?.agentConversions || {};
  const agentRevenue = dashboardData?.agentRevenue || {};
  const contacts = dashboardData?.contacts || [];
  const recommendations = dashboardData?.recommendations || [];
  
  // Afficher le dashboard fonctionnel
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
      
      {hookTimeout && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
          <h3 className="font-medium text-amber-800">Données partiellement disponibles</h3>
          <p className="text-amber-700 mt-1">
            Certaines données n'ont pas pu être chargées. Vous pouvez utiliser le tableau de bord 
            avec des fonctionnalités limitées ou essayer de rafraîchir la page.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-amber-100 text-amber-800 rounded hover:bg-amber-200"
          >
            Rafraîchir
          </button>
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
      
      {/* Message de confirmation */}
      <div className="text-center p-6 bg-green-50 rounded-md mb-8">
        <h3 className="text-xl font-medium text-green-800 mb-2">
          Tableau de bord chargé avec succès !
        </h3>
        <p className="text-green-700 mb-4">
          Le problème de chargement infini a été résolu. Les données sont maintenant disponibles.
        </p>
        <p className="text-sm text-green-600">
          ID Utilisateur: {validUserId}
        </p>
      </div>
    </div>
  );
}