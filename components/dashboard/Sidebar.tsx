import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '../../constants';

interface SidebarProps {
  type: 'enterprise' | 'creator';
}

/**
 * Composant Sidebar pour les dashboards
 * 
 * @param {SidebarProps} props - Propriétés du composant
 */
const Sidebar: React.FC<SidebarProps> = ({ type }) => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  const isEnterprise = type === 'enterprise';
  
  const navItems = isEnterprise 
    ? [
        { name: 'Tableau de bord', path: ROUTES.DASHBOARD.ENTERPRISE.ROOT, icon: 'dashboard' },
        { name: 'Favoris', path: ROUTES.DASHBOARD.ENTERPRISE.FAVORITES, icon: 'star' },
        { name: 'Historique des contacts', path: ROUTES.DASHBOARD.ENTERPRISE.HISTORY, icon: 'history' },
        { name: 'Suggestions', path: ROUTES.DASHBOARD.ENTERPRISE.SUGGESTIONS, icon: 'lightbulb' },
      ]
    : [
        { name: 'Tableau de bord', path: ROUTES.DASHBOARD.CREATOR.ROOT, icon: 'dashboard' },
        { name: 'Mes agents', path: ROUTES.DASHBOARD.CREATOR.AGENTS, icon: 'bots' },
        { name: 'Statistiques', path: ROUTES.DASHBOARD.CREATOR.STATS, icon: 'chart' },
        { name: 'Prospection', path: ROUTES.DASHBOARD.CREATOR.PROSPECTION, icon: 'users' },
        { name: 'Ajouter un agent', path: ROUTES.DASHBOARD.CREATOR.ADD_AGENT, icon: 'plus' },
      ];

  // Fonction pour afficher l'icône (simplifiée, utiliserait des SVG dans une vraie application)
  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'dashboard':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        );
      case 'star':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      case 'history':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'lightbulb':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'bots':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        );
      case 'chart':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'plus':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="bg-white border-r border-gray-200 w-64 flex-shrink-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {isEnterprise ? 'Espace Entreprise' : 'Espace Créateur'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isEnterprise ? 'Gérez vos agents favoris' : 'Gérez vos agents et prospects'}
        </p>
      </div>
      
      <nav className="mt-2 pb-6">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600 pl-5'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{renderIcon(item.icon)}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-700 font-medium">
              {isEnterprise ? 'E' : 'C'}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {isEnterprise ? 'Entreprise Demo' : 'Créateur Demo'}
            </p>
            <p className="text-xs text-gray-500">
              {isEnterprise ? 'entreprise@example.com' : 'createur@example.com'}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-blue-600 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
