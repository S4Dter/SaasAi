'use client';
import React from 'react';
import { CrmProspect } from '@/types/crm';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface EmailListModalProps {
  isOpen: boolean;
  onClose: () => void;
  prospects: CrmProspect[];
}

export default function EmailListModal({ isOpen, onClose, prospects }: EmailListModalProps) {
  // Fonction pour formatter la date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return 'Date invalide';
    }
  };
  
  // Fonction pour obtenir la classe CSS du badge de statut
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'envoye':
        return 'bg-green-100 text-green-800';
      case 'ouvert':
        return 'bg-blue-100 text-blue-800';
      case 'repondu':
        return 'bg-purple-100 text-purple-800';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Fonction pour obtenir le texte du badge de statut
  const getStatusBadgeText = (status: string): string => {
    switch (status) {
      case 'non_envoye':
        return 'Non envoyé';
      case 'en_attente':
        return 'En attente';
      case 'envoye':
        return 'Envoyé';
      case 'ouvert':
        return 'Ouvert';
      case 'repondu':
        return 'Répondu';
      default:
        return status;
    }
  };
  
  // Si la modale n'est pas ouverte, ne rien afficher
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Liste des emails envoyés
                </h3>
                
                {prospects.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    <p>Aucun email envoyé pour le moment.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Prospect
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Secteur
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date d'envoi
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
                                  {prospect.prospect_name.charAt(0)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {prospect.prospect_name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className="bg-blue-100 text-blue-800">
                                {prospect.secteur}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(prospect.email_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={getStatusBadgeClass(prospect.statut_email)}>
                                {getStatusBadgeText(prospect.statut_email)}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                className="text-blue-600 hover:text-blue-900 cursor-pointer"
                                onClick={() => {
                                  if (prospect.email_contenu) {
                                    alert(`Email envoyé à ${prospect.prospect_name}:\n\n${prospect.email_contenu}`);
                                  } else {
                                    alert('Contenu de l\'email non disponible');
                                  }
                                }}
                              >
                                Voir l'email
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
