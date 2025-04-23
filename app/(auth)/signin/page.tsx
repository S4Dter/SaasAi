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
      
      if (response.data.user) {
        // Récupérer l'utilisateur
        const user = response.data.user;
        
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
            router.push('/'); // Redirection par défaut en cas d'erreur
            return;
          }
          
          // Redirection basée sur le rôle
          if (userData?.role === 'creator') {
            router.push(ROUTES.DASHBOARD.CREATOR.ROOT);
          } else {
            router.push(ROUTES.DASHBOARD.ENTERPRISE.ROOT);
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

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Note : cette page est une maquette. Dans une application réelle,
            l'authentification serait connectée à un backend sécurisé.
          </p>
        </div>
      </div>
    </div>
  );
}
