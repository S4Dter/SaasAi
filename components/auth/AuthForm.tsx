import React from 'react';
import Button from '../ui/Button';
import Link from 'next/link';
import { ROUTES } from '../../constants';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSubmit: (data: any) => void;
}

/**
 * Composant de formulaire d'authentification réutilisable
 * 
 * @param {AuthFormProps} props - Propriétés du composant
 */
const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit }) => {
  const isSignIn = mode === 'signin';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pour le prototype, nous simulons simplement une soumission de formulaire
    // Dans une application réelle, nous récupérerions les données du formulaire ici
    onSubmit({ email: 'user@example.com', password: 'password' });
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        {isSignIn ? 'Connexion' : 'Créer un compte'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {!isSignIn && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre nom"
              required
            />
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="votre@email.com"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder={isSignIn ? "Votre mot de passe" : "Créez un mot de passe"}
            required
          />
        </div>
        
        {!isSignIn && (
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
              Je suis
            </label>
            <select
              id="userType"
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
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
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
        
        <div>
          <Button type="submit" fullWidth>
            {isSignIn ? 'Se connecter' : 'Créer un compte'}
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {isSignIn ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
          {' '}
          <Link 
            href={isSignIn ? ROUTES.AUTH.SIGNUP : ROUTES.AUTH.SIGNIN}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            {isSignIn ? "S'inscrire" : "Se connecter"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
