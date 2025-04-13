import React from 'react';
import { Metadata } from 'next';
import AuthForm from '@/components/auth/AuthForm';
import { APP_NAME } from '@/constants';

export const metadata: Metadata = {
  title: `Inscription | ${APP_NAME}`,
  description: 'Créez votre compte sur AgentMarket et découvrez les agents IA ou partagez vos créations',
};

/**
 * Page d'inscription
 */
export default function SignUpPage() {
  // Cette fonction serait connectée à une API d'authentification dans une application réelle
  const handleSubmit = (data: { email: string; password: string }) => {
    console.log('SignUp form submitted with data:', data);
    // Dans une vraie application, nous aurions un appel API ici
    // puis une redirection vers le dashboard approprié
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
