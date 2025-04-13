import React from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import { APP_NAME, APP_SLOGAN, ROUTES } from '../../constants';

/**
 * Composant Hero pour la page d'accueil
 * 
 * Affiche le slogan et les deux boutons principaux d'action.
 */
const Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-20 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {APP_NAME}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-10">
            {APP_SLOGAN}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link href={ROUTES.AGENTS}>
              <Button size="lg" className="px-8">
                Je cherche un agent IA
              </Button>
            </Link>
            
            <Link href={ROUTES.AUTH.SIGNUP}>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8"
              >
                Je crée des agents IA
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-center">
            <div className="bg-white/60 rounded-lg shadow-lg p-6 border border-gray-200">
              <p className="text-gray-700">
                <span className="font-medium">AgentMarket</span> connecte les créateurs d&apos;agents IA avec les entreprises 
                qui cherchent à transformer leur activité. Notre plateforme facilite la découverte, 
                l&apos;évaluation et l&apos;acquisition des meilleurs agents IA du marché, 
                tout en offrant aux créateurs des outils pour présenter et commercialiser leurs solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
