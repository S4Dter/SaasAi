'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import { Pricing } from '@/components/blocks/pricing';
import type { Route } from 'next';

// Types pour les plans de tarification pour le nouveau composant Pricing
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
 * Composant client pour la page de tarification
 */
export default function PricingClient() {
  // Plan de tarification pour entreprises
  const enterprisePlans: PricingPlan[] = [
    {
      name: "STARTER",
      price: "49",
      yearlyPrice: "490",
      period: "par mois",
      features: [
        "3 agents accessibles",
        "5 utilisateurs",
        "1 000 messages par mois",
        "Support email",
        "2 intégrations"
      ],
      description: "Pour commencer à tester les agents IA dans votre entreprise",
      buttonText: "Essai gratuit de 14 jours",
      href: "/sign-up",
      isPopular: false,
    },
    {
      name: "PRO",
      price: "99",
      yearlyPrice: "990",
      period: "par mois",
      features: [
        "10 agents accessibles",
        "20 utilisateurs",
        "10 000 messages par mois",
        "Personnalisation",
        "Accès API",
        "Support email & chat",
        "Analytiques avancées",
        "5 intégrations"
      ],
      description: "Pour les entreprises qui souhaitent adopter pleinement les agents IA",
      buttonText: "Essai gratuit de 14 jours",
      href: "/sign-up",
      isPopular: true,
    },
    {
      name: "ENTREPRISE",
      price: "299",
      yearlyPrice: "2990",
      period: "par mois",
      features: [
        "Agents accessibles illimités",
        "Utilisateurs illimités",
        "Messages illimités",
        "Personnalisation",
        "Accès API",
        "Support dédié 24/7",
        "Analytiques avancées",
        "Intégrations illimitées"
      ],
      description: "Pour les grandes entreprises avec des besoins spécifiques",
      buttonText: "Contacter les ventes",
      href: "/contact",
      isPopular: false,
    },
  ];

  // Plan de tarification pour créateurs
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
  const [userType, setUserType] = useState<'enterprise' | 'creator'>('enterprise');

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center my-8">
          <div className="inline-flex p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setUserType('enterprise')}
              className={`${
                userType === 'enterprise'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              } px-6 py-2 rounded-md font-medium transition-all`}
            >
              Pour les entreprises
            </button>
            <button
              onClick={() => setUserType('creator')}
              className={`${
                userType === 'creator'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              } px-6 py-2 rounded-md font-medium transition-all`}
            >
              Pour les créateurs
            </button>
          </div>
        </div>

        {/* Utilisation du nouveau composant Pricing */}
        <Pricing 
          plans={userType === 'enterprise' ? enterprisePlans : creatorPlans}
          title="Tarification transparente"
          description="Des formules adaptées à tous les besoins, que vous soyez une entreprise à la recherche d'agents ou un créateur."
        />
        
        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-20 mb-16 px-4">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
            Questions fréquentes
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Puis-je changer de formule à tout moment ?
              </h3>
              <p className="mt-2 text-gray-500">
                Oui, vous pouvez à tout moment passer à une formule supérieure ou inférieure. Les changements prennent effet à la prochaine période de facturation.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Comment fonctionne l&apos;essai gratuit ?
              </h3>
              <p className="mt-2 text-gray-500">
                L&apos;essai gratuit dure 14 jours et vous donne accès à toutes les fonctionnalités de la formule choisie. Aucune carte bancaire n&apos;est requise pour démarrer votre essai.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Quels moyens de paiement acceptez-vous ?
              </h3>
              <p className="mt-2 text-gray-500">
                Nous acceptons les principales cartes de crédit (Visa, Mastercard, American Express) ainsi que les prélèvements SEPA. Pour les formules Business et Enterprise, nous proposons également le paiement par virement bancaire.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Comment sont calculées les commissions pour les créateurs ?
              </h3>
              <p className="mt-2 text-gray-500">
                Les commissions sont calculées sur le montant total des transactions générées par vos agents. Elles sont déduites automatiquement avant chaque versement selon la fréquence de votre formule.
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
