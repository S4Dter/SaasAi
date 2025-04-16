'use client';

import React, { useState } from 'react';
import { APP_NAME, ROUTES } from '@/constants';
import Link from 'next/link';
import Button from '@/components/ui/Button';

/**
 * Page de récupération de mot de passe
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Intégrer l'API pour la demande de réinitialisation du mot de passe
    console.log('Forgot password request for email:', email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
            {APP_NAME}
          </h1>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
            <div className="text-center">
              <svg 
                className="mx-auto h-12 w-12 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
              
              <h2 className="mt-2 text-xl font-semibold text-gray-900">
                Email envoyé
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Si un compte existe avec l&apos;adresse {email}, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
              </p>
              <div className="mt-6">
                <Link href={ROUTES.AUTH.SIGNIN} className="text-blue-600 hover:underline">
                  Retour à la connexion
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          {APP_NAME}
        </h1>
        
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Récupération de mot de passe
          </h2>
          
          <p className="mb-6 text-sm text-gray-600">
            Entrez l&apos;adresse email associée à votre compte et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="votre@email.com"
                required
              />
            </div>
            
            <div>
              <Button type="submit" fullWidth>
                Envoyer les instructions
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous vous souvenez de votre mot de passe ?{' '}
              <Link
                href={ROUTES.AUTH.SIGNIN}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
