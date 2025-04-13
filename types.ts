/**
 * Types centralisés pour AgentMarket
 */

// Types d'utilisateurs
export type UserRole = 'enterprise' | 'creator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  bio?: string;
  createdAt: Date;
}

// Types pour les agents IA
export type AgentCategory = 
  | 'customer-service' 
  | 'marketing' 
  | 'sales' 
  | 'hr' 
  | 'finance' 
  | 'legal' 
  | 'IT' 
  | 'other';

export type IntegrationType = 
  | 'api' 
  | 'widget' 
  | 'chatbot' 
  | 'webapp' 
  | 'mobile' 
  | 'standalone';

export interface AgentPricing {
  model: 'subscription' | 'one-time' | 'usage-based';
  startingPrice: number;
  currency: 'EUR' | 'USD' | 'GBP';
  details?: string;
}

export interface Agent {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: AgentCategory;
  creatorId: string;
  pricing: AgentPricing;
  featured?: boolean;
  logoUrl: string;
  integrations: IntegrationType[];
  demoUrl?: string;
  demoVideoUrl?: string;
  screenshots?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les dashboard
export interface AgentStats {
  agentId: string;
  views: number;
  clicks: number;
  contacts: number;
  conversions: number;
  lastUpdated: Date;
}

export interface ContactRecord {
  id: string;
  agentId: string;
  enterpriseId: string;
  creatorId: string;
  message: string;
  status: 'pending' | 'contacted' | 'meeting-scheduled' | 'closed';
  createdAt: Date;
}

export interface ProspectSuggestion {
  id: string;
  agentId: string;
  enterpriseId: string;
  reason: string;
  matchScore: number; // 0-100
  createdAt: Date;
}

// Types pour les formulaires
export interface AgentFormData {
  name: string;
  description: string;
  shortDescription: string;
  category: AgentCategory;
  pricing: AgentPricing;
  integrations: IntegrationType[];
  demoUrl?: string;
  demoVideoUrl?: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
  company?: string;
}

// Types pour les filtres et recherche
export interface AgentFilters {
  category?: AgentCategory | 'all';
  integrations?: IntegrationType[];
  priceRange?: {
    min: number;
    max: number;
  };
  searchQuery?: string;
}
