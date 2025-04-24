'use client';

import React, { useState } from 'react';
import AuthForm, { AuthFormData } from '@/components/auth/AuthForm';
import { APP_NAME, ROUTES } from '@/constants';
import { signInWithEmail } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';

// Indique à Next.js de ne pas prérender cette page
export const dynamic = 'force-dynamic';

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

/**
 * Page de connexion
 */
export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const handleSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await signInWithEmail(data.email, data.password);
      console.log('response:', response);
      
      if (response.data.user) {
        // Récupérer l'utilisateur
        const user = response.data.user;
        console.log('user:', user);
        
        if (user) {
          // Créer un cookie de session pour le middleware
          document.cookie = `user-session=${encodeURIComponent(JSON.stringify({
            id: user.id,
            email: data.email
          }))}; path=/; max-age=86400`;
          
          // Chercher le rôle dans la base de données
          const supabaseClient = supabase || createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          );
          
          const { data: userData, error } = await supabaseClient
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Erreur lors de la récupération du rôle:', error);
            
            // Essayer de récupérer le rôle depuis les métadonnées de l'utilisateur
            const userMetadataRole = user.user_metadata?.role;
            console.log('Métadonnées utilisateur après connexion:', user.user_metadata);
            
            if (userMetadataRole === 'creator') {
              console.log('Redirection vers tableau de bord créateur (depuis métadonnées)');
              console.log('Redirecting to:', ROUTES.DASHBOARD.CREATOR.ROOT);
              if (window.location.pathname !== ROUTES.DASHBOARD.CREATOR.ROOT) {
                router.push(ROUTES.DASHBOARD.CREATOR.ROOT);
              }
            } else {
              console.log('Redirection vers tableau de bord entreprise (défaut)');
              console.log('Redirecting to:', ROUTES.DASHBOARD.ENTERPRISE.ROOT);
              if (window.location.pathname !== ROUTES.DASHBOARD.ENTERPRISE.ROOT) {
                router.push(ROUTES.DASHBOARD.ENTERPRISE.ROOT);
              }
            }
            return;
          }
          
          // Redirection basée sur le rôle
          if (userData?.role === 'creator') {
            console.log('Redirection vers tableau de bord créateur (depuis BD)');
            console.log('Redirecting to:', ROUTES.DASHBOARD.CREATOR.ROOT);
            if (window.location.pathname !== ROUTES.DASHBOARD.CREATOR.ROOT) {
              router.push(ROUTES.DASHBOARD.CREATOR.ROOT);
            }
          } else {
            console.log('Redirection vers tableau de bord entreprise (depuis BD)');
            console.log('Redirecting to:', ROUTES.DASHBOARD.ENTERPRISE.ROOT);
            if (window.location.pathname !== ROUTES.DASHBOARD.ENTERPRISE.ROOT) {
              router.push(ROUTES.DASHBOARD.ENTERPRISE.ROOT);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('SignIn error:', error);
      
      // Gestion des erreurs spécifiques
      if (error.message?.includes('Invalid login credentials')) {
        // Selon le message d'erreur, déterminer si c'est l'email ou le mot de passe
        if (error.message.includes('User not found') || error.message.includes('Email not found')) {
          setErrors({
            email: "Aucun compte n'est associé à cette adresse email"
          });
        } else {
          setErrors({
            password: "Mot de passe incorrect"
          });
        }
      } else {
        setErrors({
          general: error.message || 'Une erreur est survenue lors de la connexion'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          {APP_NAME}
        </h1>

        <AuthForm 
          mode="signin" 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
          errors={errors}
        />
      </div>
    </div>
  );
}
