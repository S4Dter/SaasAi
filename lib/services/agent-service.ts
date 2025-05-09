import prisma from '../prisma';
import { getCurrentUser } from '../auth';
import { agentSchema, updateAgentSchema, AgentInput, UpdateAgentInput } from '../validators/agent';

/**
 * Service pour gérer les agents avec contrôle d'accès (RLS)
 */
export class AgentService {
  /**
   * Récupère tous les agents accessibles par l'utilisateur
   */
  static async getAll(options: {
    category?: string;
    query?: string;
    page?: number;
    limit?: number;
    includeCreator?: boolean;
  } = {}) {
    const user = await getCurrentUser();
    
    // Construire la clause WHERE en fonction du rôle utilisateur
    const whereClause: any = this._buildWhereClauseByUserRole(user);
    
    // Ajouter les filtres supplémentaires
    if (options.category) {
      whereClause.category = options.category;
    }
    
    if (options.query) {
      whereClause.OR = [
        { name: { contains: options.query, mode: 'insensitive' } },
        { description: { contains: options.query, mode: 'insensitive' } },
      ];
    }
    
    // Construire les options d'inclusion
    const include: any = {};
    if (options.includeCreator) {
      include.creator = {
        select: {
          id: true,
          name: true,
          email: true,
        },
      };
    }
    
    return prisma.agent.findMany({
      where: whereClause,
      include: Object.keys(include).length > 0 ? include : undefined,
      take: options.limit || 10,
      skip: options.limit ? (options.page ? (options.page - 1) * options.limit : 0) : 0,
      orderBy: { createdAt: 'desc' },
    });
  }
  
  /**
   * Récupère un agent par son ID
   */
  static async getById(id: string, options: { includeCreator?: boolean } = {}) {
    const user = await getCurrentUser();
    
    // Construire les options d'inclusion
    const include: any = {};
    if (options.includeCreator) {
      include.creator = {
        select: {
          id: true,
          name: true,
          email: true,
        },
      };
    }
    
    const agent = await prisma.agent.findUnique({
      where: { id },
      include: Object.keys(include).length > 0 ? include : undefined,
    });
    
    if (!agent) return null;
    
    // Vérification d'accès
    if (!user) {
      return agent.isPublic ? agent : null;
    }
    
    if (user.role === 'creator') {
      return agent.creatorId === user.id ? agent : (agent.isPublic ? agent : null);
    }
    
    if (user.role === 'enterprise') {
      return agent.isPublic ? agent : null;
    }
    
    // Admin a accès à tout
    return agent;
  }
  
  /**
   * Crée un nouvel agent
   */
  static async create(data: AgentInput) {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }
    
    if (user.role !== 'creator' && user.role !== 'admin') {
      throw new Error('Permission refusée: seuls les créateurs et administrateurs peuvent créer des agents');
    }
    
    // Valider les données
    const validated = agentSchema.parse({
      ...data,
      creatorId: user.id,
    });
    
    // Créer l'agent
    return prisma.agent.create({
      data: validated,
    });
  }
  
  /**
   * Met à jour un agent existant
   */
  static async update(id: string, data: UpdateAgentInput) {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }
    
    const agent = await prisma.agent.findUnique({ where: { id } });
    
    if (!agent) {
      throw new Error('Agent non trouvé');
    }
    
    // Vérifications d'accès
    if (user.role === 'creator' && agent.creatorId !== user.id) {
      throw new Error('Permission refusée: vous pouvez modifier uniquement vos propres agents');
    }
    
    if (user.role !== 'creator' && user.role !== 'admin') {
      throw new Error('Permission refusée: seuls les créateurs et administrateurs peuvent modifier des agents');
    }
    
    // Valider les données
    const validated = updateAgentSchema.parse(data);
    
    // Mettre à jour l'agent
    return prisma.agent.update({
      where: { id },
      data: validated,
    });
  }
  
  /**
   * Supprime un agent
   */
  static async delete(id: string) {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }
    
    const agent = await prisma.agent.findUnique({ where: { id } });
    
    if (!agent) {
      throw new Error('Agent non trouvé');
    }
    
    // Vérifications d'accès
    if (user.role === 'creator' && agent.creatorId !== user.id) {
      throw new Error('Permission refusée: vous pouvez supprimer uniquement vos propres agents');
    }
    
    if (user.role !== 'creator' && user.role !== 'admin') {
      throw new Error('Permission refusée: seuls les créateurs et administrateurs peuvent supprimer des agents');
    }
    
    // Supprimer l'agent
    return prisma.agent.delete({
      where: { id },
    });
  }
  
  /**
   * Construit la clause WHERE en fonction du rôle utilisateur
   * Implémente la logique RLS
   */
  static _buildWhereClauseByUserRole(user: any): Record<string, any> {
    if (!user) {
      // Utilisateur non authentifié: uniquement agents publics
      return { isPublic: true };
    }
    
    switch (user.role) {
      case 'admin':
        // Admin: accès à tout
        return {};
      case 'creator':
        // Créateur: accès à ses propres agents
        return { creatorId: user.id };
      case 'enterprise':
        // Entreprise: accès uniquement aux agents publics
        return { isPublic: true };
      default:
        // Par défaut: uniquement agents publics
        return { isPublic: true };
    }
  }
}
