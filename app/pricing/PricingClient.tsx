'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/**
 * Composant client pour la page de tarification principale
 * qui redirige vers les pages spécifiques pour entreprises ou créateurs
 */
export default function PricingClient() {
  const router = useRouter();

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Tarification transparente
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Des formules adaptées à tous les besoins, que vous soyez une entreprise à la recherche d&apos;agents ou un créateur.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Option pour entreprises */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all duration-300">
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Pour les entreprises</h2>
                <p className="mt-2 text-gray-500">
                  Trouvez l&apos;offre idéale pour intégrer des agents IA dans votre entreprise
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <p className="ml-3 text-gray-700">Large sélection d&apos;agents IA spécialisés</p>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <p className="ml-3 text-gray-700">Options d&apos;intégration flexibles</p>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <p className="ml-3 text-gray-700">Support dédié et services professionnels</p>
                </div>
              </div>

              <Link 
                href={ROUTES.PRICING.ENTERPRISE} 
                className="w-full bg-blue-600 text-white px-5 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors text-center inline-block"
              >
                Voir les plans entreprise
              </Link>
            </div>
          </div>

          {/* Option pour créateurs */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden hover:border-purple-500 hover:shadow-xl transition-all duration-300">
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Pour les créateurs</h2>
                <p className="mt-2 text-gray-500">
                  Commercialisez vos agents IA et développez votre activité
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <p className="ml-3 text-gray-700">Plateforme de distribution puissante</p>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <p className="ml-3 text-gray-700">Outils de prospection avancés</p>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <p className="ml-3 text-gray-700">Commissions compétitives et paiements réguliers</p>
                </div>
              </div>

              <Link 
                href={ROUTES.PRICING.CREATOR} 
                className="w-full bg-purple-600 text-white px-5 py-3 rounded-md font-medium hover:bg-purple-700 transition-colors text-center inline-block"
              >
                Voir les plans créateur
              </Link>
            </div>
          </div>
        </div>

        {/* Section commune pour questions */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Vous avez des questions ?</h2>
          <p className="mt-4 text-gray-500 max-w-3xl mx-auto">
            Notre équipe est disponible pour vous aider à trouver la solution optimale pour vos besoins spécifiques, 
            qu&apos;il s&apos;agisse d&apos;intégrer des agents IA dans votre entreprise ou de commercialiser vos propres agents.
          </p>
          <div className="mt-8">
            <Link 
              href={ROUTES.CONTACT} 
              className="px-5 py-3 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition-colors"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
