'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm, { AuthFormData } from '@/components/auth/AuthForm';
import { APP_NAME, ROUTES } from '@/constants';
import { signInWithEmail } from '@/lib/api/auth';
import { useAuthOptimized } from '@/solutions/useAuth-optimisé';

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

/**
 * Page de connexion optimisée avec redirection robuste
 * Combines les 3 approches :
 * 1. Utilisation de useEffect pour vérifier l'état d'authentification
 * 2. Mécanisme de redirection après connexion réussie
 * 3. Synchronisation des cookies et localStorage
 */
export default function SignInOptimisedPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Utilisation du hook d'authentification optimisé
  const { data: user, loading: authLoading, redirectToDashboard } = useAuthOptimized();

  // Si l'utilisateur est déjà connecté, rediriger vers le tableau de bord
  useEffect(() => {
    if (user && !authLoading) {
      redirectToDashboard();
    }
  }, [user, authLoading, redirectToDashboard]);

  const handleSubmit = async (data: AuthFormData) => {
    try {
      setIsLoading(true);
      setErrors({});
      
      // Connexion à Supabase via l'API auth
      const { data: authData, error: authError } = await signInWithEmail(data.email, data.password);
      
      if (authError) throw authError;
      
      if (!authData?.user) {
        throw new Error("Échec d'authentification: aucun utilisateur retourné");
      }
      
      const user = authData.user;
      
      // Stockage des informations de session dans les cookies et localStorage
      // pour que le middleware puisse détecter l'authentification
      const userRole = user.user_metadata?.role || 'enterprise';
      const sessionData = {
        id: user.id,
        email: user.email || data.email,
        role: userRole,
        timestamp: Date.now()
      };
      
      // Configuration d'un cookie accessible côté client pour le middleware
      document.cookie = `user-session=${encodeURIComponent(JSON.stringify(sessionData))}; path=/; max-age=604800; SameSite=Strict`;
      
      // Stockage des informations dans localStorage
      localStorage.setItem('user-id', user.id);
      localStorage.setItem('user-role', userRole);
      localStorage.setItem('user-email', user.email || data.email);
      localStorage.setItem('user-name', user.user_metadata?.name || data.email);
      
      // TRIPLE APPROCHE DE REDIRECTION
      
      // 1. Utiliser la fonction du hook d'authentification
      redirectToDashboard();
      
      // 2. FALLBACK: Redirection router avec un délai pour s'assurer que
      // les cookies ont eu le temps d'être pris en compte par le middleware
      setTimeout(() => {
        if (userRole === 'creator') {
          router.push(ROUTES.DASHBOARD.CREATOR.ROOT);
        } else {
          router.push(ROUTES.DASHBOARD.ENTERPRISE.ROOT);
        }
      }, 100);
      
      // 3. FALLBACK ULTIME: Forcer une redirection avec window.location
      // si les 2 premières approches échouent
      setTimeout(() => {
        if (userRole === 'creator') {
          window.location.href = ROUTES.DASHBOARD.CREATOR.ROOT;
        } else {
          window.location.href = ROUTES.DASHBOARD.ENTERPRISE.ROOT;
        }
      }, 300);
      
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      
      if (error.message?.includes('Invalid login credentials')) {
        setErrors({
          password: "Email ou mot de passe incorrect"
        });
      } else if (error.message?.includes('not found')) {
        setErrors({
          email: "Aucun compte n'est associé à cette adresse email"
        });
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
          isLoading={isLoading || authLoading} 
          errors={errors}
        />
      </div>
    </div>
  );
}
