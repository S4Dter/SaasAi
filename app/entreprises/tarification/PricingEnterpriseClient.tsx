'use client';

import React, { useState } from 'react';
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
 * Composant client pour la tarification des entreprises
 */
export default function PricingEnterpriseClient() {
  // Plans de tarification pour entreprises
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

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Utilisation du composant Pricing */}
        <Pricing 
          plans={enterprisePlans}
          title="Tarification pour les entreprises"
          description="Des formules adaptées à tous les besoins d'entreprise, pour exploiter pleinement le potentiel des agents IA."
        />
        
        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-20 mb-16 px-4">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
            Questions fréquentes - Entreprises
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
                Les agents sont-ils personnalisables pour notre entreprise ?
              </h3>
              <p className="mt-2 text-gray-500">
                Oui, les formules Pro et Entreprise incluent des options de personnalisation pour adapter les agents à vos processus spécifiques et à votre charte graphique. La formule Entreprise offre même des développements sur mesure.
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
