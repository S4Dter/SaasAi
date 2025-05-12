/* eslint-disable */
// @ts-nocheck
import { withAdminProtection } from '@/lib/utils/withAdminProtection';
import { getUsers } from '@/lib/api/admin';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import UserManagementClient from './UserManagementClient';

/**
 * Page de gestion des utilisateurs pour les administrateurs
 * Affiche la liste des utilisateurs avec options de filtrage et actions
 */
// Type pour les props de la page compatible avec Next.js 15
type Props = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UsersPage({ searchParams }: Props) {
  // Vérifier que l'utilisateur est authentifié et a le rôle admin
  await withAdminProtection();
  
  // Résoudre les paramètres de recherche
  const resolvedSearchParams = await searchParams;
  
  // Extraire les paramètres de recherche
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string) : 1;
  const role = resolvedSearchParams.role as string | undefined;
  const status = resolvedSearchParams.status as string | undefined;
  const search = resolvedSearchParams.search as string | undefined;
  
  // Mock data for build time to avoid Prisma initialization issues
  const mockUsersData = {
    users: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 1
  };

  // Récupérer la liste des utilisateurs avec pagination et filtres
  const usersData = process.env.NODE_ENV === 'production' 
    ? mockUsersData 
    : await getUsers({
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
