'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import Button from '@/components/ui/Button';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { ProspectActivity } from '@/types/prospection';

interface ActivityTimelineProps {
  isOpen: boolean;
  onClose: () => void;
  prospectId: string;
}

export default function ActivityTimeline({
  isOpen,
  onClose,
  prospectId
}: ActivityTimelineProps) {
  const [activities, setActivities] = useState<ProspectActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const supabase = createBrowserSupabaseClient();
  
  const ITEMS_PER_PAGE = 10;

  // Fonction pour charger les activités du prospect
  const loadActivities = async (pageNumber: number = 1) => {
    if (pageNumber === 1) {
      setIsLoading(true);
    }
    
    try {
      // Charger les activités paginées de Supabase
      const { data, error, count } = await supabase
        .from('prospect_activities')
        .select('*', { count: 'exact' })
        .eq('prospect_id', prospectId)
        .order('created_at', { ascending: false })
        .range((pageNumber - 1) * ITEMS_PER_PAGE, pageNumber * ITEMS_PER_PAGE - 1);
      
      if (error) throw error;
      
      if (pageNumber === 1) {
        setActivities(data || []);
      } else {
        setActivities(prev => [...prev, ...(data || [])]);
      }
      
      // Vérifier s'il y a plus de données à charger
      if (count) {
        setHasMore(pageNumber * ITEMS_PER_PAGE < count);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des activités:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Charger les activités au montage et quand prospectId change
  useEffect(() => {
    if (isOpen && prospectId) {
      setPage(1);
      loadActivities(1);
    }
  }, [isOpen, prospectId]);
  
  // Fonction pour charger plus d'activités
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadActivities(nextPage);
  };
  
  // Fonction pour rendre l'icône en fonction du type d'activité
  const renderActivityIcon = (type: ProspectActivity['type']) => {
    switch (type) {
      case 'profile_view':
        return (
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        );
      case 'agent_view':
        return (
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
              <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
              <path d="M8 16h.01" />
              <path d="M8 20h.01" />
              <path d="M12 18h.01" />
              <path d="M12 22h.01" />
              <path d="M16 16h.01" />
              <path d="M16 20h.01" />
            </svg>
          </div>
        );
      case 'contact_creator':
        return (
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
        );
      case 'email_sent':
        return (
          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
              <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
        );
      case 'email_opened':
        return (
          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
              <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
              <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
            </svg>
          </div>
        );
      case 'email_clicked':
        return (
          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
              <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>
        );
    }
  };
  
  // Fonction pour formater le texte de l'activité
  const formatActivityText = (activity: ProspectActivity) => {
    switch (activity.type) {
      case 'profile_view':
        return "A consulté la page de votre profil";
      case 'agent_view':
        return "A consulté la page d'un de vos agents";
      case 'contact_creator':
        return "Vous a contacté directement";
      case 'email_sent':
        return "Email envoyé au prospect";
      case 'email_opened':
        return "A ouvert votre email";
      case 'email_clicked':
        return "A cliqué sur un lien dans votre email";
      default:
        return "Activité inconnue";
    }
  };
  
  // TODO: Intégrer le polling ou webhook n8n pour maj temps réel du statut email
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent size="lg">
        <SheetHeader className="pb-6">
          <SheetTitle>Historique des activités</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="sm" className="absolute top-4 right-4">
              Fermer
            </Button>
          </SheetClose>
        </SheetHeader>
        
        {isLoading && activities.length === 0 ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-8 w-8 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
          </div>
        ) : activities.length > 0 ? (
          <div className="relative">
            {/* Ligne verticale de la timeline */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <div key={activity.id} className="relative flex items-start gap-3 pl-10">
                  {/* Icône + point sur la timeline */}
                  <div className="absolute left-0 mt-1">
                    {renderActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-gray-900">
                        {formatActivityText(activity)}
                      </p>
                      <time className="text-xs text-gray-500">
                        {new Date(activity.created_at).toLocaleString()}
                      </time>
                    </div>
                    
                    {activity.details && (
                      <p className="mt-1 text-sm text-gray-600">{activity.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {hasMore && (
              <div className="flex justify-center mt-6">
                <Button 
                  variant="outline" 
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? 'Chargement...' : 'Charger plus'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune activité</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucune activité n'a été enregistrée pour ce prospect.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
