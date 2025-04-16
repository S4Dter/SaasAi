import React from 'react';
import { Metadata } from 'next';
import { APP_NAME } from '@/constants';
import { filterAgents } from '@/mock/agents';
import { AGENT_CATEGORIES } from '@/constants';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import AgentCard from '@/components/agents/AgentCard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: `Suggestions d'agents | ${APP_NAME}`,
  description: 'Découvrez des agents IA recommandés pour votre entreprise',
};

/**
 * Page des suggestions d'agents pour entreprise
 */
export default function SuggestionsPage() {
  // Simulation de suggestions personnalisées en utilisant différentes catégories
  const suggestedCategories = ['marketing', 'sales', 'customer-service'];
  
  // Créer des groupes d'agents par catégorie pour les suggestions
  const suggestionGroups = suggestedCategories.map(category => {
    const categoryLabel = AGENT_CATEGORIES.find(c => c.value === category)?.label || category;
    return {
      category,
      categoryLabel,
      agents: filterAgents(category as any, undefined, undefined).slice(0, 2)
    };
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Agents recommandés</h1>
        <p className="text-gray-600 mt-1">
          Découvrez des agents IA sélectionnés selon votre profil et vos besoins
        </p>
      </div>

      {/* Filtres */}
      <div className="mb-8">
        <Card>
          <CardBody className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                  Secteur d&apos;activité
                </label>
                <select
                  id="industry"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous les secteurs</option>
                  <option value="tech">Technologie</option>
                  <option value="finance">Finance</option>
                  <option value="retail">Commerce de détail</option>
                  <option value="healthcare">Santé</option>
                  <option value="education">Éducation</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
                  Taille d&apos;entreprise
                </label>
                <select
                  id="companySize"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Toutes tailles</option>
                  <option value="small">Petite (1-50 employés)</option>
                  <option value="medium">Moyenne (51-500 employés)</option>
                  <option value="large">Grande (500+ employés)</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                  Budget mensuel
                </label>
                <select
                  id="budget"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous budgets</option>
                  <option value="low">Moins de 200€</option>
                  <option value="medium">200€ - 500€</option>
                  <option value="high">Plus de 500€</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px] flex items-end">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Affiner les suggestions
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Suggestions par catégorie */}
      {suggestionGroups.map((group) => (
        <div key={group.category} className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Recommandés pour {group.categoryLabel}
                </h2>
                <Link 
                  href={`/agents?category=${group.category}`}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Voir tous les agents de {group.categoryLabel.toLowerCase()}
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {group.agents.map((agent) => (
                  <div key={agent.id} className="relative">
                    <div className="absolute right-3 top-3 z-10">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                        Recommandé
                      </span>
                    </div>
                    <AgentCard agent={agent} />
                  </div>
                ))}
                {group.agents.length === 0 && (
                  <div className="col-span-2 py-8 text-center">
                    <p className="text-gray-500">
                      Aucun agent disponible dans cette catégorie pour le moment.
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      ))}

      {/* Section des tendances */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">
            Tendances du moment
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3">
                    <span className="text-blue-600 font-bold">#{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-medium">
                    {index === 0 && "Agents RH"}
                    {index === 1 && "Assistants Marketing"}
                    {index === 2 && "Solution Service Client"}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  {index === 0 && "Les agents spécialisés en RH sont de plus en plus adoptés pour l'automatisation du recrutement."}
                  {index === 1 && "Les assistants marketing intelligents deviennent essentiels pour l'analyse de données et la personnalisation."}
                  {index === 2 && "Les chatbots et les agents de service client sont la tendance prioritaire pour améliorer l'expérience client."}
                </p>
                <div className="mt-3">
                  <Link 
                    href={`/agents?category=${index === 0 ? 'hr' : index === 1 ? 'marketing' : 'customer-service'}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Explorer cette tendance
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
