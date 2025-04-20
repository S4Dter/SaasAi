'use client';

import React, { useState } from 'react';
import AuthForm, { AuthFormData } from '@/components/auth/AuthForm';
import { APP_NAME, ROUTES } from '@/constants';
import { signUpWithEmail } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

// Indique à Next.js de ne pas prérender cette page
export const dynamic = 'force-dynamic';

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

/**
 * Page d'inscription
 */
export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (data: { email: string; password: string; userType?: string }) => {
    setIsLoading(true);
    setErrors({});
    
    if (!data.userType) {
      setErrors({
        general: "Veuillez sélectionner votre type d'utilisateur"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // La fonction signUpWithEmail est modifiée pour inclure les métadonnées utilisateur
      const response = await signUpWithEmail(
        data.email, 
        data.password, 
        {
          role: data.userType, // Stocker le rôle dans user_metadata
        }
      );
      
      if (response.data.user) {
        // Si l'inscription nécessite une confirmation par email
        if (response.data.user.identities?.length === 0) {
          setErrors({
            general: 'Un email de confirmation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception.'
          });
        } else {
          // Créer un cookie de session (pour middleware)
          document.cookie = `user-session=${encodeURIComponent(JSON.stringify({
            id: response.data.user.id,
            email: data.email,
            role: data.userType
          }))}; path=/; max-age=86400`;
          
          // Rediriger vers la page appropriée en fonction du type d'utilisateur
          if (data.userType === 'enterprise') {
            router.push(ROUTES.DASHBOARD.ENTERPRISE.ROOT);
          } else {
            // Redirection par défaut vers le dashboard créateur
            router.push(ROUTES.DASHBOARD.CREATOR.ROOT);
          }
        }
      }
    } catch (error: any) {
      console.error('SignUp error:', error);
      // Vérifier si l'erreur indique qu'un utilisateur avec cet email existe déjà
      if (error.message?.includes('User already registered')) {
        setErrors({
          email: "Un compte existe déjà avec cette adresse email."
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          {APP_NAME}
        </h1>
        
        <AuthForm 
          mode="signup" 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          errors={errors}
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
