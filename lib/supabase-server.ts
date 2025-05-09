import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

/**
 * Crée un client Supabase côté serveur
 * À utiliser dans les Server Components ou Server Actions
 */
export function createServerSupabaseClient() {
  return createServerComponentClient<Database>({ cookies });
}

/**
 * Récupère tous les agents
 */
export async function getAllAgents() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des agents:", error);
    return [];
  }

  return formatAgents(data);
}

/**
 * Récupère les agents en vedette
 */
export async function getFeaturedAgents() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des agents en vedette:", error);
    return [];
  }

  return formatAgents(data);
}

/**
 * Récupère un agent par son ID
 */
export async function getAgentById(id: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error("Erreur lors de la récupération de l'agent:", error);
    return null;
  }

  return formatAgent(data);
}

/**
 * Récupère un agent par son slug
 */
export async function getAgentBySlug(slug: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error("Erreur lors de la récupération de l'agent par slug:", error);
    return null;
  }

  return formatAgent(data);
}

/**
 * Filtre les agents selon des critères
 */
export async function filterAgents(category?: string, integrations?: string[], searchQuery?: string) {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('agents')
    .select('*');
  
  // Filtre par catégorie
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  
  // Filtre par recherche
  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`);
  }
  
  const { data, error } = await query;

  if (error) {
    console.error("Erreur lors du filtrage des agents:", error);
    return [];
  }

  // Si aucun filtre d'intégration, retourne tous les résultats
  if (!integrations || integrations.length === 0) {
    return formatAgents(data);
  }

  // Filtrer manuellement pour les intégrations (car ce n'est pas supporté directement par Supabase)
  const filteredAgents = data.filter(agent => {
    if (!agent.integrations || !Array.isArray(agent.integrations)) return false;
    return integrations.every(integration => agent.integrations.includes(integration));
  });

  return formatAgents(filteredAgents);
}

/**
 * Récupère tous les utilisateurs
 */
export async function getAllUsers() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return [];
  }

  return formatUsers(data);
}

/**
 * Récupère un utilisateur par son ID
 */
export async function getUserById(id: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }

  return formatUser(data);
}

/**
 * Récupère un utilisateur par son email
 */
export async function getUserByEmail(email: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    console.error("Erreur lors de la récupération de l'utilisateur par email:", error);
    return null;
  }

  return formatUser(data);
}

/**
 * Récupère tous les créateurs
 */
export async function getAllCreators() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'creator');

  if (error) {
    console.error("Erreur lors de la récupération des créateurs:", error);
    return [];
  }

  return formatUsers(data);
}

/**
 * Récupère tous les utilisateurs entreprise
 */
export async function getAllEnterprises() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'enterprise');

  if (error) {
    console.error("Erreur lors de la récupération des entreprises:", error);
    return [];
  }

  return formatUsers(data);
}

/**
 * Récupère le créateur d'un agent par l'ID de l'agent
 */
export async function getCreatorByAgentId(agentId: string) {
  const supabase = createServerSupabaseClient();

  // Récupérer d'abord l'agent pour avoir son creatorId
  const { data: agent, error: agentError } = await supabase
    .from('agents')
    .select('creator_id')
    .eq('id', agentId)
    .single();

  if (agentError || !agent) {
    console.error("Erreur lors de la récupération de l'agent:", agentError);
    return null;
  }

  // Récupérer le créateur avec le creatorId
  const { data: creator, error: creatorError } = await supabase
    .from('users')
    .select('*')
    .eq('id', agent.creator_id)
    .single();

  if (creatorError || !creator) {
    console.error("Erreur lors de la récupération du créateur:", creatorError);
    return null;
  }

  return formatUser(creator);
}

/**
 * Formatte un agent Supabase pour correspondre au type Agent de l'application
 */
function formatAgent(agent: any) {
  return {
    id: agent.id,
    name: agent.name,
    slug: agent.slug || '',
    description: agent.description || '',
    shortDescription: agent.short_description || '',
    category: agent.category || 'other',
    creatorId: agent.creator_id,
    pricing: agent.pricing || { model: 'subscription', startingPrice: 0, currency: 'EUR' },
    featured: agent.featured || false,
    logoUrl: agent.logo_url || '',
    integrations: agent.integrations || [],
    demoUrl: agent.demo_url,
    demoVideoUrl: agent.demo_video_url,
    screenshots: agent.screenshots || [],
    createdAt: new Date(agent.created_at || Date.now()),
    updatedAt: agent.updated_at ? new Date(agent.updated_at) : new Date(agent.created_at || Date.now()),
    isPublic: !!agent.is_public
  };
}

/**
 * Formatte plusieurs agents Supabase
 */
function formatAgents(agents: any[]) {
  return agents.map(formatAgent);
}

/**
 * Formatte un utilisateur Supabase pour correspondre au type User de l'application
 */
function formatUser(user: any) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    company: user.company,
    bio: user.bio,
    createdAt: user.created_at ? new Date(user.created_at) : new Date(),
    updatedAt: user.updated_at ? new Date(user.updated_at) : undefined
  };
}

/**
 * Formatte plusieurs utilisateurs Supabase
 */
function formatUsers(users: any[]) {
  return users.map(formatUser);
}
