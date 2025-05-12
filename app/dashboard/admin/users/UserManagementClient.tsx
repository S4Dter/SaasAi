'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Users, Search, Filter, CheckCircle, XCircle, Shield, Edit, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { updateUserStatus, updateUserRole } from '@/lib/api/admin';

// Types pour les utilisateurs et filtres
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  company?: string;
  avatar?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

type Filters = {
  role?: string;
  status?: string;
  search?: string;
};

interface UserManagementClientProps {
  initialUsers: User[];
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  initialFilters: Filters;
}

export default function UserManagementClient({
  initialUsers,
  totalUsers,
  currentPage,
  totalPages,
  initialFilters,
}: UserManagementClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // État local
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [searchInput, setSearchInput] = useState(initialFilters.search || '');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionMenuVisible, setActionMenuVisible] = useState<{ [key: string]: boolean }>({});
  
  // Options de filtrage
  const roleOptions = [
    { value: '', label: 'Tous les rôles' },
    { value: 'creator', label: 'Créateurs' },
    { value: 'enterprise', label: 'Entreprises' },
    { value: 'admin', label: 'Administrateurs' },
  ];
  
  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'active', label: 'Actifs' },
    { value: 'suspended', label: 'Suspendus' },
    { value: 'pending', label: 'En attente' },
  ];

  // Formatter les dates pour l'affichage
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Mettre à jour l'URL avec les filtres
  const updateURLParams = (newFilters: Filters, page: number = 1) => {
    const params = new URLSearchParams();
    
    if (newFilters.role) params.set('role', newFilters.role);
    if (newFilters.status) params.set('status', newFilters.status);
    if (newFilters.search) params.set('search', newFilters.search);
    if (page > 1) params.set('page', page.toString());
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // Gestionnaire de changement de filtre
  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  // Gestionnaire de recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters = { ...filters, search: searchInput };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  // Gestionnaire de changement de page
  const handlePageChange = (page: number) => {
    updateURLParams(filters, page);
  };

  // Afficher/masquer le menu d'action pour un utilisateur
  const toggleActionMenu = (userId: string) => {
    setActionMenuVisible(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Actions sur les utilisateurs
  const handleUserStatusChange = async (userId: string, newStatus: 'active' | 'suspended' | 'pending') => {
    try {
      setIsLoading(true);
      await updateUserStatus(userId, newStatus);
      
      // Mettre à jour l'état local après succès
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      setActionMenuVisible({});
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert(`Erreur lors de la mise à jour du statut: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserRoleChange = async (userId: string, newRole: 'enterprise' | 'creator' | 'admin') => {
    try {
      setIsLoading(true);
      await updateUserRole(userId, newRole);
      
      // Mettre à jour l'état local après succès
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      setActionMenuVisible({});
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      alert(`Erreur lors de la mise à jour du rôle: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Composant pour les badges de statut
  const StatusBadge = ({ status }: { status?: string }) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            Actif
          </span>
        );
      case 'suspended':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            Suspendu
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            En attente
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            Inconnu
          </span>
        );
    }
  };

  // Composant pour les badges de rôle
  const RoleBadge = ({ role }: { role: string }) => {
    switch (role) {
      case 'admin':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
            Administrateur
          </span>
        );
      case 'creator':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            Créateur
          </span>
        );
      case 'enterprise':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
            Entreprise
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            {role}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex-1 flex gap-2">
          <div className="flex-1">
            <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rôle
            </label>
            <select
              id="roleFilter"
              value={filters.role || ''}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Statut
            </label>
            <select
              id="statusFilter"
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex-1">
          <form onSubmit={handleSearch}>
            <label htmlFor="searchInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recherche
            </label>
            <div className="relative">
              <input
                id="searchInput"
                type="text"
                placeholder="Nom, email, entreprise..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-3 flex items-center bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                disabled={isLoading}
              >
                Rechercher
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rôle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.avatar}
                            alt={user.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <Users className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {user.email}
                        </div>
                        {user.company && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {user.company}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button
                      onClick={() => toggleActionMenu(user.id)}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    
                    {actionMenuVisible[user.id] && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                          {/* Options de statut */}
                          {user.status !== 'active' && (
                            <button
                              onClick={() => handleUserStatusChange(user.id, 'active')}
                              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                              role="menuitem"
                              disabled={isLoading}
                            >
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              Activer
                            </button>
                          )}
                          
                          {user.status !== 'suspended' && (
                            <button
                              onClick={() => handleUserStatusChange(user.id, 'suspended')}
                              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                              role="menuitem"
                              disabled={isLoading}
                            >
                              <XCircle className="h-4 w-4 mr-2 text-red-500" />
                              Suspendre
                            </button>
                          )}
                          
                          {/* Options de rôle */}
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleUserRoleChange(user.id, 'admin')}
                              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                              role="menuitem"
                              disabled={isLoading}
                            >
                              <Shield className="h-4 w-4 mr-2 text-purple-500" />
                              Promouvoir Admin
                            </button>
                          )}
                          
                          {user.role !== 'creator' && (
                            <button
                              onClick={() => handleUserRoleChange(user.id, 'creator')}
                              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                              role="menuitem"
                              disabled={isLoading}
                            >
                              <Edit className="h-4 w-4 mr-2 text-blue-500" />
                              Définir comme Créateur
                            </button>
                          )}
                          
                          {user.role !== 'enterprise' && (
                            <button
                              onClick={() => handleUserRoleChange(user.id, 'enterprise')}
                              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                              role="menuitem"
                              disabled={isLoading}
                            >
                              <Users className="h-4 w-4 mr-2 text-indigo-500" />
                              Définir comme Entreprise
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Aucun utilisateur trouvé avec les filtres actuels
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Affichage de {users.length} utilisateurs sur {totalUsers}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              className={`px-3 py-1 rounded-md ${
                currentPage <= 1
                  ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Précédent
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logique pour limiter le nombre de pages affichées
              let pageToShow;
              if (totalPages <= 5) {
                pageToShow = i + 1;
              } else if (currentPage <= 3) {
                pageToShow = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageToShow = totalPages - 4 + i;
              } else {
                pageToShow = currentPage - 2 + i;
              }
              
              // Afficher seulement si la page à montrer est valide
              if (pageToShow > 0 && pageToShow <= totalPages) {
                return (
                  <button
                    key={pageToShow}
                    onClick={() => handlePageChange(pageToShow)}
                    disabled={isLoading}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === pageToShow
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {pageToShow}
                  </button>
                );
              }
              return null;
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className={`px-3 py-1 rounded-md ${
                currentPage >= totalPages
                  ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
