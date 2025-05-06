'use client';
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
  
  // Ajout du test Supabase
  const [supabaseTestStatus, setSupabaseTestStatus] = useState<string | null>(null);
  const [supabaseTestDetail, setSupabaseTestDetail] = useState<string | null>(null);
  
  // Test Supabase au chargement du composant
  useEffect(() => {
    const testSupabase = async () => {
      try {
        console.log('Test de connexion Supabase...');
        
        if (!supabase) {
          setSupabaseTestStatus('Erreur critique');
          setSupabaseTestDetail('Client Supabase non initialisé');
          return;
        }
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setSupabaseTestStatus('Erreur Supabase');
          setSupabaseTestDetail(error.message);
        } else if (data?.session) {
          setSupabaseTestStatus('Connexion OK');
          setSupabaseTestDetail(`Utilisateur: ${data.session.user.id}`);
        } else {
          setSupabaseTestStatus('Pas de session');
          setSupabaseTestDetail('Aucune session trouvée');
        }
      } catch (e: any) {
        setSupabaseTestStatus('Erreur critique');
        setSupabaseTestDetail(e.message || 'Erreur inconnue');
      }
    };
    
    testSupabase();
  }, []);
  
  // Reste du code original du composant...
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isClientSideAuthChecked, setIsClientSideAuthChecked] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [validUserId, setValidUserId] = useState<string | undefined>(userData?.id || undefined);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  
  // Si le test Supabase est terminé avec une erreur, afficher les résultats du test
  if (supabaseTestStatus && supabaseTestStatus !== 'Connexion OK') {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold mb-4">Problème détecté avec Supabase</h1>
        <div className="p-4 bg-red-50 border border-red-200 rounded mb-4">
          <p><strong>Statut:</strong> {supabaseTestStatus}</p>
          <p><strong>Détail:</strong> {supabaseTestDetail}</p>
        </div>
        <div className="mt-4">
          <p className="mb-4">Ce problème empêche le chargement normal du tableau de bord.</p>
          <Button onClick={() => window.location.reload()}>
            Rafraîchir la page
          </Button>
        </div>
      </div>
    );
  }
  
  // Ajouter un timeout global forcé
  useEffect(() => {
    const globalTimeoutId = setTimeout(() => {
      console.log('TIMEOUT GLOBAL FORCÉ: Arrêt du chargement infini');
      setIsLoading(false);
      setHasTimedOut(true);
    }, 10000); // 10 secondes maximum
    
    return () => clearTimeout(globalTimeoutId);
  }, []);
  
  // Continuer avec le reste du code existant...
  // ...

  // Afficher un écran de timeout si le timeout global est atteint
  if (hasTimedOut) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenue {userData?.name || userData?.email || 'Créateur'} dans votre espace
          </h1>
          <p className="text-gray-600 mt-1">
            Le chargement des données a pris trop de temps
          </p>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg mb-6">
          <h3 className="text-amber-800 font-medium">Diagnostic Supabase</h3>
          <p className="mt-1">
            {supabaseTestStatus === 'Connexion OK' 
              ? "La connexion à Supabase fonctionne, mais le chargement des données a échoué."
              : "Problème de connexion à Supabase détecté."}
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

  // Gardez le reste de votre code...
  // ...
}
