import { Metadata } from 'next';
// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';
import { getAllTags } from '@/lib/blog/actions';
import { TagManager } from '@/components/blog-admin/tag-manager';

export const metadata: Metadata = {
  title: 'Gérer les tags - Dashboard',
  description: 'Gérez les tags de votre blog',
};

export default async function TagsPage() {
  const tags = await getAllTags();
  
  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Gestion des tags</h1>
        <p className="text-muted-foreground">
          Créez, modifiez et supprimez les tags de votre blog
        </p>
      </div>
      
      <TagManager tags={tags} />
    </div>
  );
}
