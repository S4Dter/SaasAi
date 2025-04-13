import React from 'react';
import Link from 'next/link';
import { APP_NAME } from '@/constants';

/**
 * Layout pour les pages d'authentification
 * Ce layout n'inclut pas le header et le footer standard
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-6">
        <div className="flex justify-center">
          <Link href="/" className="text-blue-600 text-2xl font-bold">
            {APP_NAME}
          </Link>
        </div>
      </div>
      
      {children}
    </div>
  );
}
