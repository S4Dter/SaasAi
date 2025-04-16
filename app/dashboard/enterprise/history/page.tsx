import React from 'react';
import { Metadata } from 'next';
import { APP_NAME } from '@/constants';
import { getFeaturedAgents } from '@/mock/agents';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Link from 'next/link';

export const metadata: Metadata = {
  title: `Historique de contacts | ${APP_NAME}`,
  description: 'Historique de vos échanges avec les créateurs d\'agents IA',
};

/**
 * Interface pour les entrées d'historique mockées
 */
interface HistoryEntry {
  id: string;
  agentId: string;
  agentName: string;
  creatorName: string;
  date: string;
  type: 'message' | 'call' | 'demo' | 'purchase';
  status: 'completed' | 'pending' | 'cancelled';
  notes?: string;
}

/**
 * Page d'historique des contacts entreprise
 */
export default function HistoryPage() {
  // Création d'un historique mocké basé sur les agents existants
  const agents = getFeaturedAgents();
  
  // Importer la fonction pour obtenir le créateur d'un agent
  const { getCreatorByAgentId } = require('@/mock/users');
  
  const historyEntries: HistoryEntry[] = agents.map((agent, index) => {
    // Obtenir le créateur de l'agent
    const creator = getCreatorByAgentId(agent.id);
    
    return {
      id: `history-${index}`,
      agentId: agent.id,
      agentName: agent.name,
      creatorName: creator ? creator.name : 'Créateur inconnu',
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      type: ['message', 'call', 'demo', 'purchase'][Math.floor(Math.random() * 4)] as HistoryEntry['type'],
      status: ['completed', 'pending', 'cancelled'][Math.floor(Math.random() * 3)] as HistoryEntry['status'],
      notes: Math.random() > 0.5 ? `Note concernant ${agent.name}` : undefined,
    };
  });

  // Tri par date (du plus récent au plus ancien)
  historyEntries.sort((a, b) => {
    const dateA = new Date(a.date.split('/').reverse().join('-'));
    const dateB = new Date(b.date.split('/').reverse().join('-'));
    return dateB.getTime() - dateA.getTime();
  });

  // Fonction pour obtenir l'icône selon le type d'entrée
  const getTypeIcon = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'message':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      case 'call':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'demo':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'purchase':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
    }
  };

  // Fonction pour obtenir la couleur de statut
  const getStatusColor = (status: HistoryEntry['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
    }
  };

  // Fonction pour obtenir le libellé du statut
  const getStatusLabel = (status: HistoryEntry['status']) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
    }
  };

  // Fonction pour obtenir le libellé du type
  const getTypeLabel = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'message':
        return 'Message';
      case 'call':
        return 'Appel';
      case 'demo':
        return 'Démo';
      case 'purchase':
        return 'Achat';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Historique des contacts</h1>
        <p className="text-gray-600 mt-1">
          Retrouvez l&apos;historique de vos échanges avec les créateurs d&apos;agents IA
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              {historyEntries.length} échanges récents
            </h2>
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les types</option>
                <option value="message">Messages</option>
                <option value="call">Appels</option>
                <option value="demo">Démos</option>
                <option value="purchase">Achats</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créateur
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historyEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link href={`/agents/${entry.agentId}`} className="hover:text-blue-600">
                              {entry.agentName}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.creatorName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="mr-1.5 flex-shrink-0 text-gray-500">
                          {getTypeIcon(entry.type)}
                        </span>
                        <span className="text-sm text-gray-900">
                          {getTypeLabel(entry.type)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(entry.status)}`}>
                        {getStatusLabel(entry.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.notes || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {historyEntries.length === 0 && (
              <div className="py-16 text-center">
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
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  Aucun historique
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Vous n&apos;avez pas encore contacté de créateurs ou consulté d&apos;agents.
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
