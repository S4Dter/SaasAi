import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAgentById } from '@/mock/agents';
import AgentDetails from '@/components/agents/AgentDetails';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { ROUTES, APP_NAME } from '@/constants';

// Cette fonction sera remplacée par une génération dynamique de métadonnées
// basée sur les données de l'agent dans une application réelle
export const metadata: Metadata = {
  title: `Détail de l'agent | ${APP_NAME}`,
  description: 'Découvrez les détails et fonctionnalités de cet agent IA',
};

interface AgentDetailPageProps {
  params: {
    id: string;
  };
}

/**
 * Page de détail d'un agent IA
 * 
 * Affiche les informations détaillées d'un agent, sa description, sa vidéo et ses intégrations
 */
export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { id } = params;
  const agent = getAgentById(id);
  
  // Si l'agent n'existe pas, on redirige vers une page 404
  if (!agent) {
    notFound();
  }
  
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Fil d'Ariane */}
        <div className="mb-6">
          <nav className="flex text-sm">
            <Link href={ROUTES.HOME} className="text-gray-500 hover:text-gray-700">
              Accueil
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link href={ROUTES.AGENTS} className="text-gray-500 hover:text-gray-700">
              Catalogue
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-900 font-medium">{agent.name}</span>
          </nav>
        </div>
        
        {/* Détails de l'agent */}
        <AgentDetails agent={agent} />
        
        {/* Actions et navigation */}
        <div className="mt-8 flex justify-between">
          <Link href={ROUTES.AGENTS}>
            <Button variant="outline">
              Retour au catalogue
            </Button>
          </Link>
          
          <div className="flex gap-4">
            <Button variant="secondary">
              Ajouter aux favoris
            </Button>
            <Button>
              Contacter le créateur
            </Button>
          </div>
        </div>
        
        {/* Autres agents suggérés (placeholder) */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Vous pourriez aussi aimer
          </h2>
          
          <div className="bg-blue-50 p-8 text-center rounded-lg border border-blue-100">
            <p className="text-gray-700">
              Dans une application réelle, une liste d&apos;agents similaires serait affichée ici,
              basée sur la catégorie ou d&apos;autres métadonnées.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
