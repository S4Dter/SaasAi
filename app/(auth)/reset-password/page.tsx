'use client';

import React, { useState } from 'react';
import { APP_NAME, ROUTES } from '@/constants';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useSearchParams, useRouter } from 'next/navigation';

/**
 * Page de réinitialisation de mot de passe
 */
export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Vérification de la présence du token
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
            {APP_NAME}
          </h1>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
            <div className="text-center">
              <svg 
                className="mx-auto h-12 w-12 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
              
              <h2 className="mt-2 text-xl font-semibold text-gray-900">
                Lien invalide
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Le lien de réinitialisation du mot de passe est invalide ou a expiré.
              </p>
              <div className="mt-6">
                <Link href={ROUTES.AUTH.FORGOT_PASSWORD} className="text-blue-600 hover:underline">
                  Demander un nouveau lien
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    // Validation du formulaire
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    // TODO: Intégrer l'API pour la réinitialisation du mot de passe
    console.log('Reset password with token and new password:', { token, password });
    setSuccess(true);
    
    // Rediriger vers la page de connexion après 3 secondes
    setTimeout(() => {
      router.push(ROUTES.AUTH.SIGNIN);
    }, 3000);
  };

  if (success) {
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
                Mot de passe réinitialisé
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion.
              </p>
              <div className="mt-6">
                <Link href={ROUTES.AUTH.SIGNIN} className="text-blue-600 hover:underline">
                  Aller à la connexion
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
            Réinitialisation du mot de passe
          </h2>
          
          <p className="mb-6 text-sm text-gray-600">
            Veuillez créer un nouveau mot de passe pour votre compte.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Minimum 8 caractères"
                required
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirmez votre mot de passe"
                required
              />
            </div>
            
            <div>
              <Button type="submit" fullWidth>
                Réinitialiser le mot de passe
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
