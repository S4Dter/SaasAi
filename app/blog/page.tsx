import { Suspense } from 'react';
// Force dynamic rendering for this page too
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import Link from 'next/link';
import { getPosts } from '@/lib/blog/actions';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { BlogPagination } from '@/components/blog/blog-pagination';
import { BlogSidebar } from '@/components/blog/blog-sidebar';

export const metadata: Metadata = {
  title: 'Blog - Articles et actualités',
  description: 'Découvrez nos articles et actualités sur notre blog',
};

interface BlogPageProps {
  searchParams: {
    page?: string;
    category?: string;
    tag?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = Number(searchParams.page) || 1;
  const pageSize = 9; // Number of posts per page
  
  // Get blog posts
  const { data: posts, count, totalPages } = await getPosts({
    status: 'published',
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
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Découvrez nos derniers articles, actualités et conseils
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Aucun article disponible</h2>
              <p className="text-muted-foreground">
                Revenez bientôt pour découvrir nos nouveaux articles.
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
                baseUrl="/blog"
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
