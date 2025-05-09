import { z } from 'zod';

/**
 * Énumération des catégories d'agents disponibles
 */
export const categoryEnum = z.enum(['AI', 'DATA_SCIENCE', 'AUTOMATION', 'CHATBOT', 'OTHER']);

/**
 * Schéma de validation pour la création d'un agent
 * Remplace les contraintes CHECK de la base de données
 */
export const agentSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string(),
  category: categoryEnum,
  shortDescription: z.string().max(150),
  isPublic: z.boolean().default(false),
  creatorId: z.string().uuid(),
  // Ajouter d'autres champs selon votre schéma
});

/**
 * Schéma de validation pour la mise à jour d'un agent
 * Tous les champs sont optionnels car on peut ne mettre à jour que certains champs
 */
export const updateAgentSchema = agentSchema.partial();

/**
 * Schéma de validation pour la recherche d'agents
 */
export const agentSearchSchema = z.object({
  category: categoryEnum.optional(),
  query: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

/**
 * Type des données d'agent validées
 */
export type AgentInput = z.infer<typeof agentSchema>;
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>;
