'use client';

import { useState, useEffect } from 'react';
import { 
  Users, ShoppingBag, BarChart2, TrendingUp, 
  DollarSign, Calendar, AlertTriangle, Clock,
  ChevronUp, ChevronDown, Info
} from 'lucide-react';

// Types pour les statistiques
type StatDataPoint = {
  date: string;
  value: number;
};

type StatSeries = {
  id: string;
  name: string;
  data: StatDataPoint[];
};

type StatCard = {
  title: string;
  value: number | string;
  previousValue?: number | string;
  change?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  format?: 'number' | 'currency' | 'percentage';
};

interface Stats {
  userStats: {
    totalUsers: number;
    activeUsers: number;
    newUsers: StatSeries;
    usersByRole: {
      enterprise: number;
      creator: number;
      admin: number;
    };
    usersByStatus: {
      active: number;
      suspended: number;
      pending: number;
    };
  };
  agentStats: {
    totalAgents: number;
    pendingApproval: number;
    published: number;
    featured: number;
    agentsByCategory: Record<string, number>;
    newAgents: StatSeries;
  };
  activityStats: {
    totalViews: number;
    totalClicks: number;
    totalContacts: number;
    conversionRate: number;
    viewsTrend: StatSeries;
    clicksTrend: StatSeries;
    contactsTrend: StatSeries;
  };
  revenueStats: {
    totalRevenue: number;
    pendingPayouts: number;
    averageAgentPrice: number;
    revenueTrend: StatSeries;
    revenueByCategory: Record<string, number>;
  };
}

interface StatsClientProps {
  statsData: Stats;
}

export default function StatsClient({ statsData }: StatsClientProps) {
  // Définir les périodes disponibles pour l'affichage des données
  const timePeriods = [
    { id: 'day', label: 'Aujourd\'hui' },
    { id: 'week', label: 'Cette semaine' },
    { id: 'month', label: 'Ce mois-ci' },
    { id: 'quarter', label: 'Ce trimestre' },
    { id: 'year', label: 'Cette année' },
  ];

  // État local
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  // Formater les nombres selon le type
  const formatValue = (value: number | string, format?: string) => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('fr-FR', { 
          style: 'currency', 
          currency: 'EUR',
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('fr-FR').format(value);
    }
  };

  // Créer les cartes de statistiques à partir des données
  const statCards: StatCard[] = [
    {
      title: 'Utilisateurs actifs',
      value: statsData.userStats.activeUsers,
      previousValue: statsData.userStats.activeUsers - statsData.userStats.newUsers.data[0].value,
      change: statsData.userStats.newUsers.data[0].value,
      icon: <Users className="w-8 h-8 text-blue-500" />,
      trend: 'up',
      format: 'number'
    },
    {
      title: 'Agents publiés',
      value: statsData.agentStats.published,
      previousValue: statsData.agentStats.published - statsData.agentStats.newAgents.data[0].value,
      change: statsData.agentStats.newAgents.data[0].value,
      icon: <ShoppingBag className="w-8 h-8 text-purple-500" />,
      trend: 'up',
      format: 'number'
    },
    {
      title: 'Revenus totaux',
      value: statsData.revenueStats.totalRevenue,
      previousValue: statsData.revenueStats.totalRevenue - statsData.revenueStats.revenueTrend.data[0].value,
      change: statsData.revenueStats.revenueTrend.data[0].value,
      icon: <DollarSign className="w-8 h-8 text-green-500" />,
      trend: 'up',
      format: 'currency'
    },
    {
      title: 'Taux de conversion',
      value: statsData.activityStats.conversionRate,
      icon: <TrendingUp className="w-8 h-8 text-amber-500" />,
      format: 'percentage'
    },
  ];

  // Données en attente d'action
  const pendingActions = [
    {
      title: 'Agents en attente d\'approbation',
      value: statsData.agentStats.pendingApproval,
      icon: <Clock className="w-6 h-6 text-yellow-500" />,
      link: '/dashboard/admin/agents?status=pending'
    },
    {
      title: 'Paiements en attente',
      value: formatValue(statsData.revenueStats.pendingPayouts, 'currency'),
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
      link: '/dashboard/admin/payments?status=pending'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Sélecteur de période */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2">
          {timePeriods.map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedPeriod === period.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                  {formatValue(card.value, card.format)}
                </p>
                
                {card.change && (
                  <div className="flex items-center mt-2">
                    {card.trend === 'up' ? (
                      <ChevronUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : card.trend === 'down' ? (
                      <ChevronDown className="w-4 h-4 text-red-500 mr-1" />
                    ) : null}
                    
                    <span className={`text-sm font-medium ${
                      card.trend === 'up' 
                        ? 'text-green-600 dark:text-green-400'
                        : card.trend === 'down'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {formatValue(card.change, card.format)}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs période précédente</span>
                  </div>
                )}
              </div>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Éléments en attente d'action */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
            En attente d'action
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingActions.map((action, index) => (
              <a
                key={index}
                href={action.link}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center">
                  {action.icon}
                  <span className="ml-3 font-medium">{action.title}</span>
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {action.value}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Statistiques d'utilisateurs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Statistiques des utilisateurs
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Distribution des rôles */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                Distribution par rôle
              </h3>
              <div className="space-y-4">
                {Object.entries(statsData.userStats.usersByRole).map(([role, count]) => (
                  <div key={role}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {role}
                      </span>
                      <span>{count} utilisateurs</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          role === 'enterprise' 
                            ? 'bg-blue-600' 
                            : role === 'creator' 
                            ? 'bg-green-600'
                            : 'bg-purple-600'
                        }`}
                        style={{ 
                          width: `${(count / statsData.userStats.totalUsers * 100).toFixed(1)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statut des utilisateurs */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                Statut des comptes
              </h3>
              <div className="space-y-4">
                {Object.entries(statsData.userStats.usersByStatus).map(([status, count]) => (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {status === 'active' ? 'Actifs' : 
                         status === 'suspended' ? 'Suspendus' : 'En attente'}
                      </span>
                      <span>{count} utilisateurs</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          status === 'active' 
                            ? 'bg-green-600' 
                            : status === 'suspended' 
                            ? 'bg-red-600'
                            : 'bg-yellow-600'
                        }`}
                        style={{ 
                          width: `${(count / statsData.userStats.totalUsers * 100).toFixed(1)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques des agents */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Statistiques des agents
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Distribution par catégorie */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                Répartition par catégorie
              </h3>
              <div className="space-y-4">
                {Object.entries(statsData.agentStats.agentsByCategory).map(([category, count], index) => (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {category}
                      </span>
                      <span>{count} agents</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full"
                        style={{ 
                          width: `${(count / statsData.agentStats.totalAgents * 100).toFixed(1)}%`,
                          backgroundColor: getColorForIndex(index)
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenus par catégorie */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                Revenus par catégorie
              </h3>
              <div className="space-y-4">
                {Object.entries(statsData.revenueStats.revenueByCategory).map(([category, amount], index) => (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {category}
                      </span>
                      <span>{formatValue(amount, 'currency')}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full"
                        style={{ 
                          width: `${(amount / statsData.revenueStats.totalRevenue * 100).toFixed(1)}%`,
                          backgroundColor: getColorForIndex(index)
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Note d'information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Ces statistiques sont mises à jour quotidiennement. Pour des analyses plus détaillées, veuillez consulter 
              le tableau de bord des <a href="/dashboard/admin/analytics" className="font-medium underline">analytics avancés</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fonction utilitaire pour générer des couleurs en fonction d'un index
function getColorForIndex(index: number): string {
  const colors = [
    '#3b82f6', // blue-500
    '#10b981', // green-500
    '#8b5cf6', // violet-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#06b6d4', // cyan-500
    '#ec4899', // pink-500
    '#f97316', // orange-500
    '#6366f1', // indigo-500
    '#14b8a6', // teal-500
  ];
  
  return colors[index % colors.length];
}
