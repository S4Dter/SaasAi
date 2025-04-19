'use client';

import React from 'react';
import AuthForm, { AuthFormData } from '@/components/auth/AuthForm';
import { APP_NAME } from '@/constants';
import { signInWithEmail } from '@/lib/api/auth';

// Indique à Next.js de ne pas prérender cette page
export const dynamic = 'force-dynamic';

/**
 * Page de connexion
 */
export default function SignInPage() {
  const handleSubmit = async (data: AuthFormData) => {
    console.log('SignIn form submitted with data:', data);
    try {
      const response = await signInWithEmail(data.email, data.password);
      console.log('SignIn response:', response);
      
      if (response.data.user) {
        // Connexion réussie
        alert('Connexion réussie! Vous allez être redirigé vers votre tableau de bord.');
        
        // Dans un vrai projet, on utiliserait le router Next.js pour rediriger
        // Exemple: router.push('/dashboard');
        
        // Redirection simplifiée pour la maquette
        // La destination réelle dépendrait du type d'utilisateur (creator/enterprise)
        // window.location.href = '/dashboard';
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

        <AuthForm mode="signin" onSubmit={handleSubmit} />

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
