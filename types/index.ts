/**
 * Core types used across the application
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'creator' | 'enterprise' | 'admin';
  avatar?: string | null;
  company?: string | null;
  bio?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface Agent {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  category?: string;
  creator_id: string;
  pricing: any; // JSON type
  featured?: boolean;
  logo_url?: string;
  integrations: string[];
  demo_url?: string;
  demo_video_url?: string;
  screenshots: string[];
  created_at?: string;
  updated_at?: string;
  creator?: User;
}
