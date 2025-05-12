import { withAdminProtection } from '@/lib/utils/withAdminProtection';
import { getUsers } from '@/lib/api/admin';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import UserManagementClient from './UserManagementClient';

/**
 * Page de gestion des utilisateurs pour les administrateurs
 * Affiche la liste des utilisateurs avec options de filtrage et actions
 */
export default async function UsersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Vérifier que l'utilisateur est authentifié et a le rôle admin
  await withAdminProtection();
  
  // Extraire les paramètres de recherche
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const role = searchParams.role as string | undefined;
  const status = searchParams.status as string | undefined;
  const search = searchParams.search as string | undefined;
  
  // Récupérer la liste des utilisateurs avec pagination et filtres
  const usersData = await getUsers({
    page,
    limit: 20,
    role,
    status,
    search,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        
        <div>
          {/* Si besoin de boutons d'action globaux */}
        </div>
      </div>
      
      {/* Composant client pour la gestion des utilisateurs */}
      <UserManagementClient 
        initialUsers={usersData.users} 
        totalUsers={usersData.totalCount}
        currentPage={usersData.currentPage}
        totalPages={usersData.totalPages}
        initialFilters={{ role, status, search }}
      />
    </div>
  );
}
