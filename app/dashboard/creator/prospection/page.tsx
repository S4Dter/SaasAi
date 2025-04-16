import React from 'react';
import { Metadata } from 'next';
import { APP_NAME, AGENT_CATEGORIES } from '@/constants';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getAllEnterprises } from '@/mock/users';

export const metadata: Metadata = {
  title: `Prospection | ${APP_NAME}`,
  description: 'Trouvez de nouveaux clients pour vos agents IA',
};

// Interface pour les prospects enrichis
interface EnhancedProspect {
  id: string;
  name: string;
  company: string;
  avatar?: string;
  location?: string;
  industryInterest: string;
  budget: string;
  matchScore: number;
  lastActivity: string;
  contacted: boolean;
  notes?: string;
}

/**
 * Page de prospection pour les créateurs d'agents
 */
export default function ProspectionPage() {
  // Utilisation des entreprises mockées comme prospects
  const enterprises = getAllEnterprises();
  
  // Enrichissement des données pour la démo
  const prospects: EnhancedProspect[] = enterprises.map((enterprise, index) => {
    // Génération de données aléatoires pour la démo
    const industries = ['Tech', 'Finance', 'Retail', 'Healthcare', 'Manufacturing'];
    const locations = ['Paris, France', 'Lyon, France', 'Bordeaux, France', 'Marseille, France', 'Lille, France'];
    const budgets = ['< 200€/mois', '200€-500€/mois', '500€-1000€/mois', '> 1000€/mois'];
    const activities = ['A consulté votre profil', 'A visité vos agents', 'A contacté un autre créateur', 'Nouveau sur la plateforme'];
    
    return {
      id: enterprise.id,
      name: enterprise.name,
      company: enterprise.company || 'Entreprise inconnue',
      avatar: enterprise.avatar,
      location: locations[index % locations.length],
      industryInterest: industries[index % industries.length],
      budget: budgets[index % budgets.length],
      matchScore: Math.floor(Math.random() * 41) + 60, // Score entre 60 et 100
      lastActivity: `${Math.floor(Math.random() * 10) + 1} jours`,
      contacted: Math.random() > 0.6,
      notes: Math.random() > 0.5 ? `Notes sur ${enterprise.name} et ${enterprise.company}` : undefined,
    };
  });
  
  // Tri des prospects par score de correspondance
  prospects.sort((a, b) => b.matchScore - a.matchScore);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Outil de prospection</h1>
        <p className="text-gray-600 mt-1">
          Trouvez des clients potentiels qui correspondent à vos agents IA
        </p>
      </div>
      
      {/* Filtres de recherche */}
      <Card className="mb-6">
        <CardBody className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Rechercher par nom d'entreprise, secteur..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les secteurs</option>
              <option value="tech">Technologie</option>
              <option value="finance">Finance</option>
              <option value="retail">Commerce</option>
              <option value="healthcare">Santé</option>
              <option value="manufacturing">Industrie</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les budgets</option>
              <option value="low">Moins de 200€/mois</option>
              <option value="medium">200€-500€/mois</option>
              <option value="high">Plus de 500€/mois</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tout statut</option>
              <option value="notContacted">Non contactés</option>
              <option value="contacted">Déjà contactés</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Filtrer
            </button>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {prospects.length} prospects trouvés
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Trier par:</span>
              <select className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="match">Score de correspondance</option>
                <option value="activity">Activité récente</option>
                <option value="alphabetical">Ordre alphabétique</option>
                <option value="budget">Budget estimé</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>
      
      {/* Recommandations de ciblage */}
      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Recommandations de ciblage
          </h2>
          <Button variant="outline" size="sm">
            Affiner les recommandations
          </Button>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AGENT_CATEGORIES.slice(0, 3).map((category, index) => {
              const catProspects = Math.floor(Math.random() * 20) + 5;
              const matchScore = Math.floor(Math.random() * 21) + 80;
              
              return (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium">{category.label}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {catProspects} prospects potentiels dans ce secteur avec un score de correspondance moyen de {matchScore}%.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Budget moyen estimé: 300€-500€/mois
                    </span>
                    <button className="text-sm text-blue-600 hover:underline">
                      Explorer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
      
      {/* Liste des prospects */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">
            Prospects correspondant à vos agents
          </h2>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entreprise
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Secteur
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget estimé
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correspondance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière activité
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prospects.map((prospect) => (
                  <tr key={prospect.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-bold">
                          {prospect.avatar ? (
                            <img src={prospect.avatar} alt={prospect.name} className="h-10 w-10 rounded-full" />
                          ) : (
                            prospect.company.charAt(0)
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {prospect.company}
                          </div>
                          <div className="text-sm text-gray-500">
                            {prospect.name} • {prospect.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {prospect.industryInterest}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prospect.budget}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 mr-2">{prospect.matchScore}%</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              prospect.matchScore > 80 ? 'bg-green-500' : 
                              prospect.matchScore > 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${prospect.matchScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Il y a {prospect.lastActivity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          prospect.contacted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {prospect.contacted ? 'Contacté' : 'Non contacté'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        Voir profil
                      </button>
                      {!prospect.contacted && (
                        <button className="text-green-600 hover:text-green-900">
                          Contacter
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Affichage de <span className="font-medium">1</span> à <span className="font-medium">{prospects.length}</span> sur <span className="font-medium">{prospects.length}</span> prospects
            </div>
            <div className="flex space-x-1">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-500">
                Précédent
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-blue-600 text-white">
                1
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-500">
                Suivant
              </button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
