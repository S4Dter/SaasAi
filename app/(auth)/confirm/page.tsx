'use client';

import React from 'react';
import Link from 'next/link';
import { APP_NAME, ROUTES } from '@/constants';
import Button from '@/components/ui/Button';

export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          {APP_NAME}
        </h1>
        
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            {/* Icône de confirmation */}
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900">
              Votre adresse email a bien été confirmée
            </h2>
            
            <p className="text-gray-600">
              Vous pouvez maintenant vous connecter à votre compte.
            </p>
            
            <div className="pt-4">
              <Link href={ROUTES.AUTH.SIGNIN}>
                <Button variant="primary" size="lg">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
