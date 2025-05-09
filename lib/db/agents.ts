import prisma from '../prisma';
import { getCurrentUser } from '../auth';
import { agentSchema, updateAgentSchema, AgentInput, UpdateAgentInput } from '../validators/agent';

/**
 * Récupère les agents accessibles par l'utilisateur courant
 * Implémente la logique RLS (Row Level Security)
 */
export async function getAgentsForUser(options: {
  category?: string;
  query?: string;
  page?: number;
  limit?: number;
} = {}) {
  const user = await getCurrentUser();
  
  if (!user) {
    // Utilisateur non authentifié: retourne uniquement les agents publics
    return prisma.agent.findMany({
      where: {
        isPublic: true,
        ...(options.category ? { category: options.category } : {}),
        ...(options.query ? {
          OR: [
            { name: { contains: options.query, mode: 'insensitive' } },
            { description: { contains: options.query, mode: 'insensitive' } },
          ]
        } : {})
      },
      take: options.limit || 10,
      skip: options.limit ? (options.page ? (options.page - 1) * options.limit : 0) : 0,
    });
  }
  
  // Logique basée sur le rôle d'utilisateur
  if (user.role === 'creator') {
    // Créateurs : accès uniquement à leurs propres agents
    return prisma.agent.findMany({
      where: {
        creatorId: user.id,
        ...(options.category ? { category: options.category } : {}),
        ...(options.query ? {
          OR: [
            { name: { contains: options.query, mode: 'insensitive' } },
            { description: { contains: options.query, mode: 'insensitive' } },
          ]
        } : {})
      },
      take: options.limit || 10,
      skip: options.limit ? (options.page ? (options.page - 1) * options.limit : 0) : 0,
    });
  } else if (user.role === 'enterprise') {
    // Entreprises : accès à tous les agents publics
    return prisma.agent.findMany({
      where: {
        isPublic: true,
        ...(options.category ? { category: options.category } : {}),
        ...(options.query ? {
          OR: [
            { name: { contains: options.query, mode: 'insensitive' } },
            { description: { contains: options.query, mode: 'insensitive' } },
          ]
        } : {})
      },
      take: options.limit || 10,
      skip: options.limit ? (options.page ? (options.page - 1) * options.limit : 0) : 0,
    });
  } else if (user.role === 'admin') {
    // Admins : accès à tous les agents
    return prisma.agent.findMany({
      where: {
        ...(options.category ? { category: options.category } : {}),
        ...(options.query ? {
          OR: [
            { name: { contains: options.query, mode: 'insensitive' } },
            { description: { contains: options.query, mode: 'insensitive' } },
          ]
        } : {})
      },
      take: options.limit || 10,
      skip: options.limit ? (options.page ? (options.page - 1) * options.limit : 0) : 0,
    });
  }
  
  // Par défaut, retourner une liste vide
  return [];
}

/**
 * Récupère un agent spécifique avec vérification d'accès
 */
export async function getAgentById(id: string) {
  const user = await getCurrentUser();
  
  const agent = await prisma.agent.findUnique({
    where: { id },
  });
  
  if (!agent) return null;
  
  // Vérification de sécurité
  if (!user) {
    // Utilisateur non authentifié: uniquement agents publics
    return agent.isPublic ? agent : null;
  }
  
  if (user.role === 'creator') {
    // Créateurs: uniquement leurs propres agents
    return agent.creatorId === user.id ? agent : null;
  } else if (user.role === 'enterprise') {
    // Entreprises: uniquement agents publics
    return agent.isPublic ? agent : null;
  } else if (user.role === 'admin') {
    // Admins: tous les agents
    return agent;
  }
  
  return null;
}

/**
 * Crée un nouvel agent avec validation
 */
export async function createAgent(data: AgentInput) {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  if (user.role !== 'creator' && user.role !== 'admin') {
    throw new Error('Seuls les créateurs et les administrateurs peuvent créer des agents');
  }
  
  // Valider les données avec le schéma zod
  const validated = agentSchema.parse({
    ...data,
    creatorId: user.id, // Assigner l'ID du créateur
  });
  
  return prisma.agent.create({
    data: validated,
  });
}

/**
 * Met à jour un agent avec vérification d'accès et validation
 */
export async function updateAgent(id: string, data: UpdateAgentInput) {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  const agent = await prisma.agent.findUnique({
    where: { id },
  });
  
  if (!agent) {
    throw new Error('Agent non trouvé');
  }
  
  // Vérification de sécurité
  if (user.role === 'creator' && agent.creatorId !== user.id) {
    throw new Error('Vous ne pouvez modifier que vos propres agents');
  }
  
  if (user.role !== 'creator' && user.role !== 'admin') {
    throw new Error('Seuls les créateurs et les administrateurs peuvent modifier des agents');
  }
  
  // Valider les données avec le schéma zod
  const validated = updateAgentSchema.parse(data);
  
  return prisma.agent.update({
    where: { id },
    data: validated,
  });
}

/**
 * Supprime un agent avec vérification d'accès
 */
export async function deleteAgent(id: string) {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  const agent = await prisma.agent.findUnique({
    where: { id },
  });
  
  if (!agent) {
    throw new Error('Agent non trouvé');
  }
  
  // Vérification de sécurité
  if (user.role === 'creator' && agent.creatorId !== user.id) {
    throw new Error('Vous ne pouvez supprimer que vos propres agents');
  }
  
  if (user.role !== 'creator' && user.role !== 'admin') {
    throw new Error('Seuls les créateurs et les administrateurs peuvent supprimer des agents');
  }
  
  return prisma.agent.delete({
    where: { id },
  });
}
