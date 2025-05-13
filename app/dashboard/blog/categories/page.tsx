import { Metadata } from 'next';
import { getAllCategories } from '@/lib/blog/actions';
import { CategoryManager } from '@/components/blog-admin/category-manager';

export const metadata: Metadata = {
  title: 'Gérer les catégories - Dashboard',
  description: 'Gérez les catégories de votre blog',
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();
  
  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Gestion des catégories</h1>
        <p className="text-muted-foreground">
          Créez, modifiez et supprimez les catégories de votre blog
        </p>
      </div>
      
      <CategoryManager categories={categories} />
    </div>
  );
}
