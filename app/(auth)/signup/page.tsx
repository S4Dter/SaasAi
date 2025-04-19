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
      
      if (response.data.user) {
        // Si l'inscription nécessite une confirmation par email
        if (response.data.user.identities?.length === 0) {
          alert('Un email de confirmation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception.');
        } else {
          // Sinon, redirection vers la page d'accueil du dashboard
          // Dans un vrai projet, utiliser un router pour rediriger
          alert('Inscription réussie! Vous allez être redirigé vers votre tableau de bord.');
          // window.location.href = '/dashboard';
        }
      }
    } catch (error: any) {
      console.error('SignUp error:', error);
      alert(`Erreur lors de l'inscription: ${error?.message || 'Veuillez réessayer'}`);
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
