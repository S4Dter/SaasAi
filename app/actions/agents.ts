'use server';

import { revalidatePath } from 'next/cache';
import { AgentService } from '@/lib/services/agent-service';
import { agentSchema, updateAgentSchema } from '@/lib/validators/agent';
import { getCurrentUser } from '@/lib/auth';

/**
 * Action pour créer un nouvel agent
 */
export async function createAgentAction(formData: FormData) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: 'Vous devez être connecté pour créer un agent',
      };
    }
    
    if (user.role !== 'creator' && user.role !== 'admin') {
      return {
        success: false,
        message: 'Seuls les créateurs et les administrateurs peuvent créer des agents',
      };
    }
    
    // Récupération et transformation des données du formulaire
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const category = formData.get('category') as string;
    const isPublic = formData.get('isPublic') === 'true';
    
    // Validation des données avec le schéma Zod
    const validationResult = agentSchema.safeParse({
      name,
      description,
      shortDescription,
      category,
      isPublic,
      creatorId: user.id,
    });
    
    if (!validationResult.success) {
      const errors = validationResult.error.format();
      return {
        success: false,
        message: 'Validation échouée',
        errors,
      };
    }
    
    // Création de l'agent
    const agent = await AgentService.create(validationResult.data);
    
    // Revalidation du chemin pour forcer un rechargement des données
    revalidatePath('/dashboard/creator/agents');
    
    return {
      success: true,
      message: 'Agent créé avec succès',
      agent,
    };
  } catch (error) {
    console.error('Erreur lors de la création de l\'agent:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur lors de la création de l\'agent',
    };
  }
}

/**
 * Action pour mettre à jour un agent existant
 */
export async function updateAgentAction(id: string, formData: FormData) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: 'Vous devez être connecté pour modifier un agent',
      };
    }
    
    // Récupération et transformation des données du formulaire
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const category = formData.get('category') as string;
    const isPublic = formData.get('isPublic') === 'true';
    
    // Validation des données avec le schéma Zod
    const validationResult = updateAgentSchema.safeParse({
      name,
      description,
      shortDescription,
      category,
      isPublic,
    });
    
    if (!validationResult.success) {
      const errors = validationResult.error.format();
      return {
        success: false,
        message: 'Validation échouée',
        errors,
      };
    }
    
    // Mise à jour de l'agent
    const agent = await AgentService.update(id, validationResult.data);
    
    // Revalidation du chemin pour forcer un rechargement des données
    revalidatePath('/dashboard/creator/agents');
    revalidatePath(`/agents/${id}`);
    
    return {
      success: true,
      message: 'Agent mis à jour avec succès',
      agent,
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'agent:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'agent',
    };
  }
}

/**
 * Action pour supprimer un agent
 */
export async function deleteAgentAction(id: string) {
  try {
    // Utilisation du service pour supprimer l'agent
    await AgentService.delete(id);
    
    // Revalidation du chemin pour forcer un rechargement des données
    revalidatePath('/dashboard/creator/agents');
    
    return {
      success: true,
      message: 'Agent supprimé avec succès',
    };
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'agent:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'agent',
    };
  }
}

/**
 * Action pour récupérer tous les agents accessibles par l'utilisateur
 */
export async function getAgentsAction(options: {
  category?: string;
  query?: string;
  page?: number;
  limit?: number;
  includeCreator?: boolean;
} = {}) {
  try {
    const agents = await AgentService.getAll(options);
    
    return {
      success: true,
      agents,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des agents:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur lors de la récupération des agents',
      agents: [],
    };
  }
}

/**
 * Action pour récupérer un agent spécifique
 */
export async function getAgentByIdAction(id: string, options: {
  includeCreator?: boolean;
} = {}) {
  try {
    const agent = await AgentService.getById(id, options);
    
    if (!agent) {
      return {
        success: false,
        message: 'Agent non trouvé',
      };
    }
    
    return {
      success: true,
      agent,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'agent:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur lors de la récupération de l\'agent',
    };
  }
}
