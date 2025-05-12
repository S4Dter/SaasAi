/* eslint-disable */
// @ts-nocheck
import prisma from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase-client-admin';
import { User } from '@/types';

// Types for filters and data structures
type UserRole = 'creator' | 'enterprise' | 'admin';
type UserStatus = 'active' | 'suspended' | 'pending';
type AgentStatus = 'pending' | 'approved' | 'rejected' | 'archived';
type ReportStatus = 'pending' | 'reviewed' | 'dismissed' | 'actioned';

// Where input types for filters
interface UserWhereInput {
  role?: string;
  status?: string;
  OR?: Array<{
    name?: { contains: string; mode: 'insensitive' };
    email?: { contains: string; mode: 'insensitive' };
    company?: { contains: string; mode: 'insensitive' };
  }>;
}

interface AgentWhereInput {
  status?: string;
  category?: string;
  featured?: boolean;
  OR?: Array<{
    name?: { contains: string; mode: 'insensitive' };
    description?: { contains: string; mode: 'insensitive' };
    short_description?: { contains: string; mode: 'insensitive' };
    creator?: { name?: { contains: string; mode: 'insensitive' } };
  }>;
}

interface ReportWhereInput {
  status?: string;
}

interface AgentUpdateData {
  status: AgentStatus;
  approval_date?: Date;
  rejection_reason?: string;
}

interface SystemSettingValue {
  id: string;
  value: string | number | boolean | object;
  description: string;
  updated_at: Date;
}

type SystemSettings = Record<string, SystemSettingValue>;

// Types for statistics and data structures
interface UserStatsData {
  role: string;
  _count: number;
}

interface UserStatusData {
  status: string | null;
  _count: number;
}

interface AgentCategoryData {
  category: string | null;
  _count: number;
}

interface AgentCreatedData {
  created_at: Date;
}

interface AgentViewData {
  created_at: Date;
}

interface AgentClickData {
  created_at: Date;
}

interface AgentContactData {
  created_at: Date;
}

interface RevenueCategoryData {
  category: string | null;
  _sum: {
    amount: number | null;
  };
}

interface RevenueData {
  created_at: Date;
  amount: number;
}

interface FormattedPendingAgent {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
  creator: string;
}

interface FormattedRecentReport {
  id: string;
  reason: string;
  description: string;
  created_at: string;
  agent_name: string;
}

interface FormattedRecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
}

interface PendingAgentData {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: Date;
  creator: {
    name: string | null;
  } | null;
}

interface RecentReportData {
  id: string;
  reason: string;
  description: string | null;
  created_at: Date;
  agent: {
    name: string | null;
  } | null;
}

interface RecentActivityData {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  user: {
    name: string | null;
  } | null;
}

/**
 * Fonction pour récupérer les utilisateurs avec pagination et filtres
 */
export async function getUsers({
  page = 1,
  limit = 20,
  role,
  status,
  search,
}: {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}) {
  try {
    const skip = (page - 1) * limit;
    
    // Construction des filtres pour la requête
    const where: UserWhereInput = {};
    
    if (role) {
      where.role = role;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Requête des utilisateurs
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        company: true,
        avatar: true,
        created_at: true,
        updated_at: true,
      },
    });
    
    // Requête du nombre total d'utilisateurs (pour la pagination)
    const totalCount = await prisma.user.count({ where });
    
    return {
      users,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error;
  }
}

/**
 * Modifier le statut d'un utilisateur
 */
export async function updateUserStatus(userId: string, status: 'active' | 'suspended' | 'pending') {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status },
    });
    
    return user;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du statut de l'utilisateur ${userId}:`, error);
    throw error;
  }
}

/**
 * Modifier le rôle d'un utilisateur
 */
export async function updateUserRole(userId: string, role: 'creator' | 'enterprise' | 'admin') {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    
    // Si l'utilisateur est connecté à Supabase, mettre à jour également son rôle dans Supabase
    try {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);
      
      if (authUser?.user) {
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          app_metadata: { role },
        });
      }
    } catch (supabaseError) {
      console.error(`Erreur lors de la mise à jour du rôle dans Supabase pour l'utilisateur ${userId}:`, supabaseError);
      // Ne pas empêcher la réussite de l'opération principale
    }
    
    return user;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du rôle de l'utilisateur ${userId}:`, error);
    throw error;
  }
}

/**
 * Récupérer les agents avec pagination et filtres
 */
export async function getAgents({
  page = 1,
  limit = 12,
  status,
  category,
  featured,
  search,
}: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  featured?: boolean;
  search?: string;
}) {
  try {
    const skip = (page - 1) * limit;
    
    // Construction des filtres pour la requête
    const where: AgentWhereInput = {};
    
    if (status) {
      where.status = status;
    }
    
    if (category) {
      where.category = category;
    }
    
    if (featured !== undefined) {
      where.featured = featured;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { short_description: { contains: search, mode: 'insensitive' } },
        { creator: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    
    // Requête des agents
    const agents = await prisma.agent.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    // Requête du nombre total d'agents (pour la pagination)
    const totalCount = await prisma.agent.count({ where });
    
    return {
      agents,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des agents:', error);
    throw error;
  }
}

/**
 * Modifier le statut d'un agent
 */
export async function updateAgentStatus(
  agentId: string, 
  status: 'pending' | 'approved' | 'rejected' | 'archived',
  rejectionReason?: string
) {
  try {
    const updateData: AgentUpdateData = { status };
    
    if (status === 'approved') {
      updateData.approval_date = new Date();
    }
    
    if (status === 'rejected' && rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }
    
    const agent = await prisma.agent.update({
      where: { id: agentId },
      data: updateData,
    });
    
    return agent;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du statut de l'agent ${agentId}:`, error);
    throw error;
  }
}

/**
 * Modifier le statut "featured" d'un agent
 */
export async function updateAgentFeatured(agentId: string, featured: boolean) {
  try {
    const agent = await prisma.agent.update({
      where: { id: agentId },
      data: { featured },
    });
    
    return agent;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du statut featured de l'agent ${agentId}:`, error);
    throw error;
  }
}

/**
 * Récupérer les catégories d'agents
 */
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    
    return categories;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    throw error;
  }
}

/**
 * Créer une nouvelle catégorie
 */
export async function createCategory({
  name,
  slug,
  description,
  icon,
}: {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}) {
  try {
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon,
      },
    });
    
    return category;
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    throw error;
  }
}

/**
 * Mettre à jour une catégorie existante
 */
export async function updateCategory(
  categoryId: string,
  {
    name,
    slug,
    description,
    icon,
  }: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
  }
) {
  try {
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        slug,
        description,
        icon,
        updated_at: new Date(),
      },
    });
    
    return category;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la catégorie ${categoryId}:`, error);
    throw error;
  }
}

/**
 * Supprimer une catégorie
 */
export async function deleteCategory(categoryId: string) {
  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });
    
    return { success: true };
  } catch (error) {
    console.error(`Erreur lors de la suppression de la catégorie ${categoryId}:`, error);
    throw error;
  }
}

/**
 * Récupérer les signalements avec pagination et filtres
 */
export async function getReports({
  page = 1,
  limit = 10,
  status,
}: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  try {
    const skip = (page - 1) * limit;
    
    // Construction des filtres pour la requête
    const where: ReportWhereInput = {};
    
    if (status) {
      where.status = status;
    }
    
    // Requête des signalements
    const reports = await prisma.report.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo_url: true,
          },
        },
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    // Requête du nombre total de signalements (pour la pagination)
    const totalCount = await prisma.report.count({ where });
    
    return {
      reports,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des signalements:', error);
    throw error;
  }
}

/**
 * Mettre à jour le statut d'un signalement
 */
export async function updateReportStatus(
  reportId: string,
  status: 'pending' | 'reviewed' | 'dismissed' | 'actioned',
  adminNotes?: string,
  resolution?: string
) {
  try {
    const report = await prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        admin_notes: adminNotes,
        resolution,
        reviewed_at: new Date(),
        admin_id: 'current-admin-id', // Remplacer par l'ID de l'admin connecté
      },
    });
    
    return report;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du signalement ${reportId}:`, error);
    throw error;
  }
}

/**
 * Récupérer les paramètres système
 */
export async function getSystemSettings() {
  try {
    const settings = await prisma.systemSetting.findMany();
    
    // Transformer le résultat en objet clé-valeur pour une manipulation plus facile
    const settingsObject: SystemSettings = {};
    settings.forEach((setting: { id: string; setting_key: string; setting_value: any; description: string; updated_at: Date }) => {
      settingsObject[setting.setting_key] = {
        id: setting.id,
        value: setting.setting_value,
        description: setting.description,
        updated_at: setting.updated_at,
      };
    });
    
    return settingsObject;
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres système:', error);
    throw error;
  }
}

/**
 * Mettre à jour un paramètre système
 */
export async function updateSystemSetting(key: string, value: any) {
  try {
    // Vérifier si le paramètre existe déjà
    const existingSetting = await prisma.systemSetting.findUnique({
      where: { setting_key: key },
    });
    
    if (existingSetting) {
      // Mettre à jour le paramètre existant
      const updatedSetting = await prisma.systemSetting.update({
        where: { id: existingSetting.id },
        data: {
          setting_value: value,
          updated_at: new Date(),
        },
      });
      
      return updatedSetting;
    } else {
      // Créer un nouveau paramètre
      const newSetting = await prisma.systemSetting.create({
        data: {
          setting_key: key,
          setting_value: value,
          description: `Paramètre de configuration "${key}"`,
        },
      });
      
      return newSetting;
    }
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du paramètre système ${key}:`, error);
    throw error;
  }
}

/**
 * Récupérer les statistiques de l'administrateur
 */
export async function getAdminStats() {
  try {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Statistiques utilisateurs
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { status: 'active' } });
    const newUsers = await prisma.user.count({
      where: { created_at: { gte: firstDayOfMonth } },
    });
    
    // Répartition des utilisateurs par rôle
    const usersByRoleData = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });
    
    const usersByRole = {
      enterprise: 0,
      creator: 0,
      admin: 0,
    };
    
    usersByRoleData.forEach((item: UserStatsData) => {
      if (item.role in usersByRole) {
        usersByRole[item.role as keyof typeof usersByRole] = item._count;
      }
    });
    
    // Répartition des utilisateurs par statut
    const usersByStatusData = await prisma.user.groupBy({
      by: ['status'],
      _count: true,
    });
    
    const usersByStatus = {
      active: 0,
      suspended: 0,
      pending: 0,
    };
    
    usersByStatusData.forEach((item: UserStatusData) => {
      if (item.status && item.status in usersByStatus) {
        usersByStatus[item.status as keyof typeof usersByStatus] = item._count;
      }
    });
    
    // Statistiques des agents
    const totalAgents = await prisma.agent.count();
    const pendingApproval = await prisma.agent.count({ where: { status: 'pending' } });
    const published = await prisma.agent.count({ where: { status: 'approved' } });
    const featured = await prisma.agent.count({ where: { featured: true } });
    
    // Agents par catégorie
    const agentsByCategoryData = await prisma.agent.groupBy({
      by: ['category'],
      _count: true,
    });
    
    const agentsByCategory: Record<string, number> = {};
    
    agentsByCategoryData.forEach((item: AgentCategoryData) => {
      if (item.category) {
        agentsByCategory[item.category] = item._count;
      }
    });
    
    // Tendances des nouveaux agents (derniers 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newAgentsData = await prisma.agent.findMany({
      where: {
        created_at: { gte: thirtyDaysAgo },
      },
      select: {
        created_at: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });
    
    // Agréger par jour
    const newAgentsByDay: Record<string, number> = {};
    newAgentsData.forEach((agent: AgentCreatedData) => {
      const date = agent.created_at.toISOString().split('T')[0];
      newAgentsByDay[date] = (newAgentsByDay[date] || 0) + 1;
    });
    
    // Formater pour l'interface
    const newAgentsTrend = {
      id: 'new-agents',
      name: 'Nouveaux agents',
      data: Object.entries(newAgentsByDay).map(([date, value]) => ({
        date,
        value,
      })),
    };
    
    // Statistiques d'activité
    const totalViews = await prisma.agentView.count();
    const totalClicks = await prisma.agentClick.count();
    const totalContacts = await prisma.agentContact.count();
    const conversionRate = totalViews > 0 ? (totalContacts / totalViews) * 100 : 0;
    
    // Tendances des vues, clics et contacts (derniers 30 jours)
    const viewsData = await prisma.agentView.findMany({
      where: {
        created_at: { gte: thirtyDaysAgo },
      },
      select: {
        created_at: true,
      },
    });
    
    const clicksData = await prisma.agentClick.findMany({
      where: {
        created_at: { gte: thirtyDaysAgo },
      },
      select: {
        created_at: true,
      },
    });
    
    const contactsData = await prisma.agentContact.findMany({
      where: {
        created_at: { gte: thirtyDaysAgo },
      },
      select: {
        created_at: true,
      },
    });
    
    // Agréger par jour
    const viewsByDay: Record<string, number> = {};
    viewsData.forEach((view: AgentViewData) => {
      const date = view.created_at.toISOString().split('T')[0];
      viewsByDay[date] = (viewsByDay[date] || 0) + 1;
    });
    
    const clicksByDay: Record<string, number> = {};
    clicksData.forEach((click: AgentClickData) => {
      const date = click.created_at.toISOString().split('T')[0];
      clicksByDay[date] = (clicksByDay[date] || 0) + 1;
    });
    
    const contactsByDay: Record<string, number> = {};
    contactsData.forEach((contact: AgentContactData) => {
      const date = contact.created_at.toISOString().split('T')[0];
      contactsByDay[date] = (contactsByDay[date] || 0) + 1;
    });
    
    // Formater pour l'interface
    const viewsTrend = {
      id: 'views',
      name: 'Vues',
      data: Object.entries(viewsByDay).map(([date, value]) => ({
        date,
        value,
      })),
    };
    
    const clicksTrend = {
      id: 'clicks',
      name: 'Clics',
      data: Object.entries(clicksByDay).map(([date, value]) => ({
        date,
        value,
      })),
    };
    
    const contactsTrend = {
      id: 'contacts',
      name: 'Contacts',
      data: Object.entries(contactsByDay).map(([date, value]) => ({
        date,
        value,
      })),
    };
    
    // Statistiques des revenus
    // Note: Cette partie dépend de la structure de votre modèle de données pour les revenus
    // Exemple simplifié:
    const totalRevenue = await prisma.revenue.aggregate({
      _sum: {
        amount: true,
      },
    });
    
    const pendingPayouts = await prisma.payout.aggregate({
      where: {
        status: 'pending',
      },
      _sum: {
        amount: true,
      },
    });
    
    // Revenus par catégorie
    const revenueByCategoryData = await prisma.revenue.groupBy({
      by: ['category'],
      _sum: {
        amount: true,
      },
    });
    
    const revenueByCategory: Record<string, number> = {};
    
    revenueByCategoryData.forEach((item: RevenueCategoryData) => {
      if (item.category && item._sum.amount) {
        revenueByCategory[item.category] = item._sum.amount;
      }
    });
    
    // Tendance des revenus (derniers 30 jours)
    const revenueData = await prisma.revenue.findMany({
      where: {
        created_at: { gte: thirtyDaysAgo },
      },
      select: {
        created_at: true,
        amount: true,
      },
    });
    
    // Agréger par jour
    const revenueByDay: Record<string, number> = {};
    revenueData.forEach((revenue: RevenueData) => {
      const date = revenue.created_at.toISOString().split('T')[0];
      revenueByDay[date] = (revenueByDay[date] || 0) + revenue.amount;
    });
    
    // Formater pour l'interface
    const revenueTrend = {
      id: 'revenue',
      name: 'Revenus',
      data: Object.entries(revenueByDay).map(([date, value]) => ({
        date,
        value,
      })),
    };
    
    return {
      userStats: {
        totalUsers,
        activeUsers,
        newUsers: newUsers,
        usersByRole,
        usersByStatus,
      },
      agentStats: {
        totalAgents,
        pendingApproval,
        published,
        featured,
        agentsByCategory,
        newAgents: newAgentsTrend,
      },
      activityStats: {
        totalViews,
        totalClicks,
        totalContacts,
        conversionRate,
        viewsTrend,
        clicksTrend,
        contactsTrend,
      },
      revenueStats: {
        totalRevenue: totalRevenue._sum.amount || 0,
        pendingPayouts: pendingPayouts._sum.amount || 0,
        averageAgentPrice: totalAgents > 0 ? (totalRevenue._sum.amount || 0) / totalAgents : 0,
        revenueTrend,
        revenueByCategory,
      },
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques admin:', error);
    throw error;
  }
}

/**
 * Récupérer un aperçu des données pour le tableau de bord admin
 */
export async function getAdminOverview() {
  try {
    // Statistiques utilisateurs
    const userStats = {
      totalUsers: await prisma.user.count(),
      newUsers: await prisma.user.count({
        where: {
          created_at: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      }),
    };
    
    // Statistiques des agents
    const agentStats = {
      totalAgents: await prisma.agent.count(),
      newAgents: await prisma.agent.count({
        where: {
          created_at: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      }),
    };
    
    // Statistiques des catégories
    const categoryStats = {
      totalCategories: await prisma.category.count(),
    };
    
    // Statistiques des signalements
    const reportStats = {
      pendingReports: await prisma.report.count({
        where: { status: 'pending' },
      }),
      recentReports: await prisma.report.count({
        where: {
          created_at: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      }),
    };
    
    // Agents en attente d'approbation
    const pendingAgents = await prisma.agent.findMany({
      where: { status: 'pending' },
      take: 5,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        name: true,
        logo_url: true,
        created_at: true,
        creator: {
          select: {
            name: true,
          },
        },
      },
    });
    
    // Transformer le résultat pour plus de clarté
    const formattedPendingAgents = pendingAgents.map((agent: PendingAgentData) => ({
      id: agent.id,
      name: agent.name,
      logo_url: agent.logo_url,
      created_at: agent.created_at.toISOString(),
      creator: agent.creator?.name || 'Inconnu',
    }));
    
    // Signalements récents
    const recentReports = await prisma.report.findMany({
      where: { status: 'pending' },
      take: 5,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        reason: true,
        description: true,
        created_at: true,
        agent: {
          select: {
            name: true,
          },
        },
      },
    });
    
    // Transformer le résultat pour plus de clarté
    const formattedRecentReports = recentReports.map((report: RecentReportData) => ({
      id: report.id,
      reason: report.reason,
      description: report.description || '',
      created_at: report.created_at.toISOString(),
      agent_name: report.agent?.name || 'Agent inconnu',
    }));
    
    // Activités récentes
    const recentActivities = await prisma.activity.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      select: {
        id: true,
        type: true,
         description: true,
          timestamp: true,
           user: {
             select: {
               name: true,
             },
           },
         },
       });

       // Transformer le résultat pour plus de clarté 
       const formattedRecentActivities = recentActivities.map((activity: RecentActivityData) => ({ 
        id: activity.id,
        type: activity.type,
        description: activity.description, 
        timestamp: activity.timestamp.toISOString(), 
        user: activity.user?.name || 'Système', 
      })); 
      
      // Statistiques des revenus 
      const currentMonth = new Date().getMonth(); 
      const currentYear = new Date().getFullYear(); 
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1); 
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0); 
      const firstDayOfPrevMonth = new Date(currentYear, currentMonth - 1, 1); 
      const lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0); 
      const currentMonthRevenue = await prisma.revenue.aggregate({ 
        where: { 
          created_at: { 
            gte: firstDayOfMonth, 
            lte: lastDayOfMonth, 
          }, 
        }, 
        _sum: { 
          amount: true, 
        }, 
      }); 
      const prevMonthRevenue = await prisma.revenue.aggregate({ 
        where: { 
          created_at: { 
            gte: firstDayOfPrevMonth, 
            lte: lastDayOfPrevMonth, 
          }, 
        }, 
        _sum: { 
          amount: true, 
        }, 
      }); 
      // Calculer le changement en pourcentage 
      const currentMonthTotal = currentMonthRevenue._sum.amount || 0; 
      const prevMonthTotal = prevMonthRevenue._sum.amount || 0; 
      let monthlyChange = 0; 
      if (prevMonthTotal > 0) { 
        monthlyChange = Math.round(((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100); 
      } 
      // Revenus par catégorie pour le mois en cours 
      const revenueByCategoryData = await prisma.revenue.groupBy({ 
        where: { 
          created_at: { 
            gte: firstDayOfMonth, 
            lte: lastDayOfMonth, 
          }, 
        }, 
        by: ['category'],
        _sum: { 
          amount: true, 
        }, 
      }); 
      const revenueByCategory: Record<string, number> = {}; 
      revenueByCategoryData.forEach((item: RevenueCategoryData) => { 
        if (item.category && item._sum.amount) { 
          revenueByCategory[item.category] = item._sum.amount; 
        } 
      }); 
      return { 
        userStats, 
        agentStats, 
        categoryStats, 
        reportStats, 
        PendingAgents: formattedPendingAgents,
        RecentReports: formattedRecentReports,
        recentActivities: formattedRecentActivities, 
        revenueStats: { 
          currentMonth: currentMonthTotal, 
          monthlyChange, 
          byCategory: revenueByCategory, 
        }, 
      }; 
    } catch (error) { 
      console.error('Erreur lors de la récupération des données d\'aperçu admin:', error); 
        throw error; 
      } 
    }
