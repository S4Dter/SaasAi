'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import { Pricing } from '@/components/blocks/pricing';
import type { Route } from 'next';

// Types pour les plans de tarification
interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

/**
 * Composant client pour la tarification des créateurs
 */
export default function PricingCreatorClient() {
  // Plans de tarification pour créateurs
  const creatorPlans: PricingPlan[] = [
    {
      name: "ESSENTIAL",
      price: "19",
      yearlyPrice: "190",
      period: "par mois",
      features: [
        "2 agents publiables",
        "15% de commission",
        "Analytiques basiques",
        "Support email",
        "Paiements mensuels"
      ],
      description: "Pour les créateurs débutants souhaitant tester le marché",
      buttonText: "Commencer gratuitement",
      href: "/sign-up",
      isPopular: false,
    },
    {
      name: "PROFESSIONNEL",
      price: "59",
      yearlyPrice: "590",
      period: "par mois",
      features: [
        "5 agents publiables",
        "10% de commission",
        "Analytiques avancées",
        "Personnalisation de la page",
        "Accès API",
        "Support email & chat",
        "Outils de prospection avancés",
        "Paiements bi-mensuels"
      ],
      description: "Pour les créateurs confirmés souhaitant développer leur audience",
      buttonText: "Commencer gratuitement",
      href: "/sign-up",
      isPopular: true,
    },
    {
      name: "BUSINESS",
      price: "149",
      yearlyPrice: "1490",
      period: "par mois",
      features: [
        "Agents publiables illimités",
        "8% de commission",
        "Analytiques complètes",
        "Personnalisation de la page",
        "Accès API",
        "Support dédié",
        "Outils de prospection IA personnalisés",
        "Paiements hebdomadaires"
      ],
      description: "Pour les créateurs d'envergure avec de multiples agents IA",
      buttonText: "Contacter les ventes",
      href: "/contact",
      isPopular: false,
    },
  ];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Utilisation du composant Pricing */}
        <Pricing 
          plans={creatorPlans}
          title="Tarification pour les créateurs"
          description="Des formules adaptées aux créateurs d'agents IA souhaitant commercialiser leurs solutions sur notre marketplace."
        />
        
        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-20 mb-16 px-4">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
            Questions fréquentes - Créateurs
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Comment sont calculées les commissions ?
              </h3>
              <p className="mt-2 text-gray-500">
                Les commissions sont calculées sur le montant total des transactions générées par vos agents. Elles sont déduites automatiquement avant chaque versement selon la fréquence de votre formule.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Combien d'agents puis-je publier ?
              </h3>
              <p className="mt-2 text-gray-500">
                Le nombre d'agents que vous pouvez publier dépend de votre forfait : 2 pour Essential, 5 pour Professionnel et illimité pour Business. Vous pouvez mettre à jour votre abonnement à tout moment pour publier plus d'agents.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Quels sont les outils de prospection disponibles ?
              </h3>
              <p className="mt-2 text-gray-500">
                Nos outils de prospection incluent des fonctionnalités d'analyse de marché, d'identification d'entreprises potentiellement intéressées par vos agents, et des templates de messages personnalisés. La formule Business inclut également des outils IA pour optimiser votre stratégie commerciale.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Comment fonctionnent les paiements ?
              </h3>
              <p className="mt-2 text-gray-500">
                Les paiements sont effectués automatiquement selon la fréquence de votre formule : mensuel pour Essential, bi-mensuel pour Professionnel et hebdomadaire pour Business. Vous pouvez suivre vos ventes et revenus en temps réel depuis votre tableau de bord.
              </p>
            </div>
            
            <div className="text-center pt-8">
              <p className="text-gray-500">
                Vous avez d&apos;autres questions ?{' '}
                <Link href={ROUTES.CONTACT as Route} className="text-blue-600 font-medium hover:text-blue-500">
                  Contactez-nous
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
