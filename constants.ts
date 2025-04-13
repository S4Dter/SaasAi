/**
 * Constantes de l'application AgentMarket
 */

// Informations sur l'application
export const APP_NAME = 'AgentMarket';
export const APP_SLOGAN = 'La marketplace des meilleurs agents IA pour votre entreprise';
export const APP_DESCRIPTION = 'AgentMarket est la première marketplace qui connecte les créateurs d\'agents IA avec les entreprises à la recherche de solutions d\'automatisation intelligentes.';

// Routes principales
export const ROUTES = {
  HOME: '/',
  AGENTS: '/agents',
  AGENT_DETAILS: (id: string) => `/agents/${id}`,
  DASHBOARD: {
    ENTERPRISE: {
      ROOT: '/dashboard/enterprise',
      FAVORITES: '/dashboard/enterprise/favorites',
      HISTORY: '/dashboard/enterprise/history',
      SUGGESTIONS: '/dashboard/enterprise/suggestions',
    },
    CREATOR: {
      ROOT: '/dashboard/creator',
      AGENTS: '/dashboard/creator/agents',
      STATS: '/dashboard/creator/stats',
      PROSPECTION: '/dashboard/creator/prospection',
      ADD_AGENT: '/dashboard/creator/add',
    },
  },
  AUTH: {
    SIGNIN: '/signin',
    SIGNUP: '/signup',
  },
};

// Catégories d'agents
export const AGENT_CATEGORIES = [
  { value: 'customer-service', label: 'Service Client' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Ventes' },
  { value: 'hr', label: 'Ressources Humaines' },
  { value: 'finance', label: 'Finance' },
  { value: 'legal', label: 'Juridique' },
  { value: 'IT', label: 'IT & Développement' },
  { value: 'other', label: 'Autres' },
];

// Types d'intégration
export const INTEGRATION_TYPES = [
  { value: 'api', label: 'API' },
  { value: 'widget', label: 'Widget' },
  { value: 'chatbot', label: 'Chatbot' },
  { value: 'webapp', label: 'Application Web' },
  { value: 'mobile', label: 'Application Mobile' },
  { value: 'standalone', label: 'Autonome' },
];

// Modèles de tarification
export const PRICING_MODELS = [
  { value: 'subscription', label: 'Abonnement' },
  { value: 'one-time', label: 'Achat unique' },
  { value: 'usage-based', label: 'Basé sur l\'usage' },
];

// Devises supportées
export const CURRENCIES = [
  { value: 'EUR', label: '€', name: 'Euro' },
  { value: 'USD', label: '$', name: 'Dollar US' },
  { value: 'GBP', label: '£', name: 'Livre Sterling' },
];

// Filtres par défaut
export const DEFAULT_FILTERS = {
  category: 'all',
  priceRange: {
    min: 0,
    max: 1000,
  },
  integrations: [],
  searchQuery: '',
};

// Configuration pour les métriques de statistiques
export const STATS_METRICS = [
  { id: 'views', label: 'Vues', color: 'bg-blue-500' },
  { id: 'clicks', label: 'Clics', color: 'bg-green-500' },
  { id: 'contacts', label: 'Contacts', color: 'bg-yellow-500' },
  { id: 'conversions', label: 'Conversions', color: 'bg-purple-500' },
];

// Liens des réseaux sociaux
export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/agentmarket',
  LINKEDIN: 'https://linkedin.com/company/agentmarket',
  GITHUB: 'https://github.com/agentmarket',
};

// Configuration d'affichage
export const UI_CONFIG = {
  GRID_COLUMNS: {
    SM: 1,
    MD: 2,
    LG: 3,
    XL: 4,
  },
  FEATURED_AGENTS_COUNT: 3,
  MAX_DESCRIPTION_LENGTH: 200,
};
