// app/dashboard/creator/prospection/ProspectionClient.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { AGENT_CATEGORIES } from '@/constants';
import RecommendationCard from './RecommendationCard';
import ProspectRow, { Prospect } from './ProspectRow';
import ProspectionFilters, { ProspectionFilters as FiltersType } from './ProspectionFilters';
import Pagination from './Pagination';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function ProspectionClient() {
  const { user } = useAuth();
  const userId = user?.id;

  // États
  const [loading, setLoading] = useState(true);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [filteredProspects, setFilteredProspects] = useState<Prospect[]>([]);
  const [recommendedCategories, setRecommendedCategories] = useState<{
    category: string;
    categoryLabel: string;
    prospectCount: number;
    matchScore: number;
    averageBudget: string;
  }[]>([]);
  const [filters, setFilters] = useState<FiltersType>({
    searchTerm: '',
    industry: 'all',
    budget: 'all',
    status: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Effet pour charger les données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simuler le chargement des prospects depuis l'API
        // Dans une vraie implémentation, ces données viendraient de Supabase
        
        // Générer des données aléatoires pour la démo
        const industries = ['Tech', 'Finance', 'Retail', 'Healthcare', 'Manufacturing'];
        const locations = ['Paris, France', 'Lyon, France', 'Bordeaux, France', 'Marseille, France', 'Lille, France'];
        const budgets = ['< 200€/mois', '200€-500€/mois', '500€-1000€/mois', '> 1000€/mois'];
        const activities = ['1 jour', '2 jours', '3 jours', '5 jours', '1 semaine'];
        
        // Générer 30 prospects aléatoires
        const mockProspects: Prospect[] = Array.from({ length: 30 }, (_, i) => ({
          id: `prospect-${i+1}`,
          name: `Contact ${i+1}`,
          company: `Entreprise ${i+1}`,
          location: locations[i % locations.length],
          industryInterest: industries[i % industries.length],
          budget: budgets[i % budgets.length],
          matchScore: Math.floor(Math.random() * 41) + 60, // Score entre 60 et 100
          lastActivity: activities[i % activities.length],
          contacted: Math.random() > 0.6,
          notes: Math.random() > 0.5 ? `Notes sur l'entreprise ${i+1}` : undefined,
        }));
        
        // Trier les prospects par score de correspondance
        mockProspects.sort((a, b) => b.matchScore - a.matchScore);
        
        // Recommandations par catégorie
        const recommendations = AGENT_CATEGORIES.slice(0, 3).map((category, index) => {
          const prospectCount = Math.floor(Math.random() * 20) + 5;
          const matchScore = Math.floor(Math.random() * 21) + 80;
          
          return {
            category: category.value,
            categoryLabel: category.label,
            prospectCount,
            matchScore,
            averageBudget: "300€-500€/mois"
          };
        });
        
        setProspects(mockProspects);
        setFilteredProspects(mockProspects);
        setRecommendedCategories(recommendations);
      } catch (error) {
        console.error('Erreur lors du chargement des données de prospection:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);

  // Fonction pour filtrer les prospects
  const applyFilters = () => {
    let result = [...prospects];
    
    // Filtrer par terme de recherche
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(
        p => p.company.toLowerCase().includes(searchLower) || 
             p.name.toLowerCase().includes(searchLower) ||
             p.industryInterest.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrer par industrie
    if (filters.industry !== 'all') {
      result = result.filter(p => p.industryInterest.toLowerCase() === filters.industry);
    }
    
    // Filtrer par budget
    if (filters.budget !== 'all') {
      switch (filters.budget) {
        case 'low':
          result = result.filter(p => p.budget.includes('< 200€'));
          break;
        case 'medium':
          result = result.filter(p => p.budget.includes('200€-500€'));
          break;
        case 'high':
          result = result.filter(p => p.budget.includes('> 500€') || p.budget.includes('500€-1000€') || p.budget.includes('> 1000€'));
          break;
      }
    }
    
    // Filtrer par statut
    if (filters.status !== 'all') {
      const contacted = filters.status === 'contacted';
      result = result.filter(p => p.contacted === contacted);
    }
    
    setFilteredProspects(result);
    setCurrentPage(1); // Reset to first page after filtering
  };

  // Gestionnaire de changement de filtre
  const handleFilterChange = (key: keyof FiltersType, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Gestionnaires d'actions
  const handleViewProfile = (id: string) => {
    console.log(`Voir profil du prospect ${id}`);
    // Dans une vraie implémentation, ceci pourrait ouvrir un modal avec le profil détaillé
  };

  const handleContact = (id: string) => {
    console.log(`Contacter le prospect ${id}`);
    // Dans une vraie implémentation, ceci pourrait ouvrir un modal de contact
  };
  
  const handleExploreCategory = (category: string) => {
    console.log(`Explorer la catégorie ${category}`);
    setFilters(prev => ({ ...prev, industry: category }));
    applyFilters();
  };

  // Pagination
  const paginatedProspects = filteredProspects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
          <ProspectionFilters 
            filters={filters}
            onChange={handleFilterChange}
            onFilter={applyFilters}
            totalProspects={filteredProspects.length}
          />
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
            {recommendedCategories.map((recommendation, index) => (
              <RecommendationCard
                key={recommendation.category}
                category={{
                  value: recommendation.category,
                  label: recommendation.categoryLabel
                }}
                prospectCount={recommendation.prospectCount}
                matchScore={recommendation.matchScore}
                averageBudget={recommendation.averageBudget}
                onExplore={handleExploreCategory}
              />
            ))}
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
                {paginatedProspects.map((prospect) => (
                  <ProspectRow
                    key={prospect.id}
                    prospect={prospect}
                    onViewProfile={handleViewProfile}
                    onContact={handleContact}
                  />
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredProspects.length / itemsPerPage)}
            totalItems={filteredProspects.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </CardBody>
      </Card>
    </div>
  );
}