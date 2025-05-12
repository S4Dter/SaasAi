'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Tag, 
  Settings, 
  AlertTriangle, 
  BarChart2,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { ROUTES } from '@/constants';

const adminRoutes = [
  {
    name: 'Vue d\'ensemble',
    href: ROUTES.DASHBOARD.ADMIN.ROOT,
    icon: <LayoutDashboard className="w-5 h-5" />,
    exact: true,
  },
  {
    name: 'Statistiques',
    href: ROUTES.DASHBOARD.ADMIN.STATS,
    icon: <BarChart2 className="w-5 h-5" />,
  },
  {
    name: 'Utilisateurs',
    href: ROUTES.DASHBOARD.ADMIN.USERS,
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: 'Agents',
    href: ROUTES.DASHBOARD.ADMIN.AGENTS,
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    name: 'Catégories',
    href: ROUTES.DASHBOARD.ADMIN.CATEGORIES,
    icon: <Tag className="w-5 h-5" />,
  },
  {
    name: 'Signalements',
    href: ROUTES.DASHBOARD.ADMIN.REPORTS,
    icon: <AlertTriangle className="w-5 h-5" />,
  },
  {
    name: 'Paramètres',
    href: ROUTES.DASHBOARD.ADMIN.SETTINGS,
    icon: <Settings className="w-5 h-5" />,
  },
];

/**
 * Barre latérale pour le tableau de bord administrateur
 */
export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Bouton de menu pour mobile */}
      <div className="lg:hidden fixed top-0 left-0 z-40 w-full bg-white dark:bg-gray-800 shadow px-4 py-3 flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-bold text-gray-900 dark:text-white">Administration</span>
        <div className="w-6" />
      </div>

      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed lg:relative inset-y-0 left-0 z-40 w-64 transition-transform transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* En-tête */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-8 h-8 text-blue-600" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path 
                  d="M12 4L4 8L12 12L20 8L12 4Z" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M4 12L12 16L20 12" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M4 16L12 20L20 16" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span>Admin</span>
            </span>
            
            <button 
              onClick={toggleSidebar}
              className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Menu de navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {adminRoutes.map((route) => {
                const isActive = route.exact 
                  ? pathname === route.href
                  : pathname.startsWith(route.href);
                  
                return (
                  <li key={route.href}>
                    <Link 
                      href={route.href}
                      className={`flex items-center space-x-2 p-3 rounded-lg transition-colors
                        ${isActive
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                      <span className={isActive ? 'text-blue-600 dark:text-blue-400' : ''}>
                        {route.icon}
                      </span>
                      <span>{route.name}</span>
                      
                      {/* Indicateurs pour les sections avec des éléments en attente */}
                      {route.name === 'Agents' && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full px-2 py-0.5 ml-auto">
                          5
                        </span>
                      )}
                      {route.name === 'Signalements' && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium rounded-full px-2 py-0.5 ml-auto">
                          3
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            
            <hr className="my-6 border-gray-200 dark:border-gray-700" />
            
            {/* Liens utilitaires */}
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Retour au site</span>
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.AUTH.SIGNOUT}
                  className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Déconnexion</span>
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Pied de page */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Connecté en tant qu'administrateur
              </div>
              <div className="font-medium text-gray-900 dark:text-white truncate">
                admin@exemple.fr
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Espacement pour le menu mobile fixe */}
      <div className="lg:hidden h-16"></div>
    </>
  );
}
