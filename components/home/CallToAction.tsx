import React from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import { ROUTES } from '../../constants';

/**
 * Composant CallToAction pour la page d'accueil
 * 
 * Affiche les deux boutons principaux d'action dirigés vers les différents types d'utilisateurs
 */
const CallToAction: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Prêt à transformer votre entreprise avec l&apos;IA ?
        </h2>
        
        <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
          Que vous cherchiez des solutions IA innovantes ou que vous souhaitiez partager vos créations, 
          AgentMarket est la plateforme qu&apos;il vous faut.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link href={ROUTES.AGENTS}>
            <Button size="lg" className="px-8 py-4 text-lg">
              Je cherche un agent IA
            </Button>
          </Link>
          
          <Link href={ROUTES.AUTH.SIGNUP}>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg"
            >
              Je crée des agents IA
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
