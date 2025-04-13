'use client';

import React from 'react';
import AuthForm, { AuthFormData } from '@/components/auth/AuthForm';
import { APP_NAME } from '@/constants';

/**
 * Page de connexion
 */
export default function SignInPage() {
  const handleSubmit = (data: AuthFormData) => {
    console.log('SignIn form submitted with data:', data);
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
