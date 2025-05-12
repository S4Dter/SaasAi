'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { 
  AlertTriangle, Check, X, Eye, ExternalLink, 
  MessageSquare, Clock, CheckCircle, XCircle
} from 'lucide-react';
import Link from 'next/link';
import { updateReportStatus } from '@/lib/api/admin';
import { ROUTES } from '@/constants';

// Types pour les rapports et filtres
type Report = {
  id: string;
  reason: string;
  description?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  reviewed_at?: string;
  admin_notes?: string;
  resolution?: string;
  agent?: {
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
  };
  reporter?: {
    id: string;
    name: string;
    email: string;
  };
  admin?: {
    id: string;
    name: string;
    email: string;
  };
};

type Filters = {
  status?: string;
};

interface ReportManagementClientProps {
  initialReports: Report[];
  totalReports: number;
  currentPage: number;
  totalPages: number;
  initialFilters: Filters;
}

export default function ReportManagementClient({
  initialReports,
  totalReports,
  currentPage,
  totalPages,
  initialFilters,
}: ReportManagementClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // État local
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [resolution, setResolution] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Options de filtrage
  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'reviewed', label: 'Examinés' },
    { value: 'dismissed', label: 'Rejetés' },
    { value: 'actioned', label: 'Traités' },
  ];

  // Formatter les dates pour l'affichage
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Mettre à jour l'URL avec les filtres
  const updateURLParams = (newFilters: Filters, page: number = 1) => {
    const params = new URLSearchParams();
    
    if (newFilters.status) params.set('status', newFilters.status);
    if (page > 1) params.set('page', page.toString());
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // Gestionnaire de changement de filtre
  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    const newFilters = { ...filters, [filterType]: value === '' ? undefined : value };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  // Gestionnaire de changement de page
  const handlePageChange = (page: number) => {
    updateURLParams(filters, page);
  };

  // Ouvrir le modal de détails
  const openDetailModal = (report: Report) => {
    setSelectedReport(report);
    setAdminNotes(report.admin_notes || '');
    setResolution(report.resolution || '');
    setShowDetailModal(true);
    setShowReviewForm(false);
  };

  // Fermer le modal de détails
  const closeDetailModal = () => {
    setSelectedReport(null);
    setAdminNotes('');
    setResolution('');
    setShowDetailModal(false);
    setShowReviewForm(false);
  };

  // Actions sur les signalements
  const handleUpdateReportStatus = async (reportId: string, status: 'pending' | 'reviewed' | 'dismissed' | 'actioned') => {
    try {
      setIsLoading(true);
      
      await updateReportStatus(
        reportId, 
        status, 
        adminNotes || undefined, 
        resolution || undefined
      );
      
      // Mettre à jour l'état local après succès
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId 
            ? { 
                ...report, 
                status,
                admin_notes: adminNotes || report.admin_notes,
                resolution: resolution || report.resolution,
                reviewed_at: new Date().toISOString(),
              } 
            : report
        )
      );

      // Fermer le modal si ouvert
      if (showDetailModal) {
        closeDetailModal();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du signalement:', error);
      alert(`Erreur lors de la mise à jour du signalement: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Raccourci pour tronquer un texte long
  const truncateText = (text?: string, maxLength: number = 50): string => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Composant pour les badges de statut
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'actioned':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Traité
          </span>
        );
      case 'dismissed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 flex items-center">
            <XCircle className="h-3 w-3 mr-1" />
            Rejeté
          </span>
        );
      case 'reviewed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            Examiné
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="w-64">
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Statut
          </label>
          <select
            id="statusFilter"
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tableau des signalements */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Agent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Motif
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Signalé par
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {report.agent?.logo_url ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={report.agent.logo_url}
                            alt={report.agent.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {report.agent?.name || 'Agent inconnu'}
                        </div>
                        {report.agent?.slug && (
                          <Link
                            href={ROUTES.AGENT_DETAILS(report.agent.slug)}
                            target="_blank"
                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                          >
                            Voir l'agent
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {report.reason}
                    </div>
                    {report.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {truncateText(report.description, 100)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {report.reporter?.name || 'Utilisateur inconnu'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {report.reporter?.email || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatDate(report.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => openDetailModal(report)}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                      disabled={isLoading}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Détails
                    </button>
                    
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setAdminNotes('');
                            setResolution('Ce signalement ne nécessite pas d\'action.');
                            setShowReviewForm(true);
                            setShowDetailModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 inline-flex items-center ml-2"
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rejeter
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setAdminNotes('');
                            setResolution('');
                            setShowReviewForm(true);
                            setShowDetailModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 inline-flex items-center ml-2"
                          disabled={isLoading}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Traiter
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              
              {reports.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Aucun signalement trouvé avec les filtres actuels
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Affichage de {reports.length} signalements sur {totalReports}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              className={`px-3 py-1 rounded-md ${
                currentPage <= 1
                  ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Précédent
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logique pour limiter le nombre de pages affichées
              let pageToShow;
              if (totalPages <= 5) {
                pageToShow = i + 1;
              } else if (currentPage <= 3) {
                pageToShow = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageToShow = totalPages - 4 + i;
              } else {
                pageToShow = currentPage - 2 + i;
              }
              
              // Afficher seulement si la page à montrer est valide
              if (pageToShow > 0 && pageToShow <= totalPages) {
                return (
                  <button
                    key={pageToShow}
                    onClick={() => handlePageChange(pageToShow)}
                    disabled={isLoading}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === pageToShow
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {pageToShow}
                  </button>
                );
              }
              return null;
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className={`px-3 py-1 rounded-md ${
                currentPage >= totalPages
                  ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Modal de détails du signalement */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full p-6 shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                Détails du signalement
              </h3>
              
              <button
                onClick={closeDetailModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agent signalé</h4>
                <div className="flex items-center">
                  {selectedReport.agent?.logo_url ? (
                    <img
                      className="h-10 w-10 rounded-full mr-2"
                      src={selectedReport.agent.logo_url}
                      alt={selectedReport.agent.name}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-2">
                      <AlertTriangle className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                    </div>
                  )}
                  <div>
                    <div className="text-gray-900 dark:text-white">
                      {selectedReport.agent?.name || 'Agent inconnu'}
                    </div>
                    {selectedReport.agent?.slug && (
                      <Link
                        href={ROUTES.AGENT_DETAILS(selectedReport.agent.slug)}
                        target="_blank"
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                      >
                        Voir l'agent
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Signalé par</h4>
                <div className="text-gray-900 dark:text-white">
                  {selectedReport.reporter?.name || 'Utilisateur inconnu'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedReport.reporter?.email || ''}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</h4>
                <StatusBadge status={selectedReport.status} />
                {selectedReport.admin && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Traité par: {selectedReport.admin.name} le {formatDate(selectedReport.reviewed_at)}
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de signalement</h4>
                <div className="text-gray-900 dark:text-white">
                  {formatDate(selectedReport.created_at)}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Motif du signalement</h4>
              <div className="text-gray-900 dark:text-white font-medium">
                {selectedReport.reason}
              </div>
            </div>
            
            {selectedReport.description && (
              <div className="mb-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</h4>
                <div className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {selectedReport.description}
                </div>
              </div>
            )}
            
            {(selectedReport.admin_notes || selectedReport.resolution) && (
              <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes de modération</h4>
                {selectedReport.admin_notes && (
                  <div className="text-gray-900 dark:text-white whitespace-pre-wrap mb-2">
                    <strong>Notes internes:</strong> {selectedReport.admin_notes}
                  </div>
                )}
                {selectedReport.resolution && (
                  <div className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    <strong>Résolution:</strong> {selectedReport.resolution}
                  </div>
                )}
              </div>
            )}
            
            {showReviewForm && (
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Traiter ce signalement</h4>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes administratives (internes)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Notes internes pour les administrateurs"
                    disabled={isLoading}
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Résolution (visible par l'utilisateur ayant signalé)
                  </label>
                  <textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Message de résolution pour l'utilisateur"
                    disabled={isLoading}
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={closeDetailModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    disabled={isLoading}
                  >
                    Annuler
                  </button>
                  
                  <button
                    onClick={() => handleUpdateReportStatus(selectedReport.id, 'dismissed')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    disabled={isLoading || (!adminNotes.trim() && !resolution.trim())}
                  >
                    {isLoading ? 'En cours...' : 'Rejeter le signalement'}
                  </button>
                  
                  <button
                    onClick={() => handleUpdateReportStatus(selectedReport.id, 'actioned')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    disabled={isLoading || (!adminNotes.trim() && !resolution.trim())}
                  >
                    {isLoading ? 'En cours...' : 'Marquer comme traité'}
                  </button>
                </div>
              </div>
            )}
            
            {!showReviewForm && selectedReport.status === 'pending' && (
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => {
                    setAdminNotes('');
                    setResolution('Ce signalement ne nécessite pas d\'action.');
                    setShowReviewForm(true);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-1 inline" />
                  Rejeter
                </button>
                
                <button
                  onClick={() => {
                    setAdminNotes('');
                    setResolution('');
                    setShowReviewForm(true);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 mr-1 inline" />
                  Traiter
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
