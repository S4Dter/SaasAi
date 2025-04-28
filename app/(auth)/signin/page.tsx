'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm, { AuthFormData } from '@/components/auth/AuthForm';
import { APP_NAME, ROUTES } from '@/constants';
import { signInWithEmail } from '@/lib/api/auth';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

/**
 * Page de connexion optimisée pour éviter les boucles de redirection
 */
export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (data: AuthFormData) => {
    try {
      setIsLoading(true);
      setErrors({});
      
      // Authentification avec email et mot de passe
      console.log('Tentative de connexion avec:', data.email);
      const { data: authData, error: authError } = await signInWithEmail(data.email, data.password);
      
      if (authError) throw authError;
      
      if (!authData?.user) {
        throw new Error("Échec d'authentification: aucun utilisateur retourné");
      }
      
      const user = authData.user;
      console.log('Utilisateur authentifié:', user.id);
      
      // Récupération du rôle depuis la base de données
      const { data: userData, error: userError } = await supabase!
        .from('users')
        .select('role, name')
        .eq('id', user.id)
        .single();
      
      // Détermination du rôle
      const userRole = !userError ? 
        userData?.role : 
        (user.user_metadata?.role || 'enterprise');
      
      const userName = !userError ? 
        (userData?.name || user.user_metadata?.name || data.email) :
        (user.user_metadata?.name || data.email);
      
      console.log('Rôle utilisateur:', userRole);
      
      // IMPORTANT: Inclure le rôle dans le cookie de session pour le middleware
      const sessionData = {
        id: user.id,
        email: user.email || data.email,
        role: userRole,
        timestamp: Date.now()
      };
      
      // Cookie avec le rôle pour que le middleware puisse faire les redirections appropriées
      document.cookie = `user-session=${encodeURIComponent(JSON.stringify(sessionData))}; path=/; max-age=604800; SameSite=Strict`;
      
      // Stockage localStorage pour l'application
      localStorage.setItem('user-id', user.id);
      localStorage.setItem('user-role', userRole);
      localStorage.setItem('user-email', user.email || data.email);
      localStorage.setItem('user-name', userName);
      
      // Redirection - forcer la redirection immédiatement plutôt que de se fier au middleware
      // pour résoudre le problème de redirection
      console.log('Redirection vers le tableau de bord...');
      
      // Utiliser une approche plus directe pour la redirection
      const redirectTo = userRole === 'creator' ? 
        ROUTES.DASHBOARD.CREATOR.ROOT : 
        ROUTES.DASHBOARD.ENTERPRISE.ROOT;
      
      // Ajouter un léger délai pour permettre aux cookies d'être définis
      setTimeout(() => {
        router.push(redirectTo);
      }, 500);
      
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
          isLoading={isLoading} 
          errors={errors}
        />
      </div>
    </div>
  );
}
