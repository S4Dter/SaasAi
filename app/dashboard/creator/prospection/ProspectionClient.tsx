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
import ContactModal from './ContactModal';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

// Interface étendue pour correspondre à notre schéma Supabase
interface SupabaseProspect extends Prospect {
  created_at: string;
  updated_at: string;
  creator_id: string;
}

// Interface pour les recommandations de catégorie
interface CategoryRecommendation {
  id: string;
  category: string;
  prospect_count: number;
  match_score: number;
  avg_budget: string;
  created_at: string;
  updated_at: string;
  creator_id: string;
}

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
  
  // État pour le modal de contact
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<{
    id: string;
    name: string;
    company: string;
  } | null>(null);

  // Fonction pour obtenir le label de catégorie à partir de sa valeur
  const getCategoryLabel = (categoryValue: string): string => {
    const category = AGENT_CATEGORIES.find(cat => cat.value.toLowerCase() === categoryValue.toLowerCase());
    return category ? category.label : categoryValue;
  };

  // État pour gérer les erreurs
  const [error, setError] = useState<string | null>(null);

  // Effet pour charger les données
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!userId || !supabase) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }
      
      // Définir un timeout pour éviter le chargement indéfini
      const timeoutId = setTimeout(() => {
        if (isMounted) {
          setLoading(false);
          setError("Le chargement des données prend plus de temps que prévu. L'algorithme de prospects n'est peut-être pas encore implémenté.");
        }
      }, 5000); // 5 secondes de timeout
      
      setLoading(true);
      try {
        // Charger les prospects depuis Supabase
        const { data: prospectsData, error: prospectsError } = await supabase
          .from('prospects')
          .select('*')
          .eq('creator_id', userId)
          .order('match_score', { ascending: false });
          
        if (prospectsError) throw prospectsError;
        
        if (!isMounted) return;
        
        // Vérifier si des données ont été retournées
        if (!prospectsData || prospectsData.length === 0) {
          setProspects([]);
          setFilteredProspects([]);
          setLoading(false);
          clearTimeout(timeoutId);
          return;
        }
        
        // Transformer les données pour correspondre à l'interface Prospect
        const formattedProspects: Prospect[] = prospectsData.map(prospect => ({
          id: prospect.id,
          name: prospect.name,
          company: prospect.company,
          avatar: prospect.avatar || undefined,
          location: prospect.location || undefined,
          industryInterest: prospect.industry_interest,
          budget: prospect.budget,
          matchScore: prospect.match_score,
          lastActivity: getTimeAgo(new Date(prospect.last_activity)),
          contacted: prospect.contacted,
          notes: prospect.notes || undefined,
        }));
        
        // Charger les recommandations par catégorie
        const { data: recommendationsData, error: recommendationsError } = await supabase
          .from('category_recommendations')
          .select('*')
          .eq('creator_id', userId);
          
        if (recommendationsError) throw recommendationsError;
        
        if (!isMounted) return;
        
        // Transformer les données pour l'affichage
        const formattedRecommendations = recommendationsData ? recommendationsData.map(rec => ({
          category: rec.category,
          categoryLabel: getCategoryLabel(rec.category),
          prospectCount: rec.prospect_count,
          matchScore: rec.match_score,
          averageBudget: rec.avg_budget
        })) : [];
        
        setProspects(formattedProspects);
        setFilteredProspects(formattedProspects);
        setRecommendedCategories(formattedRecommendations);
        setError(null);
      } catch (error) {
        if (isMounted) {
          console.error('Erreur lors du chargement des données de prospection:', error);
          setError("Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.");
        }
      } finally {
        if (isMounted) {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    // Nettoyage lors du démontage du composant
    return () => {
      isMounted = false;
    };
  }, [userId]);
  
  // Fonction pour formater la date relative (temps écoulé)
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        return 'moins d\'une heure';
      }
      return `${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else if (diffDays < 30) {
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks} semaine${diffWeeks > 1 ? 's' : ''}`;
    } else {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} mois`;
    }
  };

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
    setCurrentPage(1); // Réinitialiser à la première page après filtrage
  };

  // Gestionnaire de changement de filtre
  const handleFilterChange = (key: keyof FiltersType, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Gestionnaires d'actions
  const handleViewProfile = async (id: string) => {
    try {
      // Enregistrer cette activité dans Supabase
      if (userId && supabase) {
        // Mettre à jour le champ last_activity du prospect
        await supabase
          .from('prospects')
          .update({ 
            last_activity: new Date().toISOString(),
            last_activity_type: 'profile_view'
          })
          .eq('id', id);
      }
      
      // Trouver le prospect pour afficher ses détails
      const prospect = prospects.find(p => p.id === id);
      if (prospect) {
        alert(`Profil de ${prospect.company}\n\nNom: ${prospect.name}\nSecteur: ${prospect.industryInterest}\nBudget: ${prospect.budget}\nScore: ${prospect.matchScore}%\nNotes: ${prospect.notes || 'Aucune note'}`);
      }
    } catch (error) {
      console.error('Erreur lors de la consultation du profil:', error);
    }
  };

  const handleContact = (id: string) => {
    // Trouver le prospect à contacter
    const prospect = prospects.find(p => p.id === id);
    if (prospect) {
      setSelectedProspect({
        id: prospect.id,
        name: prospect.name,
        company: prospect.company
      });
      setContactModalOpen(true);
    }
  };
  
  const handleContactSubmit = async (prospectId: string, message: string) => {
    try {
      if (!userId || !supabase) return;
      
      // Mettre à jour le statut du prospect comme contacté
      await supabase
        .from('prospects')
        .update({ 
          contacted: true,
          last_activity: new Date().toISOString(),
          last_activity_type: 'contact_creator',
          notes: (prospects.find(p => p.id === prospectId)?.notes || '') + `\n\n[${new Date().toLocaleString()}] Message envoyé: ${message}`
        })
        .eq('id', prospectId);
      
      // Ajouter une activité
      await supabase
        .from('prospect_activities')
        .insert({
          prospect_id: prospectId,
          creator_id: userId,
          activity_type: 'contact_creator',
          description: `Message envoyé: ${message.substring(0, 50)}...`
        });
      
      // Rafraîchir les données
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .eq('creator_id', userId)
        .order('match_score', { ascending: false });
        
      if (error) throw error;
      
      // Mettre à jour la liste des prospects
      const updatedProspects: Prospect[] = data.map(prospect => ({
        id: prospect.id,
        name: prospect.name,
        company: prospect.company,
        avatar: prospect.avatar || undefined,
        location: prospect.location || undefined,
        industryInterest: prospect.industry_interest,
        budget: prospect.budget,
        matchScore: prospect.match_score,
        lastActivity: getTimeAgo(new Date(prospect.last_activity)),
        contacted: prospect.contacted,
        notes: prospect.notes || undefined,
      }));
      
      setProspects(updatedProspects);
      applyFilters();
      
      alert('Message envoyé avec succès!');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    }
  };
  
  const handleExploreCategory = (category: string) => {
    setFilters(prev => ({ ...prev, industry: category }));
    // Appliquer les filtres après avoir défini le filtre d'industrie
    setTimeout(applyFilters, 0);
  };

  // Pagination
  const paginatedProspects = filteredProspects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Chargement des données de prospection...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 w-full max-w-2xl">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {error}
              </p>
              <p className="mt-2 text-xs text-yellow-600">
                Vous pouvez ajouter des données de test en utilisant le script fourni dans le README.
              </p>
            </div>
          </div>
        </div>
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
            {recommendedCategories.length > 0 ? (
              recommendedCategories.map((recommendation, index) => (
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
              ))
            ) : (
              <div className="col-span-3 text-center py-6 text-gray-500">
                Aucune recommandation disponible. Ajoutez des agents ou prospects pour générer des recommandations.
              </div>
            )}
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
          {filteredProspects.length > 0 ? (
            <>
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
            </>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun prospect disponible</h3>
              <p className="mt-1 text-sm text-gray-500">
                L'algorithme de recommandation de prospects n'est pas encore implémenté ou aucun prospect ne correspond à vos critères.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => window.location.reload()}
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Rafraîchir
                </button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
      
      {/* Modal de contact */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        prospect={selectedProspect}
        onSubmit={handleContactSubmit}
      />
    </div>
  );
}
