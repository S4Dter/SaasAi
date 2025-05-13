import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPosts, getCategoryBySlug, getAllCategories } from '@/lib/blog/actions';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { BlogPagination } from '@/components/blog/blog-pagination';
import { BlogSidebar } from '@/components/blog/blog-sidebar';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  
  if (!category) {
    return {
      title: 'Catégorie non trouvée',
      description: 'La catégorie que vous recherchez n\'existe pas.'
    };
  }
  
  return {
    title: `${category.name} - Articles et actualités`,
    description: category.description || `Découvrez tous nos articles dans la catégorie ${category.name}`,
  };
}

// Generate static params for all categories (for static site generation)
export async function generateStaticParams() {
  const categories = await getAllCategories();
  
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  
  if (!category) {
    notFound();
  }
  
  const page = Number(searchParams.page) || 1;
  const pageSize = 9; // Number of posts per page
  
  // Get all posts with this category
  const { data: posts, count, totalPages } = await getPosts({
    status: 'published',
    categoryId: category.id,
    page,
    pageSize,
    orderBy: 'published_at',
    orderDirection: 'desc',
  });
  
  // Get recent posts for sidebar
  const { data: recentPosts } = await getPosts({
    status: 'published',
    page: 1,
    pageSize: 5,
    orderBy: 'published_at',
    orderDirection: 'desc',
  });
  
  return (
    <div className="container px-4 py-12 mx-auto max-w-7xl">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Catégorie: {category.name}</h1>
        {category.description && (
          <p className="text-lg text-muted-foreground">{category.description}</p>
        )}
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Aucun article dans cette catégorie</h2>
              <p className="text-muted-foreground">
                Revenez bientôt pour découvrir nos nouveaux articles dans cette catégorie.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 mb-10">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
              
              <BlogPagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl={`/blog/categories/${category.slug}`}
              />
            </>
          )}
        </div>
        
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <Suspense fallback={<div>Chargement...</div>}>
            <BlogSidebar recentPosts={recentPosts} />
          </Suspense>
        </aside>
      </div>
    </div>
  );
}
