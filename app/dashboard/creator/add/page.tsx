import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { APP_NAME, ROUTES, AGENT_CATEGORIES, INTEGRATION_TYPES, PRICING_MODELS } from '@/constants';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AgentForm from '@/components/agents/AgentForm';

export const metadata: Metadata = {
  title: `Ajouter un agent | ${APP_NAME}`,
  description: 'Ajoutez un nouvel agent IA à la marketplace',
};

/**
 * Page d'ajout d'un nouvel agent
 */
export default function AddAgentPage() {
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ajouter un nouvel agent</h1>
          <p className="text-gray-600 mt-1">
            Créez et publiez votre agent IA sur la marketplace
          </p>
        </div>
        <Link href={ROUTES.DASHBOARD.CREATOR.AGENTS}>
          <Button variant="outline">
            Annuler
          </Button>
        </Link>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">
            Informations de base
          </h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l&apos;agent *
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: SalesGenius, MarketingMind..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Choisissez un nom mémorable et descriptif pour votre agent IA
            </p>
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug URL *
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                {`${APP_NAME.toLowerCase()}.com/agents/`}
              </span>
              <input
                id="slug"
                type="text"
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="mon-agent-ia"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              L&apos;identifiant URL unique de votre agent (lettres, chiffres et tirets)
            </p>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie *
            </label>
            <select
              id="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionnez une catégorie</option>
              {AGENT_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Choisissez la catégorie qui correspond le mieux à la fonction principale de votre agent
            </p>
          </div>
          
          <div>
            <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description courte *
            </label>
            <input
              id="shortDescription"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Une phrase qui décrit clairement ce que fait votre agent"
              maxLength={150}
            />
            <p className="mt-1 text-sm text-gray-500">
              Max. 150 caractères - Cette description apparaîtra dans les listes et résultats de recherche
            </p>
          </div>
        </CardBody>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">
            Description détaillée
          </h2>
        </CardHeader>
        <CardBody>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description complète (Markdown supporté) *
            </label>
            <textarea
              id="description"
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Décrivez en détail ce que fait votre agent, ses fonctionnalités, ses bénéfices..."
            ></textarea>
            <div className="mt-2 flex justify-between">
              <p className="text-sm text-gray-500">
                Le markdown est supporté pour la mise en forme
              </p>
              <div className="flex space-x-2">
                <button className="text-xs text-gray-500 border border-gray-300 px-2 py-1 rounded">
                  Aperçu
                </button>
                <button className="text-xs text-gray-500 border border-gray-300 px-2 py-1 rounded">
                  Guide Markdown
                </button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">
            Intégrations et tarification
          </h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Types d&apos;intégration disponibles *
            </label>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {INTEGRATION_TYPES.map(type => (
                <div key={type.value} className="flex items-center">
                  <input
                    id={`integration-${type.value}`}
                    name="integrations"
                    type="checkbox"
                    value={type.value}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`integration-${type.value}`} className="ml-2 block text-sm text-gray-700">
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="pricingModel" className="block text-sm font-medium text-gray-700 mb-1">
                Modèle de tarification *
              </label>
              <select
                id="pricingModel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un modèle</option>
                {PRICING_MODELS.map(model => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Prix de départ *
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <select
                  id="currency"
                  className="rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 sm:text-sm"
                >
                  <option value="EUR">€</option>
                  <option value="USD">$</option>
                  <option value="GBP">£</option>
                </select>
                <input
                  type="number"
                  id="price"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Prix"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="pricingDetails" className="block text-sm font-medium text-gray-700 mb-1">
              Détails de la tarification
            </label>
            <input
              id="pricingDetails"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: À partir de 99€/mois. Essai gratuit de 14 jours."
            />
          </div>
        </CardBody>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">
            Médias et démo
          </h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo de l&apos;agent *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="logo-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Télécharger un fichier</span>
                    <input id="logo-upload" name="logo-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">ou glisser-déposer</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu&apos;à 2MB</p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Captures d&apos;écran (optionnel)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="screenshots-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Ajouter des images</span>
                    <input id="screenshots-upload" name="screenshots-upload" type="file" className="sr-only" multiple />
                  </label>
                  <p className="pl-1">ou glisser-déposer</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG jusqu&apos;à 5MB chacune. Maximum 5 images.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                URL de démo (optionnel)
              </label>
              <input
                id="demoUrl"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://demo.votreagent.com"
              />
              <p className="mt-1 text-sm text-gray-500">
                Lien vers une version de démonstration de votre agent
              </p>
            </div>
            
            <div>
              <label htmlFor="demoVideo" className="block text-sm font-medium text-gray-700 mb-1">
                Vidéo de démo (optionnel)
              </label>
              <input
                id="demoVideo"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://youtube.com/watch?v=..."
              />
              <p className="mt-1 text-sm text-gray-500">
                URL YouTube ou Vimeo montrant votre agent en action
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
      
      <div className="flex justify-end space-x-4 mt-8 mb-12">
        <Button variant="outline">
          Enregistrer comme brouillon
        </Button>
        <Button variant="outline">
          Prévisualiser
        </Button>
        <Button>
          Publier l&apos;agent
        </Button>
      </div>
    </div>
  );
}
