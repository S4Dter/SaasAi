import { Suspense } from 'react';
import { Metadata } from 'next';
import { searchPosts, getPosts } from '@/lib/blog/actions';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { BlogPagination } from '@/components/blog/blog-pagination';
import { BlogSidebar } from '@/components/blog/blog-sidebar';
import { BlogSearch } from '@/components/blog/blog-search';

export const metadata: Metadata = {
  title: 'Recherche - Blog',
  description: 'Recherchez des articles dans notre blog',
  robots: {
    index: false,
    follow: true,
  }
};

interface SearchPageProps {
  searchParams: {
    q?: string;
    page?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const page = Number(searchParams.page) || 1;
  const pageSize = 9; // Number of posts per page
  
  // Get search results
  const { data: posts, count, totalPages } = await searchPosts(query, page, pageSize);
  
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
        <h1 className="text-3xl font-bold tracking-tight mb-4">Recherche</h1>
        <div className="max-w-xl mb-6">
          <BlogSearch defaultValue={query} />
        </div>
        {query && (
          <p className="text-lg text-muted-foreground">
            {count > 0 
              ? `${count} résultat${count > 1 ? 's' : ''} pour "${query}"`
              : `Aucun résultat pour "${query}"`
            }
          </p>
        )}
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2">
          {!query ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Commencez votre recherche</h2>
              <p className="text-muted-foreground">
                Entrez un terme de recherche ci-dessus pour trouver des articles.
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Aucun résultat trouvé</h2>
              <p className="text-muted-foreground">
                Essayez avec d'autres termes de recherche ou consultez nos catégories.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 mb-10">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <BlogPagination
                  currentPage={page}
                  totalPages={totalPages}
                  baseUrl={`/blog/search?q=${encodeURIComponent(query)}`}
                />
              )}
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
