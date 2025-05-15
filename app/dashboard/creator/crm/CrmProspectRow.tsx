'use client';
import React from 'react';
import { CrmProspect } from '@/types/crm';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CrmProspectRowProps {
  prospect: CrmProspect;
  onGenerateEmail: () => void;
  onToggleEmailSent: (value: boolean) => void;
}

export default function CrmProspectRow({ prospect, onGenerateEmail, onToggleEmailSent }: CrmProspectRowProps) {
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

  return (
    <tr className="hover:bg-gray-50">
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
        {prospect.budget_estime}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {prospect.taille_entreprise}
      </td>
      
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
        <div className="truncate">
          {prospect.besoins || 'Non spécifié'}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className="text-sm text-gray-900 mr-2">{prospect.compatibilite}%</span>
          <div className="w-24 bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                prospect.compatibilite > 80 ? 'bg-green-500' : 
                prospect.compatibilite > 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`} 
              style={{ width: `${prospect.compatibilite}%` }}
            ></div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <Switch 
            id={`email-sent-${prospect.id}`}
            checked={prospect.email_envoye}
            onCheckedChange={onToggleEmailSent}
          />
          <Label htmlFor={`email-sent-${prospect.id}`} className="text-sm text-gray-700">
            {prospect.email_envoye ? 'Oui' : 'Non'}
          </Label>
          {prospect.email_date && prospect.email_envoye && (
            <span className="text-xs text-gray-500 ml-2">
              {formatDate(prospect.email_date)}
            </span>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge className={getStatusBadgeClass(prospect.statut_email)}>
          {getStatusBadgeText(prospect.statut_email)}
        </Badge>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Button 
          variant="outline"
          size="sm"
          onClick={onGenerateEmail}
          disabled={prospect.email_envoye}
        >
          Générer l'email
        </Button>
      </td>
    </tr>
  );
}
