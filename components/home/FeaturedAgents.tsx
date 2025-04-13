import React from 'react';
import Link from 'next/link';
import { getFeaturedAgents } from '../../mock/agents';
import { ROUTES, UI_CONFIG } from '../../constants';
import Card, { CardBody, CardFooter } from '../ui/Card';
import Button from '../ui/Button';

/**
 * Composant FeaturedAgents pour la page d'accueil
 * 
 * Affiche une sélection de quelques agents IA en vedette.
 */
const FeaturedAgents: React.FC = () => {
  // Récupération des agents en vedette
  const featuredAgents = getFeaturedAgents().slice(0, UI_CONFIG.FEATURED_AGENTS_COUNT);

  // Fonction pour formater le prix
  const formatPrice = (agent: any) => {
    const { pricing } = agent;
    const currencySymbol = pricing.currency === 'EUR' ? '€' : pricing.currency === 'USD' ? '$' : '£';
    
    if (pricing.model === 'subscription') {
      return `${pricing.startingPrice}${currencySymbol}/mois`;
    } else if (pricing.model === 'one-time') {
      return `${pricing.startingPrice}${currencySymbol}`;
    } else {
      return `À partir de ${pricing.startingPrice}${currencySymbol}`;
    }
  };

  // Fonction pour tronquer le texte
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Découvrez nos agents IA en vedette
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Des solutions innovantes pour transformer votre entreprise. Chaque agent est rigoureusement sélectionné pour sa qualité et son efficacité.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredAgents.map((agent) => (
            <Card key={agent.id} hoverable className="h-full flex flex-col">
              <CardBody className="flex-grow">
                <div className="flex items-start mb-4">
                  {/* Logo de l'agent (placeholder en attendant les vraies images) */}
                  <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">{agent.name.charAt(0)}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {agent.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {agent.category.charAt(0).toUpperCase() + agent.category.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">
                  {truncateText(agent.shortDescription, UI_CONFIG.MAX_DESCRIPTION_LENGTH)}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {agent.integrations.slice(0, 3).map((integration, index) => (
                    <span 
                      key={index}
                      className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                    >
                      {integration}
                    </span>
                  ))}
                  {agent.integrations.length > 3 && (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                      +{agent.integrations.length - 3}
                    </span>
                  )}
                </div>
              </CardBody>
              
              <CardFooter className="flex items-center justify-between">
                <span className="text-gray-900 font-medium">
                  {formatPrice(agent)}
                </span>
                
                <Link href={ROUTES.AGENT_DETAILS(agent.id)}>
                  <Button variant="primary" size="sm">
                    Voir les détails
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href={ROUTES.AGENTS}>
            <Button variant="outline" size="lg">
              Voir tous les agents
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAgents;
