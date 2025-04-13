import React from 'react';
import { ContactRecord, Agent, User } from '@/types';

interface ContactHistoryProps {
  contacts: ContactRecord[];
  agents?: Record<string, Agent>;
  creators?: Record<string, User>;
  loading?: boolean;
}

/**
 * Composant pour afficher l'historique des contacts avec les créateurs d'agents
 */
const ContactHistory: React.FC<ContactHistoryProps> = ({
  contacts,
  agents = {},
  creators = {},
  loading = false
}) => {
  // Formatter la date relative
  const formatDate = (date: Date) => {
    // Format relatif simple
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    
    if (diffMonth > 0) {
      return `Il y a ${diffMonth} mois`;
    } else if (diffDay > 0) {
      return `Il y a ${diffDay} jour${diffDay > 1 ? 's' : ''}`;
    } else if (diffHour > 0) {
      return `Il y a ${diffHour} heure${diffHour > 1 ? 's' : ''}`;
    } else if (diffMin > 0) {
      return `Il y a ${diffMin} minute${diffMin > 1 ? 's' : ''}`;
    } else {
      return 'À l\'instant';
    }
  };

  // Obtenir le statut formaté
  const getStatusLabel = (status: ContactRecord['status']) => {
    switch (status) {
      case 'pending':
        return { label: 'En attente', class: 'text-yellow-800 bg-yellow-100' };
      case 'contacted':
        return { label: 'Contacté', class: 'text-blue-800 bg-blue-100' };
      case 'meeting-scheduled':
        return { label: 'Rendez-vous', class: 'text-green-800 bg-green-100' };
      case 'closed':
        return { label: 'Terminé', class: 'text-gray-800 bg-gray-100' };
      default:
        return { label: 'Inconnu', class: 'text-gray-800 bg-gray-100' };
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun contact</h3>
        <p className="mt-1 text-sm text-gray-500">
          Vous n&apos;avez pas encore contacté de créateurs d&apos;agents.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Historique des contacts</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {contacts.map((contact) => {
          const agent = agents[contact.agentId];
          const creator = creators[contact.creatorId];
          const status = getStatusLabel(contact.status);

          return (
            <li key={contact.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start space-x-4">
                {/* Logo de l'agent (placeholder si pas d'agent) */}
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 font-bold">
                    {agent ? agent.name.charAt(0) : '?'}
                  </span>
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {agent ? agent.name : 'Agent inconnu'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {creator ? creator.name : 'Créateur inconnu'}
                        {creator?.company && ` (${creator.company})`}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.class}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-gray-700 whitespace-pre-line line-clamp-2">
                    {contact.message}
                  </div>

                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {formatDate(contact.createdAt)}
                    </span>

                    <div className="flex space-x-2">
                      {contact.status !== 'closed' && (
                        <button
                          className="text-xs text-blue-600 hover:text-blue-800"
                          type="button"
                        >
                          Répondre
                        </button>
                      )}
                      <button
                        className="text-xs text-gray-600 hover:text-gray-800"
                        type="button"
                      >
                        Détails
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {contacts.length > 10 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-center">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Voir plus
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactHistory;
