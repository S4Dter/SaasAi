'use client';
import React, { useState, useEffect } from 'react';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { CrmProspect, EmailGenerationParams, EmailResponse } from '@/types/crm';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { generateEmailWithN8n } from '@/lib/services/n8n-service';
// Importer les composants nécessaires
import Pagination from '../prospection/Pagination';

// Définir des interfaces pour les composants temporaires
interface CrmFiltersProps {
  filters: FiltersType;
  onChange: (key: keyof FiltersType, value: string) => void;
  onFilter: () => void;
  totalProspects: number;
}

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: CrmProspect;
  onSubmit: (agentData: any) => void;
  isLoading: boolean;
  emailContent: string | null;
  selectedAgent: any;
}

interface EmailListModalProps {
  isOpen: boolean;
  onClose: () => void;
  prospects: CrmProspect[];
}

// Composants temporaires pour éviter les erreurs TS
const CrmFilters: React.FC<CrmFiltersProps> = ({ filters, onChange, onFilter, totalProspects }) => (
  <div className="p-4 bg-white rounded-md">
    <h3 className="text-md font-medium mb-4">Filtres de recherche</h3>
    <div className="flex flex-wrap gap-4 mb-4">
      <input
        type="text"
        className="p-2 border rounded"
        placeholder="Rechercher..."
        value={filters.searchTerm}
        onChange={(e) => onChange('searchTerm', e.target.value)}
      />
      <select 
        className="p-2 border rounded"
        value={filters.secteur}
        onChange={(e) => onChange('secteur', e.target.value)}
      >
        <option value="all">Tous les secteurs</option>
        <option value="finance">Finance</option>
        <option value="technologie">Technologie</option>
        <option value="sante">Santé</option>
      </select>
      <button 
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={onFilter}
      >
        Filtrer ({totalProspects})
      </button>
    </div>
  </div>
);

const CrmProspectRow: React.FC<{
  prospect: CrmProspect;
  onGenerateEmail: () => void;
  onToggleEmailSent: (value: boolean) => void;
}> = ({ prospect, onGenerateEmail, onToggleEmailSent }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4">{prospect.prospect_name}</td>
    <td className="px-6 py-4">{prospect.secteur}</td>
    <td className="px-6 py-4">{prospect.budget_estime}</td>
    <td className="px-6 py-4">{prospect.taille_entreprise}</td>
    <td className="px-6 py-4">{prospect.besoins || 'N/A'}</td>
    <td className="px-6 py-4">{prospect.compatibilite}%</td>
    <td className="px-6 py-4">
      <input 
        type="checkbox" 
        checked={prospect.email_envoye} 
        onChange={(e) => onToggleEmailSent(e.target.checked)}
      />
    </td>
    <td className="px-6 py-4">{prospect.statut_email}</td>
    <td className="px-6 py-4">
      <button 
        className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        onClick={onGenerateEmail}
      >
        Générer email
      </button>
    </td>
  </tr>
);

const EmailModal: React.FC<EmailModalProps> = (props) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Générer un email</h2>
      {props.emailContent ? (
        <div>
          <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">{props.emailContent}</pre>
          <div className="mt-4 flex justify-end">
            <button 
              className="px-4 py-2 bg-gray-200 rounded mr-2"
              onClick={props.onClose}
            >
              Fermer
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p>Email en cours de génération...</p>
          <div className="mt-4 flex justify-end">
            <button 
              className="px-4 py-2 bg-gray-200 rounded mr-2"
              onClick={props.onClose}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);

const EmailListModal: React.FC<EmailListModalProps> = ({ isOpen, onClose, prospects }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Emails envoyés</h2>
        {prospects.length === 0 ? (
          <p>Aucun email envoyé</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left">Prospect</th>
                <th className="px-6 py-3 text-left">Date d'envoi</th>
                <th className="px-6 py-3 text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              {prospects.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{p.prospect_name}</td>
                  <td className="px-6 py-4">{p.email_date ? new Date(p.email_date).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4">{p.statut_email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="mt-4 flex justify-end">
          <button 
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

interface FiltersType {
  searchTerm: string;
  secteur: string;
  budget: string;
  statut: string;
}

export default function CrmClient() {
  const { user } = useAuth();
  const userId = user?.id;

  // États pour les prospects
  const [loading, setLoading] = useState(true);
  const [prospects, setProspects] = useState<CrmProspect[]>([]);
  const [filteredProspects, setFilteredProspects] = useState<CrmProspect[]>([]);
  
  // États pour les filtres et la pagination
  const [filters, setFilters] = useState<FiltersType>({
    searchTerm: '',
    secteur: 'all',
    budget: 'all',
    statut: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // États pour les modales
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailListModalOpen, setEmailListModalOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<CrmProspect | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<{
    id: string;
    name: string;
    sector: string;
    price: string;
    features: string[];
  } | null>(null);
  
  // État pour la génération d'emails
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [emailContent, setEmailContent] = useState<string | null>(null);
  
  // État pour les erreurs
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
          setError("Le chargement des données prend plus de temps que prévu.");
        }
      }, 5000); // 5 secondes de timeout
      
      setLoading(true);
      try {
        // Charger les prospects depuis Supabase
        const { data: prospectsData, error: prospectsError } = await supabase
          .from('crm')
          .select('*')
          .eq('user_id', userId)
          .order('compatibilite', { ascending: false });
          
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
        
        setProspects(prospectsData);
        setFilteredProspects(prospectsData);
        setError(null);
      } catch (error) {
        if (isMounted) {
          console.error('Erreur lors du chargement des données CRM:', error);
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

  // Fonction pour filtrer les prospects
  const applyFilters = () => {
    let result = [...prospects];
    
    // Filtrer par terme de recherche
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(
        p => p.prospect_name.toLowerCase().includes(searchLower) || 
             p.secteur.toLowerCase().includes(searchLower) ||
             (p.besoins && p.besoins.toLowerCase().includes(searchLower))
      );
    }
    
    // Filtrer par secteur
    if (filters.secteur !== 'all') {
      result = result.filter(p => p.secteur.toLowerCase() === filters.secteur.toLowerCase());
    }
    
    // Filtrer par budget
    if (filters.budget !== 'all') {
      switch (filters.budget) {
        case 'low':
          result = result.filter(p => p.budget_estime.includes('< 200€'));
          break;
        case 'medium':
          result = result.filter(p => p.budget_estime.includes('200€-500€'));
          break;
        case 'high':
          result = result.filter(p => p.budget_estime.includes('> 500€') || p.budget_estime.includes('500€-1000€') || p.budget_estime.includes('> 1000€'));
          break;
      }
    }
    
    // Filtrer par statut
    if (filters.statut !== 'all') {
      if (filters.statut === 'envoye') {
        result = result.filter(p => p.email_envoye);
      } else {
        result = result.filter(p => !p.email_envoye);
      }
    }
    
    setFilteredProspects(result);
    setCurrentPage(1); // Réinitialiser à la première page après filtrage
  };

  // Gestionnaire de changement de filtre
  const handleFilterChange = (key: keyof FiltersType, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Gestionnaire pour générer un email
  const handleGenerateEmail = (prospect: CrmProspect) => {
    setSelectedProspect(prospect);
    setEmailModalOpen(true);
  };

  // Gestionnaire pour voir les emails envoyés
  const handleViewSentEmails = () => {
    setEmailListModalOpen(true);
  };

  // Fonction pour marquer un email comme envoyé
  const handleToggleEmailSent = async (prospectId: string, value: boolean) => {
    try {
      if (!userId || !supabase) return;
      
      const updateData: Partial<CrmProspect> = {
        email_envoye: value,
      };
      
      if (value) {
        updateData.email_date = new Date().toISOString();
        updateData.statut_email = 'envoye';
      }
      
      const { error } = await supabase
        .from('crm')
        .update(updateData)
        .eq('id', prospectId)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // Mettre à jour l'état local
      setProspects(prev =>
        prev.map(p =>
          p.id === prospectId
            ? { ...p, ...updateData }
            : p
        )
      );
      
      // Mettre à jour également les prospects filtrés
      setFilteredProspects(prev =>
        prev.map(p =>
          p.id === prospectId
            ? { ...p, ...updateData }
            : p
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut d\'email:', error);
      setError("Une erreur est survenue lors de la mise à jour du statut d'email.");
    }
  };

  // Gestionnaire pour soumettre la génération d'email
  const handleEmailGeneration = async (agentData: {
    id: string;
    name: string;
    sector: string;
    price: string;
    features: string[];
  }) => {
    if (!selectedProspect) return;
    
    setGeneratingEmail(true);
    setSelectedAgent(agentData);
    
    try {
      const params: EmailGenerationParams = {
        prospect_id: selectedProspect.id,
        prospect_name: selectedProspect.prospect_name,
        secteur: selectedProspect.secteur,
        budget_estime: selectedProspect.budget_estime,
        taille_entreprise: selectedProspect.taille_entreprise,
        besoins: selectedProspect.besoins,
        agent_id: agentData.id,
        agent_nom: agentData.name,
        agent_secteur: agentData.sector,
        agent_fonctionalites: agentData.features,
        agent_prix: agentData.price
      };
      
      const response = await generateEmailWithN8n(params);
      
      if (response.success && response.email_content) {
        setEmailContent(response.email_content);
        
        // Mettre à jour l'état local des prospects
        const emailContent = response.email_content || null;
        
        if (userId && supabase) {
          // Mettre à jour dans Supabase
          await supabase
            .from('crm')
            .update({
              email_contenu: emailContent,
              statut_email: 'en_attente'
            })
            .eq('id', selectedProspect.id)
            .eq('user_id', userId);
        }
        
        // Mettre à jour localement
        setProspects(prev =>
          prev.map(p =>
            p.id === selectedProspect.id
              ? { ...p, email_contenu: emailContent, statut_email: 'en_attente' as const }
              : p
          )
        );
        
        setFilteredProspects(prev =>
          prev.map(p =>
            p.id === selectedProspect.id
              ? { ...p, email_contenu: emailContent, statut_email: 'en_attente' as const }
              : p
          )
        );
      } else {
        setError(response.error || 'Une erreur est survenue lors de la génération de l\'email.');
      }
    } catch (error) {
      console.error('Erreur lors de la génération de l\'email:', error);
      setError('Une erreur est survenue lors de la génération de l\'email.');
    } finally {
      setGeneratingEmail(false);
    }
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
                Assurez-vous que la table CRM est bien configurée dans Supabase.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Prospection</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos prospects et générez des emails personnalisés
          </p>
        </div>
        <div>
          <Button 
            variant="outline" 
            className="mr-2"
            onClick={handleViewSentEmails}
          >
            Lister les emails envoyés
          </Button>
        </div>
      </div>
      
      {/* Filtres de recherche */}
      <Card className="mb-6">
        <CardBody className="p-4">
          <CrmFilters 
            filters={filters}
            onChange={handleFilterChange}
            onFilter={applyFilters}
            totalProspects={filteredProspects.length}
          />
        </CardBody>
      </Card>
      
      {/* Liste des prospects */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">
            Liste des prospects ({filteredProspects.length})
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
                        Nom du prospect
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Secteur
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Budget estimé
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Taille entreprise
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Besoins
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Compatibilité
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email envoyé
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
                      <CrmProspectRow
                        key={prospect.id}
                        prospect={prospect}
                        onGenerateEmail={() => handleGenerateEmail(prospect)}
                        onToggleEmailSent={(value) => handleToggleEmailSent(prospect.id, value)}
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
                Ajoutez des prospects dans votre CRM pour les voir apparaître ici.
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
      
      {/* Modals */}
      {emailModalOpen && selectedProspect && (
        <EmailModal
          isOpen={emailModalOpen}
          onClose={() => {
            setEmailModalOpen(false);
            setSelectedProspect(null);
            setEmailContent(null);
            setSelectedAgent(null);
          }}
          prospect={selectedProspect}
          onSubmit={handleEmailGeneration}
          isLoading={generatingEmail}
          emailContent={emailContent}
          selectedAgent={selectedAgent}
        />
      )}
      
      {emailListModalOpen && (
        <EmailListModal
          isOpen={emailListModalOpen}
          onClose={() => setEmailListModalOpen(false)}
          prospects={prospects.filter(p => p.email_envoye)}
        />
      )}
    </div>
  );
}
