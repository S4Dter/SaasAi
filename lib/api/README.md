# Structure API pour Marketplace Agent IA

Ce dossier contient les fichiers nécessaires pour l'intégration API du projet, conçus pour faciliter la transition des données mock vers une API REST réelle.

## Architecture des API

La structure suit le pattern d'API Client avec des adaptateurs, ce qui permettra de passer facilement des données mockées à des API réelles:

```
lib/
  ├── api/
  │   ├── client.ts             # Client HTTP de base (axios, fetch)
  │   ├── endpoints.ts          # Configuration des endpoints
  │   ├── types.ts              # Types spécifiques aux API
  │   ├── adapters/             # Adaptateurs d'API
  │   │   ├── agents.ts         # API des agents
  │   │   ├── users.ts          # API des utilisateurs
  │   │   ├── contacts.ts       # API des contacts
  │   │   ├── suggestions.ts    # API des suggestions
  │   │   └── favorites.ts      # API des favoris
  │   ├── hooks/                # React hooks pour les API
  │   │   ├── useAgents.ts      # Hook pour les agents
  │   │   ├── useUsers.ts       # Hook pour les utilisateurs
  │   │   ├── useContacts.ts    # Hook pour les contacts
  │   │   ├── useSuggestions.ts # Hook pour les suggestions
  │   │   └── useFavorites.ts   # Hook pour les favoris
  │   └── mock/                 # Versions mock des API (pour dev)
  │       ├── handlers.ts       # Gestionnaires de mock
  │       └── browser.ts        # Configuration MSW pour le navigateur
  └── utils/                    # Utilitaires généraux
      └── api-helpers.ts        # Fonctions d'aide pour les API
```

## Étapes de migration vers une API réelle

1. **Phase initiale (mode mock)**: 
   - Créer les adaptateurs d'API qui utilisent les données mockées
   - Développer les hooks React qui exposent les fonctionnalités
   - Les composants consomment ces hooks sans savoir qu'ils utilisent des données mock

2. **Phase de transition**:
   - Implémenter le client HTTP réel dans `client.ts`
   - Configurer les endpoints dans `endpoints.ts`
   - Mettre à jour les adaptateurs pour utiliser le client HTTP au lieu des données mock
   - Ajouter la gestion des erreurs, retries, et caching

3. **Phase finale**:
   - Basculer les adaptateurs pour utiliser les API réelles
   - Les composants n'ont pas besoin d'être modifiés grâce à l'abstraction

## Exemple d'implémentation

### Client HTTP (client.ts)

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.agentmarket.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gérer les erreurs spécifiques (401, 403, etc.)
    if (error.response && error.response.status === 401) {
      // Rediriger vers la page de connexion
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Adaptateur (adapters/agents.ts)

```typescript
import apiClient from '../client';
import { Agent, AgentFormData, AgentFilters } from '@/types';
import { ENDPOINTS } from '../endpoints';

// En mode développement, utiliser les données mock
const isDev = process.env.NODE_ENV === 'development';

export const agentsApi = {
  /**
   * Récupérer tous les agents
   */
  getAll: async (filters?: AgentFilters): Promise<Agent[]> => {
    if (isDev && !process.env.NEXT_PUBLIC_USE_REAL_API) {
      // Utiliser les données mock en développement
      const { getAllAgents, filterAgents } = await import('@/mock/agents');
      return filters ? filterAgents(filters.category, filters.integrations, filters.searchQuery) : getAllAgents();
    }
    
    // Version API réelle
    const params = filters ? {
      category: filters.category,
      integrations: filters.integrations?.join(','),
      searchQuery: filters.searchQuery,
      minPrice: filters.priceRange?.min,
      maxPrice: filters.priceRange?.max,
    } : {};
    
    const response = await apiClient.get(ENDPOINTS.agents.getAll, { params });
    return response.data;
  },
  
  /**
   * Récupérer un agent par ID
   */
  getById: async (id: string): Promise<Agent | null> => {
    if (isDev && !process.env.NEXT_PUBLIC_USE_REAL_API) {
      const { getAgentById } = await import('@/mock/agents');
      return getAgentById(id);
    }
    
    try {
      const response = await apiClient.get(ENDPOINTS.agents.getById(id));
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
  
  /**
   * Créer un nouvel agent
   */
  create: async (agentData: AgentFormData): Promise<Agent> => {
    if (isDev && !process.env.NEXT_PUBLIC_USE_REAL_API) {
      // Simuler la création en mode mock
      return {
        id: `new-${Date.now()}`,
        slug: agentData.name.toLowerCase().replace(/\s+/g, '-'),
        createdAt: new Date(),
        updatedAt: new Date(),
        logoUrl: '/images/agents/placeholder.png',
        ...agentData,
      };
    }
    
    const response = await apiClient.post(ENDPOINTS.agents.create, agentData);
    return response.data;
  },
  
  // Autres méthodes (update, delete, etc.)
};
```

### Hook React (hooks/useAgents.ts)

```typescript
import { useState, useEffect, useCallback } from 'react';
import { Agent, AgentFilters } from '@/types';
import { agentsApi } from '../adapters/agents';

export function useAgents(initialFilters?: AgentFilters) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<AgentFilters>(initialFilters || {});

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await agentsApi.getAll(filters);
      setAgents(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch agents'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const updateFilters = useCallback((newFilters: AgentFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  }, []);

  return {
    agents,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchAgents
  };
}
```

## Utilisation dans les composants

```tsx
import { useAgents } from '@/lib/api/hooks/useAgents';
import AgentList from '@/components/agents/AgentList';

export default function AgentsPage() {
  const { agents, loading, error, filters, updateFilters } = useAgents();
  
  return (
    <div>
      <h1>Catalogue d'agents IA</h1>
      {error && <div className="error-message">{error.message}</div>}
      <AgentList 
        agents={agents} 
        loading={loading} 
        filters={filters}
        onFilterChange={updateFilters}
      />
    </div>
  );
}
```

Cette architecture permet de séparer clairement les préoccupations entre:
- L'accès aux données (adaptateurs)
- La logique business (hooks)
- L'interface utilisateur (composants)

Le passage des données mock aux API réelles sera ainsi transparent pour les composants UI.
