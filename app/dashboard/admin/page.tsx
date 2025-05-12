import { withAdminProtection } from '@/lib/utils/withAdminProtection';
import { getAdminOverview } from '@/lib/api/admin';
import Link from 'next/link';
import { ROUTES, AGENT_CATEGORIES } from '@/constants';
import { 
  Users, 
  Briefcase, 
  Tag, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  BarChart2,
  DollarSign,
  AlertCircle
} from 'lucide-react';

// Types for the data returned by getAdminOverview
interface Agent {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
  creator: string;
}

interface Report {
  id: string;
  reason: string;
  description: string;
  created_at: string;
  agent_name: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
}

/**
 * Page principale du tableau de bord administrateur
 * Offre une vue d'ensemble des principales métriques et des actions en attente
 * Centralise l'accès aux différentes sections du tableau de bord admin
 */
export default async function AdminDashboardPage() {
  // Vérifier que l'utilisateur est authentifié et a le rôle admin
  await withAdminProtection();
  
  try {
    // Récupérer les données de vue d'ensemble
    const overviewData = await getAdminOverview();
  
    const statCards = [
      {
        title: 'Utilisateurs',
        value: overviewData.userStats.totalUsers,
        change: overviewData.userStats.newUsers,
        trend: 'up',
        icon: <Users className="h-6 w-6 text-blue-500" />,
        href: ROUTES.DASHBOARD.ADMIN.USERS,
      },
      {
        title: 'Agents',
        value: overviewData.agentStats.totalAgents,
        change: overviewData.agentStats.newAgents,
        trend: 'up',
        icon: <Briefcase className="h-6 w-6 text-purple-500" />,
        href: ROUTES.DASHBOARD.ADMIN.AGENTS,
      },
      {
        title: 'Catégories',
        value: overviewData.categoryStats.totalCategories,
        icon: <Tag className="h-6 w-6 text-green-500" />,
        href: ROUTES.DASHBOARD.ADMIN.CATEGORIES,
      },
      {
        title: 'Signalements',
        value: overviewData.reportStats.pendingReports,
        change: overviewData.reportStats.recentReports,
        trend: 'up',
        icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
        href: ROUTES.DASHBOARD.ADMIN.REPORTS,
      },
    ];

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tableau de bord administrateur</h1>
          <Link 
            href={ROUTES.DASHBOARD.ADMIN.STATS}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BarChart2 className="w-4 h-4 mr-2" />
            Statistiques détaillées
          </Link>
        </div>
        
        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Link 
              key={card.title} 
              href={card.href}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex justify-between items-start">
                <div className="rounded-full p-2 bg-gray-100 dark:bg-gray-700">
                  {card.icon}
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {card.title}
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{card.value.toLocaleString('fr-FR')}</div>
                {card.change !== undefined && (
                  <div className="flex items-center mt-1">
                    <span className={`text-xs font-medium ${
                      card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {card.trend === 'up' ? '+' : '-'}{card.change} récents
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4 text-blue-600 dark:text-blue-400 text-sm flex items-center ml-auto">
                Voir détails
                <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
        
        {/* Actions en attente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                  Agents en attente d'approbation
                </h2>
                <Link
                  href={`${ROUTES.DASHBOARD.ADMIN.AGENTS}?status=pending`}
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                >
                  Voir tous
                </Link>
              </div>
            </div>
            <div className="p-6">
              {overviewData.PendingAgents && overviewData.PendingAgents.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {overviewData.PendingAgents.map((agent: Agent) => (
                    <div key={agent.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 relative">
                          {agent.logo_url ? (
                            <img
                              src={agent.logo_url}
                              alt={agent.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                              <Briefcase className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{agent.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {agent.creator} • {new Date(agent.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`${ROUTES.DASHBOARD.ADMIN.AGENTS}/${agent.id}`}
                        className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Examiner
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Aucun agent en attente d'approbation
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  Signalements récents
                </h2>
                <Link
                  href={ROUTES.DASHBOARD.ADMIN.REPORTS}
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                >
                  Voir tous
                </Link>
              </div>
            </div>
            <div className="p-6">
              {overviewData.RecentReports && overviewData.RecentReports.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {overviewData.RecentReports.map((report: Report) => (
                    <div key={report.id} className="py-3">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                            {report.reason}
                          </div>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            {new Date(report.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <Link
                          href={`${ROUTES.DASHBOARD.ADMIN.REPORTS}/${report.id}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Examiner
                        </Link>
                      </div>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Agent: <span className="font-medium">{report.agent_name}</span>
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {report.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Aucun signalement récent
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Résumé des revenus et activités */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden lg:col-span-2">
            <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <BarChart2 className="h-5 w-5 text-blue-500 mr-2" />
                Activité récente
              </h2>
            </div>
            <div className="p-6">
              {overviewData.recentActivities && overviewData.recentActivities.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {overviewData.recentActivities.map((activity: Activity) => (
                    <div key={activity.id} className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            activity.type === 'user_signup' ? 'bg-green-500' :
                            activity.type === 'agent_published' ? 'bg-blue-500' :
                            activity.type === 'agent_featured' ? 'bg-purple-500' :
                            'bg-gray-500'
                          }`} />
                          <p className="text-sm text-gray-900 dark:text-white font-medium">
                            {activity.description}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(activity.timestamp).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Aucune activité récente
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                Revenus
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total mois en cours</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(overviewData.revenueStats.currentMonth)}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs font-medium ${
                      overviewData.revenueStats.monthlyChange >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {overviewData.revenueStats.monthlyChange >= 0 ? '+' : ''}
                      {overviewData.revenueStats.monthlyChange}% vs mois précédent
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Par catégorie (ce mois)</p>
                  <div className="space-y-2 mt-2">
                    {Object.entries(overviewData.revenueStats.byCategory).map(([category, amount]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {AGENT_CATEGORIES.find(cat => cat.value === category)?.label || category}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount as number)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Link
                  href={ROUTES.DASHBOARD.ADMIN.STATS}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4 w-full"
                >
                  Voir les rapports financiers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erreur lors du chargement des données du tableau de bord:', error);
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tableau de bord administrateur</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg shadow flex items-center">
          <AlertCircle className="h-6 w-6 mr-3 text-red-600" />
          <div>
            <h3 className="font-medium">Erreur de chargement des données</h3>
            <p className="mt-1">Une erreur est survenue lors du chargement des données du tableau de bord. Veuillez réessayer plus tard.</p>
          </div>
        </div>
      </div>
    );
  }
}
