'use client';
import React, { useState, useEffect } from 'react';
import { CrmProspect } from '@/types/crm';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/context/AuthContext';

interface Agent {
  id: string;
  name: string;
  description: string;
  sector: string;
  features: string[];
  price: string;
  // Autres propriétés potentielles des agents
}

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: CrmProspect;
  onSubmit: (agentData: {
    id: string;
    name: string;
    sector: string;
    price: string;
    features: string[];
  }) => void;
  isLoading: boolean;
  emailContent: string | null;
  selectedAgent: {
    id: string;
    name: string;
    sector: string;
    price: string;
    features: string[];
  } | null;
}

export default function EmailModal({
  isOpen,
  onClose,
  prospect,
  onSubmit,
  isLoading,
  emailContent,
  selectedAgent
}: EmailModalProps) {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Effet pour charger les agents IA de l'utilisateur
  useEffect(() => {
    const fetchAgents = async () => {
      if (!user?.id || !supabase) {
        setLoadingAgents(false);
        return;
      }
      
      try {
        // Charger les agents depuis Supabase - version simulée pour cette démonstration
        // Dans une implémentation réelle, remplacez ceci par une requête Supabase correcte
        
        // Exemple de simulation des données d'agents
        const mockAgents: Agent[] = [
          {
            id: '1',
            name: 'Finance Advisor AI',
            description: 'Agent IA spécialisé dans le conseil financier',
            sector: 'finance',
            features: ['Analyse de portefeuille', 'Conseil en investissement', 'Planification financière'],
            price: '299€/mois'
          },
          {
            id: '2',
            name: 'Health Assistant',
            description: 'Agent IA pour le secteur de la santé',
            sector: 'sante',
            features: ['Suivi de patients', 'Analyse de symptômes', 'Rappels de médicaments'],
            price: '399€/mois'
          },
          {
            id: '3',
            name: 'Retail Optimizer',
            description: 'Agent IA pour le commerce de détail',
            sector: 'commerce',
            features: ['Gestion des stocks', 'Analyse des ventes', 'Recommandations produits'],
            price: '249€/mois'
          }
        ];
        
        // Dans une implémentation réelle, utilisez ceci :
        /*
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        setAgents(data || []);
        */
        
        // Pour la démo, utilisons les données simulées
        setAgents(mockAgents);
        
        // Si le secteur du prospect correspond à un agent, présélectionnons-le
        const matchingAgent = mockAgents.find(agent => 
          agent.sector.toLowerCase() === prospect.secteur.toLowerCase()
        );
        
        if (matchingAgent) {
          setSelectedAgentId(matchingAgent.id);
        } else if (mockAgents.length > 0) {
          setSelectedAgentId(mockAgents[0].id);
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement des agents:', error);
        setError('Une erreur est survenue lors du chargement des agents.');
      } finally {
        setLoadingAgents(false);
      }
    };
    
    if (isOpen) {
      fetchAgents();
    }
  }, [isOpen, user?.id, prospect.secteur]);
  
  const handleSubmit = () => {
    const agent = agents.find(a => a.id === selectedAgentId);
    if (!agent) return;
    
    onSubmit({
      id: agent.id,
      name: agent.name,
      sector: agent.sector,
      price: agent.price,
      features: agent.features
    });
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
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full lg:max-w-4xl">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Générer un email pour {prospect.prospect_name}
                </h3>
                
                {loadingAgents ? (
                  <div className="mt-4 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="ml-2">Chargement des agents...</span>
                  </div>
                ) : error ? (
                  <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                    {error}
                  </div>
                ) : emailContent ? (
                  <div className="mt-4">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-700">Email généré avec {selectedAgent?.name}</h4>
                        <Badge className="bg-green-100 text-green-800">
                          Généré avec n8n
                        </Badge>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-md text-sm font-mono whitespace-pre-wrap border border-gray-200">
                        {emailContent}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={onClose}
                        className="ml-2"
                      >
                        Fermer
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="mb-4">
                      <label htmlFor="agent-select" className="block text-sm font-medium text-gray-700 mb-1">
                        Sélectionner un agent IA pour générer l'email
                      </label>
                      <select
                        id="agent-select"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={selectedAgentId}
                        onChange={(e) => setSelectedAgentId(e.target.value)}
                        disabled={isLoading}
                      >
                        {agents.length === 0 ? (
                          <option value="">Aucun agent disponible</option>
                        ) : (
                          agents.map(agent => (
                            <option key={agent.id} value={agent.id}>
                              {agent.name} - {agent.sector} - {agent.price}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    
                    {selectedAgentId && (
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-700 mb-2">Détails de l'agent</h4>
                        {(() => {
                          const agent = agents.find(a => a.id === selectedAgentId);
                          if (!agent) return null;
                          
                          return (
                            <div className="bg-gray-50 p-4 rounded-md">
                              <p className="text-sm text-gray-700 mb-2">{agent.description}</p>
                              <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-1">Fonctionnalités:</p>
                                <ul className="list-disc list-inside text-sm text-gray-700">
                                  {agent.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="mt-3 flex justify-between items-center">
                                <div>
                                  <p className="text-xs text-gray-500">Secteur:</p>
                                  <p className="text-sm text-gray-700">{agent.sector}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Prix:</p>
                                  <p className="text-sm font-medium text-gray-900">{agent.price}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    
                    <div className="mt-4 bg-yellow-50 p-3 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Information
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>
                              En cliquant sur "Générer", un workflow n8n va créer un email personnalisé en fonction des caractéristiques du prospect et de l'agent sélectionné. 
                              Vous pourrez ensuite modifier cet email avant de l'envoyer manuellement.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {!emailContent && (
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <Button
                onClick={handleSubmit}
                disabled={!selectedAgentId || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    Génération...
                  </>
                ) : (
                  "Générer"
                )}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="mt-3 sm:mt-0 sm:mr-3"
                disabled={isLoading}
              >
                Annuler
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Ajout d'un composant Badge directement dans le fichier pour éviter les problèmes d'importation
function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
