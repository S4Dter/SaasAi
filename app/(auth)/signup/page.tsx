'use client';

import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { APP_NAME } from '@/constants';
import { signUpWithEmail } from '@/lib/api/auth';

/**
 * Page d'inscription
 */
export default function SignUpPage() {
  const handleSubmit = async (data: { email: string; password: string }) => {
    console.log('SignUp form submitted with data:', data);
    try {
      const response = await signUpWithEmail(data.email, data.password);
      console.log('SignUp response:', response);
      // À compléter : gestion de la redirection sur succès, affichage d'erreur, etc.
    } catch (error) {
      console.error('SignUp error:', error);
      // À compléter : gestion des erreurs
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          {APP_NAME}
        </h1>
        
        <AuthForm 
          mode="signup" 
          onSubmit={handleSubmit} 
        />
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Note: Cette page est une maquette. Dans une application réelle, l&apos;authentification
            serait connectée à un backend sécurisé.
          </p>
        </div>
      </div>
    </div>
  );
}
