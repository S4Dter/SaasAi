'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants';
import { useAgent } from '@/lib/hooks/useAgent';
import AgentDetails from '@/components/agents/AgentDetails';

interface AgentDetailsClientProps {
  id: string;
}

export default function AgentDetailsClient({ id }: AgentDetailsClientProps) {
  const { data: agent, loading, error } = useAgent(id);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Chargement de l'agent...
          </h1>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Impossible de charger les détails de l'agent
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            {error?.message || "L'agent demandé n'a pas été trouvé"}
          </p>
          <Link href={ROUTES.AGENTS}>
            <Button variant="primary">Retour au catalogue</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href={ROUTES.AGENTS} className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au catalogue
          </Link>
        </div>
        
        <AgentDetails agent={agent} />
      </div>
    </div>
  );
}
