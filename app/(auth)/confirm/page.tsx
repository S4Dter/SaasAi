'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { APP_NAME, ROUTES } from '@/constants';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';

export default function ConfirmPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        setIsLoading(true);

        // Vérifie que supabase est disponible, sinon crée un client temporaire
        let client = supabase;
        if (!client) {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          
          if (!supabaseUrl || !supabaseKey) {
            throw new Error('Variables d\'environnement Supabase manquantes');
          }
          
          client = createClient(supabaseUrl, supabaseKey);
        }
        
        // Vérifie si l'utilisateur est connecté
        const { data: { session }, error: sessionError } = await client.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        // Si l'utilisateur n'est pas connecté, on ne fait pas de redirection automatique
        if (!session) {
          setIsLoading(false);
          return;
        }

        // Récupère les informations de l'utilisateur
        const { data: { user }, error: userError } = await client.auth.getUser();
        
        if (userError || !user) {
          throw userError || new Error("Impossible de récupérer les informations de l'utilisateur");
        }

        // Vérifie si l'utilisateur existe déjà dans la table users
        let { data: userData, error: userDataError } = await client
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        // Si l'utilisateur n'existe pas dans la table users, on l'insère
        if (userDataError && userDataError.code === 'PGRST116') { // PGRST116 est le code pour "No rows found"
          // Récupération du rôle depuis les métadonnées
          // S'assurer que le rôle est correctement préservé
          const role = user.user_metadata?.role || 'enterprise';
          console.log('Métadonnées utilisateur:', user.user_metadata);
          console.log('Rôle détecté:', role);
          
          try {
            // Préparation des données pour l'insertion en respectant la structure exacte
            // définie dans la base de données Supabase
            const userData = {
              id: user.id,
              email: user.email,
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'Utilisateur',
              role: role,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              avatar: user.user_metadata?.avatar_url || null,
              bio: user.user_metadata?.bio || null,
              company: user.user_metadata?.company || null
            };
            
            console.log('Tentative d\'insertion avec les données:', userData);
            
            // Utilisation de upsert pour éviter les erreurs de duplication
            // et permettre l'insertion même si des contraintes RLS sont strictes
            const { data, error: insertError } = await client
              .from('users')
              .upsert(userData, { 
                onConflict: 'id',
                ignoreDuplicates: false
              });
            
            // Récupérer l'utilisateur inséré pour confirmation
            const { data: insertedData } = await client
              .from('users')
              .select('*')
              .eq('id', user.id)
              .single();

            if (insertError) {
              console.error("Erreur lors de l'insertion de l'utilisateur:", insertError);
              console.error("Code d'erreur:", insertError.code);
              console.error("Détails:", insertError.details);
              console.error("Message:", insertError.message);
              console.error("Hint:", insertError.hint);
              setError(`Erreur lors de l'enregistrement: ${insertError.message}`);
            } else {
              console.log('Insertion réussie, données retournées:', data);
              // Ne pas réassigner userData, seulement utiliser la valeur
            }
          } catch (error: any) {
            console.error('Exception lors de l\'insertion:', error);
            setError(`Exception: ${error.message || 'Erreur inconnue lors de l\'enregistrement'}`);
          }
        } else if (userDataError) {
          throw userDataError;
        }

        // Ne pas rediriger automatiquement - l'utilisateur doit cliquer sur le bouton "Se connecter"
      } catch (err: any) {
        console.error('Erreur lors de la vérification de l\'authentification:', err);
        setError(err.message || 'Une erreur est survenue lors de la vérification');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          {APP_NAME}
        </h1>
        
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            {isLoading ? (
              <>
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Vérification en cours...
                </h2>
              </>
            ) : error ? (
              <>
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-red-100 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Une erreur est survenue
                </h2>
                <p className="text-gray-600">
                  {error}
                </p>
                <div className="pt-4">
                  <Link href={ROUTES.AUTH.SIGNIN}>
                    <Button variant="primary" size="lg">
                      Se connecter
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900">
                  Votre adresse email a bien été confirmée
                </h2>
                
                <p className="text-gray-600">
                  Vous pouvez maintenant vous connecter.
                </p>
                
                <div className="pt-4">
                  <Link href={ROUTES.AUTH.SIGNIN}>
                    <Button variant="primary" size="lg">
                      Se connecter
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
