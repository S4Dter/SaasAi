'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm, { AuthFormData } from '@/components/auth/AuthForm';
import { APP_NAME, ROUTES } from '@/constants';
import { signInWithEmail } from '@/lib/api/auth';
import { useAuthOptimized } from '@/lib/hooks/useAuthOptimized';
import { signInAction } from '@/app/actions/auth';

// Force le rendu dynamique pour garantir l'état frais à chaque requête
export const dynamic = 'force-dynamic';

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

/**
 * Page de connexion optimisée avec triple approche de redirection
 * 1. Server Action (redirect côté serveur)
 * 2. Hook d'authentification optimisé
 * 3. Fallbacks client progressifs
 */
export default function SignInPage() {
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

  /**
   * Gestion de la soumission : approche hybride
   * 1. Essaie d'abord Server Action
   * 2. Si erreur ou désactivé, fallback à l'approche client
   */
  const handleSubmit = async (data: AuthFormData) => {
    try {
      setIsLoading(true);
      setErrors({});
      
      // Tentative 1: Server Action (si activé et disponible)
      try {
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('password', data.password);
        
        const result = await signInAction(formData);
        
        // Si on arrive ici, c'est que la redirection n'a pas eu lieu
        // On passe au fallback
        if (result && !result.success) {
          throw new Error(result.error);
        }
      } catch (serverActionError: any) {
        console.log('Server Action non disponible ou erreur:', serverActionError);
        // Passer au fallback client
      }
      
      // Fallback : Authentification client
      console.log('Fallback: Authentification client');
      const { data: authData, error: authError } = await signInWithEmail(data.email, data.password);
      
      if (authError) throw authError;
      
      if (!authData?.user) {
        throw new Error("Échec d'authentification: aucun utilisateur retourné");
      }
      
      const user = authData.user;
      
      // Détermination du rôle à partir des métadonnées utilisateur
      const userRole = user.user_metadata?.role || 'enterprise';
      
      // Synchronisation des cookies et localStorage
      const sessionData = {
        id: user.id,
        email: user.email || data.email,
        role: userRole,
        timestamp: Date.now()
      };
      
      document.cookie = `user-session=${encodeURIComponent(JSON.stringify(sessionData))}; path=/; max-age=604800; SameSite=Strict`;
      
      // Stocker à la fois les champs individuels pour la compatibilité avec le code existant
      localStorage.setItem('user-id', user.id);
      localStorage.setItem('user-role', userRole);
      localStorage.setItem('user-email', user.email || data.email);
      
      // Stocker également l'objet user complet pour le redirect/page.tsx
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        email: user.email || data.email,
        role: userRole,
        timestamp: Date.now()
      }));
      
      // STRATÉGIE DE REDIRECTION PROGRESSIVE

      // 1. D'abord utiliser notre hook optimisé
      redirectToDashboard();
      
      // 2. Fallback avec router.push avec délai court
      setTimeout(() => {
        let dashboardPath;
        if (userRole === 'admin') {
          dashboardPath = ROUTES.DASHBOARD.ADMIN.ROOT;
        } else if (userRole === 'creator') {
          dashboardPath = ROUTES.DASHBOARD.CREATOR.ROOT;
        } else {
          dashboardPath = ROUTES.DASHBOARD.ENTERPRISE.ROOT;
        }
        router.push(dashboardPath);
      }, 100);
      
      // 3. Fallback ultime avec window.location.href
      setTimeout(() => {
        let dashboardPath;
        if (userRole === 'admin') {
          dashboardPath = ROUTES.DASHBOARD.ADMIN.ROOT;
        } else if (userRole === 'creator') {
          dashboardPath = ROUTES.DASHBOARD.CREATOR.ROOT;
        } else {
          dashboardPath = ROUTES.DASHBOARD.ENTERPRISE.ROOT;
        }
        window.location.href = dashboardPath;
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
