'use client';

import React, { useState, useEffect } from 'react';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/context/AuthContext';

/**
 * Interface pour les entrées d'historique
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
  creatorId?: string;
}

/**
 * Composant client pour la page d'historique des contacts entreprise
 */
export default function HistoryClient() {
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  
  const { user } = useAuth();
  const userId = user?.id;

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

  // Récupérer les contacts depuis Supabase
  useEffect(() => {
    if (!userId || !supabase) {
      setLoading(false);
      return;
    }

    const fetchContacts = async () => {
      try {
        setLoading(true);

        if (!supabase) {
          throw new Error('Client Supabase non disponible');
        }

        // Récupérer les contacts de l'utilisateur
        const { data: contacts, error: contactsError } = await supabase
          .from('contacts')
          .select('id, agent_id, creator_id, status, message, created_at')
          .eq('enterprise_id', userId)
          .order('created_at', { ascending: false });

        if (contactsError) {
          console.error('Erreur lors de la récupération des contacts:', contactsError);
          setLoading(false);
          return;
        }

        if (!contacts || contacts.length === 0) {
          setHistoryEntries([]);
          setLoading(false);
          return;
        }

        // Récupérer les informations des agents
        const agentIds = contacts.map((contact) => contact.agent_id);
        const { data: agents, error: agentsError } = await supabase
          .from('agents')
          .select('id, name, creator_id')
          .in('id', agentIds);

        if (agentsError) {
          console.error('Erreur lors de la récupération des agents:', agentsError);
          setLoading(false);
          return;
        }

        // Récupérer les informations des créateurs
        const creatorIds = agents.map((agent) => agent.creator_id);
        const { data: creators, error: creatorsError } = await supabase
          .from('users')
          .select('id, name')
          .in('id', creatorIds);

        if (creatorsError) {
          console.error('Erreur lors de la récupération des créateurs:', creatorsError);
          setLoading(false);
          return;
        }

        // Construire les entrées d'historique
        const entries = contacts.map((contact) => {
          const agent = agents.find((a) => a.id === contact.agent_id);
          const creator = creators.find((c) => c.id === agent?.creator_id);

          // Déterminer le type de contact (aléatoire pour cette démo)
          const contactTypes: HistoryEntry['type'][] = ['message', 'call', 'demo', 'purchase'];
          const randomType = contactTypes[Math.floor(Math.random() * contactTypes.length)];

          return {
            id: contact.id,
            agentId: contact.agent_id,
            agentName: agent?.name || 'Agent inconnu',
            creatorId: contact.creator_id,
            creatorName: creator?.name || 'Créateur inconnu',
            date: new Date(contact.created_at).toLocaleDateString('fr-FR'),
            type: randomType,
            status: (contact.status || 'pending') as HistoryEntry['status'],
            notes: contact.message || undefined,
          };
        });

        setHistoryEntries(entries);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setLoading(false);
      }
    };

    fetchContacts();

    // Abonnement aux changements en temps réel
    const contactsChannel = supabase ? 
      supabase
        .channel('contacts-changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'contacts',
          filter: `enterprise_id=eq.${userId}`
        }, () => fetchContacts())
        .subscribe()
      : null;

    return () => {
      if (contactsChannel) {
        contactsChannel.unsubscribe();
      }
    };
  }, [userId]);

  // Filtrer les entrées selon le terme de recherche et le type
  const filteredEntries = historyEntries.filter((entry) => {
    // Filtre par terme de recherche
    const matchesSearch = 
      searchTerm === '' || 
      entry.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.notes && entry.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtre par type
    const matchesType = filterType === 'all' || entry.type === filterType;
    
    return matchesSearch && matchesType;
  });

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
        <h1 className="text-2xl font-bold text-gray-900">Historique des contacts</h1>
        <p className="text-gray-600 mt-1">
          Retrouvez l&apos;historique de vos échanges avec les créateurs d&apos;agents IA
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              {filteredEntries.length} échanges récents
            </h2>
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
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
                {filteredEntries.map((entry) => (
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
            
            {filteredEntries.length === 0 && (
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
