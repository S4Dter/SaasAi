import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Articles sur les agents IA et l\'innovation',
  description: 'Découvrez nos articles sur les agents IA, les tendances du marché et les meilleures pratiques pour les entreprises et créateurs.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Bannière du blog */}
      <div className="bg-blue-50 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center text-blue-600">Blog</h1>
          <p className="text-center text-gray-600 mt-2 max-w-2xl mx-auto">
            Découvrez nos articles sur les agents IA, les innovations et les meilleures pratiques
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <main>{children}</main>
    </div>
  );
}
