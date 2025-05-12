import { withAdminProtection } from '@/lib/utils/withAdminProtection';
import { getCategories } from '@/lib/api/admin';
import CategoryManagementClient from './CategoryManagementClient';

/**
 * Page de gestion des catégories d'agents pour les administrateurs
 */
export default async function CategoriesPage() {
  // Vérifier que l'utilisateur est authentifié et a le rôle admin
  await withAdminProtection();
  
  // Récupérer la liste des catégories
  const categories = await getCategories();

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
