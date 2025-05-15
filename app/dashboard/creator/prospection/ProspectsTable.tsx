'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Prospect } from '@/types/prospection';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { useGenerateEmail } from './hooks/useGenerateEmail';
import EmailDraftDrawer from './EmailDraftDrawer';
import ActivityTimeline from './ActivityTimeline';

interface ProspectsTableProps {
  initialData: Prospect[];
}

export default function ProspectsTable({ initialData }: ProspectsTableProps) {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const { generateEmail, isLoading } = useGenerateEmail();

  // États pour les prospects et le filtrage
  const [prospects, setProspects] = useState<Prospect[]>(initialData);
  const [filteredProspects, setFilteredProspects] = useState<Prospect[]>(initialData);
  const [filters, setFilters] = useState({
    industry: 'all',
    budget: 'all'
  });

  // États pour les modales/drawers
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [emailDraftOpen, setEmailDraftOpen] = useState(false);
  const [activityTimelineOpen, setActivityTimelineOpen] = useState(false);
  const [emailDraft, setEmailDraft] = useState<string>('');

  // Effet pour appliquer les filtres
  useEffect(() => {
    let result = [...prospects];
    
    if (filters.industry !== 'all') {
      result = result.filter(p => p.industry_interest === filters.industry);
    }
    
    if (filters.budget !== 'all') {
      result = result.filter(p => p.budget === filters.budget);
    }
    
    setFilteredProspects(result);
  }, [prospects, filters]);

  // Effet pour la souscription Supabase Realtime
  useEffect(() => {
    const channel = supabase
      .channel('prospection-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'prospects'
      }, payload => {
        // Mettre à jour le prospect concerné
        if (payload.eventType === 'INSERT') {
          setProspects(prev => [...prev, payload.new as Prospect]);
        } else if (payload.eventType === 'UPDATE') {
          setProspects(prev => 
            prev.map(p => p.id === payload.new.id ? { ...p, ...payload.new as Prospect } : p)
          );
        } else if (payload.eventType === 'DELETE') {
          setProspects(prev => prev.filter(p => p.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Handler pour générer un email pour un prospect
  const handleGenerateEmail = async (prospect: Prospect) => {
    try {
      setSelectedProspect(prospect);
      const email = await generateEmail(prospect.id);
      setEmailDraft(email);
      setEmailDraftOpen(true);
    } catch (error) {
      console.error('Erreur lors de la génération de l\'email:', error);
      // Ici vous pourriez afficher un toast d'erreur
    }
  };

  // Handler pour voir les activités d'un prospect
  const handleViewActivities = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setActivityTimelineOpen(true);
  };

  // Rendu du score de compatibilité avec un badge de couleur
  const renderMatchScore = (score: number) => {
    let color;
    if (score >= 80) color = 'bg-green-100 text-green-800';
    else if (score >= 50) color = 'bg-yellow-100 text-yellow-800';
    else color = 'bg-red-100 text-red-800';

    return (
      <Badge className={color}>
        {score}%
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Secteur
          </label>
          <select
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={filters.industry}
            onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
          >
            <option value="all">Tous les secteurs</option>
            <option value="tech">Technologie</option>
            <option value="finance">Finance</option>
            <option value="healthcare">Santé</option>
            <option value="education">Éducation</option>
            <option value="retail">Commerce</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget
          </label>
          <select
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={filters.budget}
            onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
          >
            <option value="all">Tous les budgets</option>
            <option value="low">Moins de 500€</option>
            <option value="medium">500€ - 2000€</option>
            <option value="high">Plus de 2000€</option>
          </select>
        </div>
      </div>

      {/* Tableau de prospects */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Société
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Secteur
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacté
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière activité
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProspects.length > 0 ? (
                filteredProspects.map((prospect) => (
                  <tr key={prospect.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {prospect.avatar ? (
                          <img
                            className="h-8 w-8 rounded-full mr-3"
                            src={prospect.avatar}
                            alt={prospect.name}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-xs font-medium text-gray-500">
                              {prospect.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="text-sm font-medium text-gray-900">
                          {prospect.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prospect.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prospect.industry_interest}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prospect.budget}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderMatchScore(prospect.match_score)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={prospect.contacted}
                        readOnly
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prospect.last_activity ? new Date(prospect.last_activity).toLocaleDateString() : 'Aucune'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateEmail(prospect)}
                          disabled={isLoading}
                        >
                          {isLoading && selectedProspect?.id === prospect.id ? 'Génération...' : 'Brouillon'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewActivities(prospect)}
                        >
                          Activités
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun prospect trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer pour l'aperçu du brouillon d'email */}
      {selectedProspect && (
        <>
          <EmailDraftDrawer
            isOpen={emailDraftOpen}
            onClose={() => setEmailDraftOpen(false)}
            prospect={selectedProspect}
            emailContent={emailDraft}
          />
          
          <ActivityTimeline
            isOpen={activityTimelineOpen}
            onClose={() => setActivityTimelineOpen(false)}
            prospectId={selectedProspect.id}
          />
        </>
      )}
    </div>
  );
}
