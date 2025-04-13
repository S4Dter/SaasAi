/**
 * Configuration des endpoints d'API pour Marketplace Agent IA
 * 
 * Ce fichier centralise tous les endpoints utilisés par l'application.
 * À modifier lorsque les endpoints réels seront disponibles.
 */

// URL de base de l'API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.agentmarket.com/v1';

/**
 * Structure des endpoints de l'API
 */
export const ENDPOINTS = {
  // Endpoints pour les agents
  agents: {
    getAll: '/agents',
    getById: (id: string) => `/agents/${id}`,
    create: '/agents',
    update: (id: string) => `/agents/${id}`,
    delete: (id: string) => `/agents/${id}`,
    getFeatured: '/agents/featured',
    getByCategory: (category: string) => `/agents/category/${category}`,
    getBySimilarity: (id: string) => `/agents/${id}/similar`,
  },
  
  // Endpoints pour les utilisateurs
  users: {
    getById: (id: string) => `/users/${id}`,
    getCurrent: '/users/me',
    update: (id: string) => `/users/${id}`,
    getCreators: '/users/creators',
    getEnterprises: '/users/enterprises',
  },
  
  // Endpoints pour l'authentification
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh',
    resetPassword: '/auth/reset-password',
    forgotPassword: '/auth/forgot-password',
    verifyEmail: '/auth/verify-email',
  },
  
  // Endpoints pour les contacts
  contacts: {
    getAll: '/contacts',
    getById: (id: string) => `/contacts/${id}`,
    create: '/contacts',
    update: (id: string) => `/contacts/${id}`,
    getByAgentId: (agentId: string) => `/contacts/agent/${agentId}`,
    getByEnterpriseId: (enterpriseId: string) => `/contacts/enterprise/${enterpriseId}`,
  },
  
  // Endpoints pour les favoris
  favorites: {
    getAll: '/favorites',
    add: (agentId: string) => `/favorites/${agentId}`,
    remove: (agentId: string) => `/favorites/${agentId}`,
    check: (agentId: string) => `/favorites/check/${agentId}`,
  },
  
  // Endpoints pour les suggestions
  suggestions: {
    getAll: '/suggestions',
    getById: (id: string) => `/suggestions/${id}`,
    dismiss: (id: string) => `/suggestions/${id}/dismiss`,
    generateForUser: '/suggestions/generate',
  },
  
  // Endpoints pour les statistiques
  stats: {
    getAgentStats: (agentId: string) => `/stats/agent/${agentId}`,
    getUserStats: (userId: string) => `/stats/user/${userId}`,
    getGlobalStats: '/stats/global',
  },
};

/**
 * Type pour les paramètres de requête couramment utilisés
 */
export interface CommonQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Type pour les réponses paginées
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
