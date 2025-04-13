import React from 'react';
import Link from 'next/link';
import { Agent } from '../../types';
import { ROUTES } from '../../constants';
import Card, { CardBody, CardFooter } from '../ui/Card';
import Button from '../ui/Button';

interface AgentCardProps {
  agent: Agent;
  compact?: boolean;
}

/**
 * Composant AgentCard pour afficher un agent dans le catalogue
 * 
 * @param {Agent} agent - L'agent à afficher
 * @param {boolean} compact - Affichage compact ou détaillé
 */
const AgentCard: React.FC<AgentCardProps> = ({ agent, compact = false }) => {
  // Fonction pour formater le prix
  const formatPrice = () => {
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

  // Formater la catégorie pour l'affichage
  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
  };

  return (
    <Card hoverable className="h-full flex flex-col">
      <CardBody className="flex-grow">
        <div className="flex items-start mb-4">
          {/* Logo de l'agent (placeholder en attendant les vraies images) */}
          <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center mr-3">
            <span className="text-blue-600 font-bold">{agent.name.charAt(0)}</span>
          </div>
          
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {agent.name}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {formatCategory(agent.category)}
              </span>
              {agent.featured && (
                <span className="inline-block ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  Coup de cœur
                </span>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">
          {compact 
            ? truncateText(agent.shortDescription, 100) 
            : truncateText(agent.shortDescription, 200)
          }
        </p>
        
        {!compact && (
          <div className="flex flex-wrap gap-2 mb-4">
            {agent.integrations.map((integration, index) => (
              <span 
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
              >
                {integration}
              </span>
            ))}
          </div>
        )}
      </CardBody>
      
      <CardFooter className="flex items-center justify-between">
        <span className="text-gray-900 font-medium">
          {formatPrice()}
        </span>
        
        <Link href={ROUTES.AGENT_DETAILS(agent.id)}>
          <Button variant="primary" size="sm">
            Voir les détails
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default AgentCard;
