export const APP_NAME = 'AgentMarket';
export const APP_SLOGAN = 'La marketplace des meilleurs agents IA pour votre entreprise';
export const APP_DESCRIPTION = 'AgentMarket est la première marketplace qui connecte les créateurs d\'agents IA avec les entreprises à la recherche de solutions d\'automatisation intelligentes.';

export const ROUTES = {
  HOME: '/',
  AGENTS: '/agents',
  AGENT_DETAILS: (id: string) => `/agents/${id}`,
  COMMUNITY: '/community',
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
    ADMIN: {
      ROOT: '/dashboard/admin',
      USERS: '/dashboard/admin/users',
      AGENTS: '/dashboard/admin/agents',
      CATEGORIES: '/dashboard/admin/categories',
      REPORTS: '/dashboard/admin/reports',
      STATS: '/dashboard/admin/stats',
      ACTIVITIES: '/dashboard/admin/activities',
      SETTINGS: '/dashboard/admin/settings',
    },
  },
  AUTH: {
    SIGNIN: '/signin',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    SIGNOUT: '/signout',
  },
  PRICING: '/pricing',
  CONTACT: '/contact',
  LEGAL: {
    TERMS: '/legal/terms',
    PRIVACY: '/legal/privacy',
  },
  ABOUT: '/about',
} as const;

// Les autres constantes restent inchangées :
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

export const INTEGRATION_TYPES = [
  { value: 'api', label: 'API' },
  { value: 'widget', label: 'Widget' },
  { value: 'chatbot', label: 'Chatbot' },
  { value: 'webapp', label: 'Application Web' },
  { value: 'mobile', label: 'Application Mobile' },
  { value: 'standalone', label: 'Autonome' },
];

export const PRICING_MODELS = [
  { value: 'subscription', label: 'Abonnement' },
  { value: 'one-time', label: 'Achat unique' },
  { value: 'usage-based', label: 'Basé sur l\'usage' },
];

export const CURRENCIES = [
  { value: 'EUR', label: '€', name: 'Euro' },
  { value: 'USD', label: '$', name: 'Dollar US' },
  { value: 'GBP', label: '£', name: 'Livre Sterling' },
];

export const DEFAULT_FILTERS = {
  category: 'all',
  priceRange: {
    min: 0,
    max: 1000,
  },
  integrations: [],
  searchQuery: '',
};

export const STATS_METRICS = [
  { id: 'views', label: 'Vues', color: 'bg-blue-500' },
  { id: 'clicks', label: 'Clics', color: 'bg-green-500' },
  { id: 'contacts', label: 'Contacts', color: 'bg-yellow-500' },
  { id: 'conversions', label: 'Conversions', color: 'bg-purple-500' },
];

export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/agentmarket',
  LINKEDIN: 'https://linkedin.com/company/agentmarket',
  GITHUB: 'https://github.com/agentmarket',
} as const;

export const UI_CONFIG = {
  GRID_COLUMNS: {
    SM: 1,
    MD: 2,
    LG: 3,
    XL: 4,
  },
  FEATURED_AGENTS_COUNT: 3,
  MAX_DESCRIPTION_LENGTH: 200,
} as const;
