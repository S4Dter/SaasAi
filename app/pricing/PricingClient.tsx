'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES, PRICING_MODELS } from '@/constants';
import Button from '@/components/ui/Button';

// Types pour les plans de tarification
interface PricingFeature {
  id: string;
  title: string;
  description?: string;
  tiers: {
    [key: string]: boolean | string | number;
  };
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  cta: string;
  mostPopular: boolean;
}

/**
 * Composant client pour la page de tarification
 */
export default function PricingClient() {
  // Plan de tarification pour entreprises
  const enterprisePlans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Pour commencer à tester les agents IA dans votre entreprise',
      price: { 
        monthly: 49,
        yearly: 490
      },
      cta: 'Essai gratuit de 14 jours',
      mostPopular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Pour les entreprises qui souhaitent adopter pleinement les agents IA',
      price: { 
        monthly: 99,
        yearly: 990
      },
      cta: 'Essai gratuit de 14 jours',
      mostPopular: true
    },
    {
      id: 'enterprise',
      name: 'Entreprise',
      description: 'Pour les grandes entreprises avec des besoins spécifiques',
      price: { 
        monthly: 299,
        yearly: 2990
      },
      cta: 'Contacter les ventes',
      mostPopular: false
    }
  ];

  // Caractéristiques des plans
  const enterpriseFeatures: PricingFeature[] = [
    {
      id: 'agents',
      title: 'Agents accessibles',
      tiers: {
        starter: '3 agents',
        pro: '10 agents',
        enterprise: 'Illimité',
      }
    },
    {
      id: 'users',
      title: 'Utilisateurs',
      tiers: {
        starter: '5 utilisateurs',
        pro: '20 utilisateurs',
        enterprise: 'Illimité',
      }
    },
    {
      id: 'messages',
      title: 'Messages par mois',
      tiers: {
        starter: '1 000',
        pro: '10 000',
        enterprise: 'Illimité',
      }
    },
    {
      id: 'custom',
      title: 'Personnalisation',
      tiers: {
        starter: false,
        pro: true,
        enterprise: true,
      }
    },
    {
      id: 'api',
      title: 'Accès API',
      tiers: {
        starter: false,
        pro: true,
        enterprise: true,
      }
    },
    {
      id: 'support',
      title: 'Support',
      tiers: {
        starter: 'Email',
        pro: 'Email & Chat',
        enterprise: 'Dédié 24/7',
      }
    },
    {
      id: 'analytics',
      title: 'Analytiques avancées',
      tiers: {
        starter: false,
        pro: true,
        enterprise: true,
      }
    },
    {
      id: 'integrations',
      title: 'Intégrations',
      tiers: {
        starter: '2 intégrations',
        pro: '5 intégrations',
        enterprise: 'Illimité',
      }
    },
  ];

  // Plan de tarification pour créateurs
  const creatorPlans: PricingPlan[] = [
    {
      id: 'essential',
      name: 'Essential',
      description: 'Pour les créateurs débutants souhaitant tester le marché',
      price: { 
        monthly: 19,
        yearly: 190
      },
      cta: 'Commencer gratuitement',
      mostPopular: false
    },
    {
      id: 'creator-pro',
      name: 'Professionnel',
      description: 'Pour les créateurs confirmés souhaitant développer leur audience',
      price: { 
        monthly: 59,
        yearly: 590
      },
      cta: 'Commencer gratuitement',
      mostPopular: true
    },
    {
      id: 'creator-business',
      name: 'Business',
      description: 'Pour les créateurs d\'envergure avec de multiples agents IA',
      price: { 
        monthly: 149,
        yearly: 1490
      },
      cta: 'Contacter les ventes',
      mostPopular: false
    }
  ];

  // Caractéristiques des plans créateurs
  const creatorFeatures: PricingFeature[] = [
    {
      id: 'listing',
      title: 'Agents publiables',
      tiers: {
        essential: '2 agents',
        'creator-pro': '5 agents',
        'creator-business': 'Illimité',
      }
    },
    {
      id: 'commission',
      title: 'Commission',
      tiers: {
        essential: '15%',
        'creator-pro': '10%',
        'creator-business': '8%',
      }
    },
    {
      id: 'analytics',
      title: 'Analytiques',
      tiers: {
        essential: 'Basique',
        'creator-pro': 'Avancée',
        'creator-business': 'Complète',
      }
    },
    {
      id: 'support',
      title: 'Support',
      tiers: {
        essential: 'Email',
        'creator-pro': 'Email & Chat',
        'creator-business': 'Dédié',
      }
    },
    {
      id: 'customization',
      title: 'Personnalisation de la page',
      tiers: {
        essential: false,
        'creator-pro': true,
        'creator-business': true,
      }
    },
    {
      id: 'api',
      title: 'Accès API',
      tiers: {
        essential: false,
        'creator-pro': true,
        'creator-business': true,
      }
    },
    {
      id: 'prospection',
      title: 'Outils de prospection',
      tiers: {
        essential: 'Basique',
        'creator-pro': 'Avancée',
        'creator-business': 'IA Personnalisée',
      }
    },
    {
      id: 'payout',
      title: 'Paiements',
      tiers: {
        essential: 'Mensuel',
        'creator-pro': 'Bi-mensuel',
        'creator-business': 'Hebdomadaire',
      }
    },
  ];

  const [annualBilling, setAnnualBilling] = React.useState(true);
  const [userType, setUserType] = React.useState<'enterprise' | 'creator'>('enterprise');

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Tarification transparente
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Des formules adaptées à tous les besoins, que vous soyez une entreprise à la recherche d&apos;agents ou un créateur.
          </p>
        </div>

        {/* Sélecteur de type d'utilisateur */}
        <div className="flex justify-center mb-8">
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

        {/* Sélecteur de facturation */}
        <div className="flex justify-center mb-12">
          <div className="relative flex items-center">
            <div
              className={`${
                annualBilling ? 'text-gray-500' : 'text-gray-900 font-semibold'
              } mr-3`}
            >
              Mensuel
            </div>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                annualBilling ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  annualBilling ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <div
              className={`${
                annualBilling ? 'text-gray-900 font-semibold' : 'text-gray-500'
              } ml-3 flex items-center`}
            >
              Annuel
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                -17%
              </span>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
          {(userType === 'enterprise' ? enterprisePlans : creatorPlans).map((plan) => (
            <div 
              key={plan.id}
              className={`${
                plan.mostPopular 
                  ? 'border-blue-500 ring-2 ring-blue-500' 
                  : 'border-gray-200'
              } rounded-lg shadow-sm border bg-white divide-y divide-gray-200 relative`}
            >
              {plan.mostPopular && (
                <div className="absolute -top-5 inset-x-0">
                  <div className="bg-blue-500 text-white text-xs font-semibold py-1 px-4 rounded-full inline-block">
                    Le plus populaire
                  </div>
                </div>
              )}

              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 leading-6">{plan.name}</h2>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {annualBilling ? plan.price.yearly : plan.price.monthly}€
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    {annualBilling ? '/an' : '/mois'}
                  </span>
                </p>
                <div className="mt-8">
                  <Button fullWidth variant={plan.mostPopular ? 'primary' : 'outline'}>
                    {plan.cta}
                  </Button>
                </div>
              </div>

              <div className="pt-6 pb-8 px-6">
                <h3 className="text-sm font-medium text-gray-900 tracking-wide">
                  Ce qui est inclus
                </h3>
                <ul className="mt-6 space-y-4">
                  {(userType === 'enterprise' ? enterpriseFeatures : creatorFeatures).map((feature) => (
                    <li key={feature.id} className="flex items-start">
                      {typeof feature.tiers[plan.id] === 'boolean' ? (
                        feature.tiers[plan.id] ? (
                          <svg 
                            className="flex-shrink-0 h-5 w-5 text-green-500" 
                            fill="currentColor" 
                            viewBox="0 0 20 20" 
                            aria-hidden="true"
                          >
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg 
                            className="flex-shrink-0 h-5 w-5 text-gray-400" 
                            fill="currentColor" 
                            viewBox="0 0 20 20" 
                            aria-hidden="true"
                          >
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )
                      ) : (
                        <svg
                          className="flex-shrink-0 h-5 w-5 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="ml-3 text-sm text-gray-500">
                        {feature.title}:&nbsp;
                        {typeof feature.tiers[plan.id] === 'boolean' ? (
                          feature.tiers[plan.id] ? (
                            <span className="font-medium text-gray-900">Inclus</span>
                          ) : (
                            <span>Non inclus</span>
                          )
                        ) : (
                          <span className="font-medium text-gray-900">{feature.tiers[plan.id]}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-20">
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
                <Link href={ROUTES.CONTACT} className="text-blue-600 font-medium hover:text-blue-500">
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
