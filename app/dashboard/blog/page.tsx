import { Metadata } from 'next';
// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { getPosts } from '@/lib/blog/actions';
import { PostList } from '@/components/blog-admin/post-list';

export const metadata: Metadata = {
  title: 'Gérer les articles - Dashboard',
  description: 'Gérez les articles de votre blog',
};

interface BlogDashboardPageProps {
  searchParams: {
    page?: string;
    status?: string;
  };
}

export default async function BlogDashboardPage({ searchParams }: BlogDashboardPageProps) {
  const page = Number(searchParams.page) || 1;
  const status = (searchParams.status === 'published' || searchParams.status === 'draft') 
    ? searchParams.status 
    : undefined;
  
  // Get blog posts with pagination
  const { data: posts, count, totalPages } = await getPosts({
    status,
    page,
    pageSize: 10,
    orderBy: 'updated_at',
    orderDirection: 'desc',
  });
  
  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gestion des articles</h1>
        <Link
          href="/dashboard/blog/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
        >
          Nouvel article
        </Link>
      </div>
      
      <div className="space-y-6">
        <PostList 
          posts={posts} 
          currentPage={page} 
          totalPages={totalPages} 
          totalPosts={count}
          currentStatus={status}
        />
      </div>
    </div>
  );
}
