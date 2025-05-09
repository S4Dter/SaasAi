'use client';

import React, { useState, useEffect } from 'react';
import { AGENT_CATEGORIES } from '@/constants';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import AgentCard from '@/components/agents/AgentCard';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Agent } from '@/types';
import { useAuth } from '@/lib/context/AuthContext';

/**
 * Composant client pour les suggestions d'agents
 */
export default function SuggestionsClient() {
  const [loading, setLoading] = useState<boolean>(true);
  const [suggestionGroups, setSuggestionGroups] = useState<{
    category: string;
    categoryLabel: string;
    agents: Agent[];
  }[]>([]);
  
  const [industry, setIndustry] = useState<string>('all');
  const [companySize, setCompanySize] = useState<string>('all');
  const [budget, setBudget] = useState<string>('all');
  
  const { user } = useAuth();
  const userId = user?.id;

  // Fonction pour récupérer les agents par catégorie
  const getAgentsByCategory = async (category: string) => {
    try {
      if (!supabase) {
        throw new Error('Client Supabase non disponible');
      }

      let query = supabase
        .from('agents')
        .select(`
          id, name, slug, description, short_description, 
          category, creator_id, pricing, featured, logo_url, 
          integrations, demo_url, demo_video_url, screenshots, 
          created_at, updated_at, is_public
        `)
        .eq('category', category)
        .eq('is_public', true)
        .limit(2);
        
      // Appliquer des filtres supplémentaires selon les préférences utilisateur
      if (budget !== 'all') {
        // Exemple simple: filtrage côté client dans ce cas
        // Dans une vraie implémentation, on pourrait avoir un champ price_range dans la table
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Formater les données pour correspondre au type Agent
      return data.map((agent: any) => ({
        id: agent.id,
        name: agent.name,
        slug: agent.slug || '',
        description: agent.description || '',
        shortDescription: agent.short_description || '',
        category: agent.category || 'other',
        creatorId: agent.creator_id,
        pricing: agent.pricing || { model: 'subscription', startingPrice: 0, currency: 'EUR' },
        featured: agent.featured || false,
        logoUrl: agent.logo_url || '',
        integrations: agent.integrations || [],
        demoUrl: agent.demo_url,
        demoVideoUrl: agent.demo_video_url,
        screenshots: agent.screenshots || [],
        createdAt: new Date(agent.created_at || Date.now()),
        updatedAt: agent.updated_at ? new Date(agent.updated_at) : new Date(agent.created_at || Date.now()),
        isPublic: !!agent.is_public
      })) as Agent[];
    } catch (error) {
      console.error(`Erreur lors de la récupération des agents pour la catégorie ${category}:`, error);
      return [];
    }
  };

  // Effet pour charger les données au chargement et quand les filtres changent
  useEffect(() => {
    const loadSuggestions = async () => {
      setLoading(true);
      
      // Catégories suggérées (personnalisées selon l'utilisateur)
      const suggestedCategories = ['marketing', 'sales', 'customer-service'];
      
      // Charger les agents pour chaque catégorie
      const groups = await Promise.all(
        suggestedCategories.map(async (category) => {
          const categoryLabel = AGENT_CATEGORIES.find(c => c.value === category)?.label || category;
          const agents = await getAgentsByCategory(category);
          
          return {
            category,
            categoryLabel,
            agents
          };
        })
      );
      
      setSuggestionGroups(groups);
      setLoading(false);
    };
    
    loadSuggestions();
  }, [industry, companySize, budget]);

  // Fonction pour affiner les suggestions
  const refineSuggestions = () => {
    // Cette fonction serait appelée lors du clic sur le bouton "Affiner les suggestions"
    // Elle déclenchera simplement une nouvelle requête via l'effet useEffect
    console.log('Affinement des suggestions avec les filtres:', { industry, companySize, budget });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
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
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
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
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                >
                  <option value="all">Tous budgets</option>
                  <option value="low">Moins de 200€</option>
                  <option value="medium">200€ - 500€</option>
                  <option value="high">Plus de 500€</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px] flex items-end">
                <button 
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  onClick={refineSuggestions}
                >
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
                {group.agents.length > 0 ? (
                  group.agents.map((agent) => (
                    <div key={agent.id} className="relative">
                      <div className="absolute right-3 top-3 z-10">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                          Recommandé
                        </span>
                      </div>
                      <AgentCard agent={agent} />
                    </div>
                  ))
                ) : (
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
