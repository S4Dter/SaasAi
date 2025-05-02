'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthForm, { AuthFormData } from '@/components/auth/AuthForm';
import { APP_NAME, ROUTES } from '@/constants';
import Button from '@/components/ui/Button';
import { signUpWithEmail } from '@/lib/api/auth';
import { validateSignUp } from '@/lib/validators/auth';
import { toast } from 'react-hot-toast';

// Indique à Next.js de ne pas prérender cette page
export const dynamic = 'force-dynamic';

type FormErrors = {
  email?: string;
  password?: string;
  name?: string;
  userType?: string;
  general?: string;
};

/**
 * Composant pour afficher le message de confirmation d'inscription
 */
function SignupConfirmationMessage({ email, onResendEmail }: { email: string, onResendEmail?: () => void }) {
  const [isSending, setIsSending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleResendEmail = async () => {
    if (!onResendEmail) return;

    setIsSending(true);
    setResendMessage('');

    try {
      await onResendEmail();
      setResendMessage('Email de confirmation renvoyé avec succès.');
    } catch (error) {
      setResendMessage("Erreur lors du renvoi de l'email. Veuillez réessayer.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          Vérifiez votre boîte de réception
        </h2>

        <p className="text-gray-600">
          Un email de confirmation vous a été envoyé à <span className="font-semibold">{email}</span>. 
          Veuillez cliquer sur le lien pour activer votre compte.
        </p>

        {onResendEmail && (
          <div className="pt-2">
            <button 
              onClick={handleResendEmail}
              disabled={isSending}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {isSending ? 'Envoi en cours...' : "Renvoyer l'email de confirmation"}
            </button>

            {resendMessage && (
              <p className="mt-2 text-sm text-green-600">{resendMessage}</p>
            )}
          </div>
        )}

        <div className="pt-4">
          <Link href={ROUTES.AUTH.SIGNIN}>
            <Button variant="outline" size="md">
              Aller à la page de connexion
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Page d'inscription
 */
export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const handleSubmit = async (data: { email: string; password: string; name?: string; userType?: string }) => {
    setIsLoading(true);
    setErrors({});

    // Valider les données avec Zod
    const validation = validateSignUp(data);
    
    if (!validation.success || !validation.data) {
      setErrors(validation.errors || {});
      setIsLoading(false);
      return;
    }
    
    // Les données validées (avec transformation automatique, ex: name=Anonymous si vide)
    const validatedData = validation.data;

    try {
      // Utilisons les données validées par Zod qui contient le name par défaut si non fourni
      const response = await signUpWithEmail(
        validatedData.email, 
        validatedData.password, 
        { 
          role: validatedData.userType,
          name: validatedData.name, // Nom validé (sera "Anonymous" si vide)
        },
      );

      if (response.data?.user) {
        toast.success("Votre compte a été créé avec succès");
        setRegisteredEmail(validatedData.email);
      }
    } catch (error: any) {
      console.error('SignUp error:', error);
      
      // Afficher l'erreur avec toast
      toast.error(error.message || "Une erreur est survenue lors de l'inscription");
      
      if (error.message?.includes('User already registered')) {
        setErrors({
          email: "Un compte existe déjà avec cette adresse email."
        });
      } else if (error.message?.includes('null value in column "name"')) {
        // Cas spécifique de l'erreur de contrainte NOT NULL
        setErrors({
          name: "Le nom est obligatoire"
        });
      } else {
        setErrors({
          general: error.message || "Une erreur est survenue lors de l'inscription"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmationEmail = async () => {
    if (!registeredEmail) return;
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          {APP_NAME}
        </h1>

        {registeredEmail ? (
          <SignupConfirmationMessage 
            email={registeredEmail} 
            onResendEmail={handleResendConfirmationEmail} 
          />
        ) : (
          <AuthForm 
            mode="signup" 
            onSubmit={handleSubmit}
            isLoading={isLoading}
            errors={errors}
          />
        )}

        {!registeredEmail && (
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Note: Cette page est une maquette. Dans une application réelle, l&apos;authentification
              serait connectée à un backend sécurisé.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
