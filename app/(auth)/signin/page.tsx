'use client';

import React, { useState } from 'react';
import AuthForm, { AuthFormData } from '@/components/auth/AuthForm';
import { APP_NAME, ROUTES } from '@/constants';
import { signInWithEmail } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

// Indique à Next.js de ne pas prérender cette page
export const dynamic = 'force-dynamic';

/**
 * Page de connexion
 */
export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    console.log('SignIn form submitted with data:', data);
    try {
      const response = await signInWithEmail(data.email, data.password);
      console.log('SignIn response:', response);
      
      if (response.data.user) {
        // Connexion réussie
        
        // Dans une vraie application, on récupérerait le rôle depuis la base de données
        // Pour la démo, on vérifie d'abord si on a un rôle stocké localement
        const userRole = localStorage.getItem('user-role') || 'creator'; // Par défaut creator
        
        // Stocker l'email pour personnalisation
        localStorage.setItem('user-email', data.email);
        
        // Créer un cookie de session (simulation pour middleware)
        document.cookie = `user-session=${encodeURIComponent(JSON.stringify({
          id: response.data.user.id,
          email: data.email,
          role: userRole
        }))}; path=/; max-age=86400`;
        
        // Redirection vers le tableau de bord approprié
        if (userRole === 'enterprise') {
          router.push(ROUTES.DASHBOARD.ENTERPRISE.ROOT);
        } else {
          router.push(ROUTES.DASHBOARD.CREATOR.ROOT);
        }
      }
    } catch (error: any) {
      console.error('SignIn error:', error);
      alert(`Erreur de connexion: ${error?.message || 'Identifiants incorrects. Veuillez réessayer.'}`);
    }
  };  

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          {APP_NAME}
        </h1>

        <AuthForm mode="signin" onSubmit={handleSubmit} isLoading={isLoading} />

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Note : cette page est une maquette. Dans une application réelle,
            l’authentification serait connectée à un backend sécurisé.
          </p>
        </div>
      </div>
    </div>
  );
}
