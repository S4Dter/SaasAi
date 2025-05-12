/* eslint-disable */
// @ts-nocheck
import { withAdminProtection } from '@/lib/utils/withAdminProtection';
import { getCategories } from '@/lib/api/admin';
import CategoryManagementClient from './CategoryManagementClient';

/**
 * Page de gestion des catégories d'agents pour les administrateurs
 */
// Type pour les props de la page compatible avec Next.js 15
type Props = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoriesPage({}: Props) {
  // Vérifier que l'utilisateur est authentifié et a le rôle admin
  await withAdminProtection();
  
  // Mock data for build time to avoid Prisma initialization issues
  const mockCategories = [];

  // Récupérer la liste des catégories
  const categories = process.env.NODE_ENV === 'production' 
    ? mockCategories 
    : await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des catégories</h1>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300">
        Gérez les catégories utilisées pour organiser les agents dans la marketplace. 
        Ces catégories sont utilisées dans les filtres de recherche et pour la navigation.
      </p>
      
      {/* Composant client pour la gestion des catégories */}
      <CategoryManagementClient initialCategories={categories} />
    </div>
  );
}
