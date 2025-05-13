'use client';

import React from 'react';
import Button from '../ui/Button';
import Link from 'next/link';
import { ROUTES } from '@/constants';

export type AuthFormData = {
  email: string;
  password: string;
  userType?: string;
};

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSubmit: (data: AuthFormData) => void;
  isLoading?: boolean;
  errors?: {
    email?: string;
    password?: string;
    general?: string;
  };
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, isLoading = false, errors = {} }) => {
  const isSignIn = mode === 'signin';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data: AuthFormData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    // Ajout du type d'utilisateur pour l'inscription
    if (mode === 'signup') {
      data.userType = formData.get('userType') as string;
    }

    onSubmit(data);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        {isSignIn ? 'Connexion' : 'Créer un compte'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isSignIn && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
              Nom
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre nom"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="votre@email.com"
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder={isSignIn ? 'Votre mot de passe' : 'Créez un mot de passe'}
            required
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {!isSignIn && (
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-black mb-1">
              Je suis
            </label>
            <select
              id="userType"
              name="userType"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Sélectionnez votre profil</option>
              <option value="enterprise">Une entreprise cherchant des agents IA</option>
              <option value="creator">Un créateur d&apos;agents IA</option>
            </select>
          </div>
        )}

        {isSignIn && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-black">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Mot de passe oublié ?
              </a>
            </div>
          </div>
        )}

        {errors.general && (
          <div className="text-center text-red-600 text-sm">
            {errors.general}
          </div>
        )}

        <div>
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading 
              ? 'Chargement...' 
              : (isSignIn ? 'Se connecter' : 'Créer un compte')
            }
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-black">
          {isSignIn ? "Vous n&apos;avez pas de compte ?" : 'Vous avez déjà un compte ?'}{' '}
          <Link
            href={isSignIn ? ROUTES.AUTH.SIGNUP : ROUTES.AUTH.SIGNIN}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            {isSignIn ? "S&apos;inscrire" : 'Se connecter'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
