/**
 * Types centraux pour l'application
 */

// Type pour les utilisateurs
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'creator' | 'enterprise' | 'admin';
  avatar?: string;
  company?: string;
  bio?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Type pour le modèle de tarification d'un agent
export interface AgentPricing {
  model: 'subscription' | 'one_time' | 'free' | 'custom';
  startingPrice: number;
  currency: string;
  details?: string;
}

// Type pour les agents IA
export interface Agent {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  creatorId: string;
  pricing: AgentPricing;
  featured: boolean;
  logoUrl?: string;
  integrations: string[];
  demoUrl?: string;
  demoVideoUrl?: string;
  screenshots: string[];
  createdAt: Date;
  updatedAt?: Date;
  isPublic?: boolean;
}

// Type pour les statistiques
export interface Stats {
  views: number;
  clicks: number;
  contacts: number;
  conversions: number;
}

// Type pour les contacts
export interface Contact {
  id: string;
  agentId: string;
  enterpriseId: string;
  creatorId: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt?: Date;
  enterprise?: {
    name: string;
    location?: string;
  };
}

// Type pour les recommandations
export interface Recommendation {
  id: string;
  agentId: string;
  enterpriseId: string;
  reason: string;
  matchScore?: number;
  createdAt: Date;
  enterprise?: {
    name: string;
    location?: string;
  };
}

// Type pour les entreprises
export interface Enterprise {
  id: string;
  location?: string;
  size?: string;
  industry?: string;
  annualRevenue?: number;
  website?: string;
  contactPhone?: string;
  createdAt: Date;
  updatedAt?: Date;
}
