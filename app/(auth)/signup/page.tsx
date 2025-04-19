'use client';

import React, { useState } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { APP_NAME, ROUTES } from '@/constants';
import { signUpWithEmail } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

// Indique à Next.js de ne pas prérender cette page
export const dynamic = 'force-dynamic';

/**
 * Page d'inscription
 */
export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: { email: string; password: string; userType?: string }) => {
    console.log('SignUp form submitted with data:', data);
    setIsLoading(true);
    try {
      const response = await signUpWithEmail(data.email, data.password);
      console.log('SignUp response:', response);
      
      if (response.data.user) {
        // Si l'inscription nécessite une confirmation par email
        if (response.data.user.identities?.length === 0) {
          alert('Un email de confirmation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception.');
        } else {
          // Enregistrer le type d'utilisateur dans localStorage pour accès restreint
          // Dans une vraie application, cette information serait stockée dans la base de données
          const userRole = data.userType || 'creator'; // Par défaut, considérer comme créateur
          localStorage.setItem('user-role', userRole);
          
          // Créer un cookie de session (simulation pour middleware)
          document.cookie = `user-session=${encodeURIComponent(JSON.stringify({
            id: response.data.user.id,
            email: data.email,
            role: userRole
          }))}; path=/; max-age=86400`;
          
          // Rediriger vers la page appropriée en fonction du type d'utilisateur
          if (userRole === 'enterprise') {
            router.push(ROUTES.DASHBOARD.ENTERPRISE.ROOT);
          } else {
            // Redirection par défaut vers le dashboard créateur
            router.push(ROUTES.DASHBOARD.CREATOR.ROOT);
          }
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
          isLoading={isLoading}
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
