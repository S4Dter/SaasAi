"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { APP_NAME, APP_DESCRIPTION } from '@/constants';
import ThreeDScene from '@/app/components/ThreeDScene';

// Link card component for navigation grid
interface LinkCardProps {
  title: string;
  href: string | URL;
  description: string;
  icon?: string;
}

const LinkCard: React.FC<LinkCardProps> = ({ title, href, description, icon }) => {
  return (
    <Link href={href as any} className="group">
      <div className="relative flex flex-col h-full p-6 bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-300">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 flex-grow">
          {description}
        </p>
        <div className="mt-4 text-blue-600">
          En savoir plus →
        </div>
      </div>
    </Link>
  );
};

export default function Home() {
  // Navigation links data
  const navigationLinks = [
    {
      title: "Trouver un agent IA",
      href: "/entreprises/trouver-agent",
      description: "Explorez notre catalogue d'agents IA pour trouver la solution adaptée à vos besoins d'entreprise."
    },
    {
      title: "Comment ça marche",
      href: "/entreprises/comment-ca-marche",
      description: "Découvrez le fonctionnement de notre marketplace et comment intégrer des agents IA à votre entreprise."
    },
    {
      title: "Tarification",
      href: "/entreprises/tarification",
      description: "Consultez nos forfaits et tarifs pour l'utilisation d'agents IA sur mesure."
    },
    {
      title: "Témoignages",
      href: "/entreprises/temoignages",
      description: "Lisez les retours d'expérience de nos clients qui ont transformé leur activité avec nos agents IA."
    },
    {
      title: "Publier un agent",
      href: "/createurs/publier-agent",
      description: "Vous êtes créateur d'agents IA ? Publiez vos solutions sur notre marketplace et élargissez votre audience."
    },
    {
      title: "Outils de prospection",
      href: "/createurs/outils-prospection",
      description: "Accédez à nos outils dédiés aux créateurs pour développer votre clientèle et promouvoir vos agents."
    },
    {
      title: "Guide du créateur",
      href: "/createurs/guide-createur",
      description: "Consultez nos ressources et conseils pour optimiser vos agents IA et maximiser vos ventes."
    },
    {
      title: "Communauté",
      href: "/createurs/communaute",
      description: "Rejoignez notre communauté de créateurs d'agents IA pour échanger et collaborer."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section with 3D Scene */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-gray-900 mb-4">
              {APP_NAME}
            </h1>
            <p className="text-xl text-center text-gray-700 max-w-3xl mb-8">
              La marketplace d&apos;agents IA à destination des entreprises et créateurs
            </p>
            
            {/* 3D Scene with Suspense fallback */}
            <div className="w-full max-w-5xl">
              <Suspense fallback={<div className="w-full h-[500px] flex items-center justify-center bg-blue-50">Chargement du modèle 3D...</div>}>
                <ThreeDScene />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Concept Explanation */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Une plateforme unique pour les agents IA
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              {APP_DESCRIPTION}
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/entreprises/trouver-agent">
                <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Je cherche un agent IA
                </button>
              </Link>
              <Link href="/createurs/publier-agent">
                <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Je crée des agents IA
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Grid */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            Explorez notre plateforme
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {navigationLinks.map((link, index) => (
              <LinkCard 
                key={index}
                title={link.title}
                href={link.href}
                description={link.description}
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
