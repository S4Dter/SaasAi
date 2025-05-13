import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPosts } from '@/lib/blog/actions';
import { BlogPostContent } from '@/components/blog/blog-post-content';
import { BlogSidebar } from '@/components/blog/blog-sidebar';
import { createExcerpt } from '@/lib/blog/utils';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Article non trouvé',
      description: 'L\'article que vous recherchez n\'existe pas ou a été déplacé.'
    };
  }
  
  return {
    title: post.title,
    description: post.excerpt || createExcerpt(post.content),
    openGraph: {
      title: post.title,
      description: post.excerpt || createExcerpt(post.content),
      type: 'article',
      ...(post.featured_image && {
        images: [{ url: post.featured_image }]
      })
    }
  };
}

// Generate static params for all posts (for static site generation)
export async function generateStaticParams() {
  try {
    // Utiliser le client admin spécifique qui ne dépend pas des cookies
    const { getPublishedPostSlugs } = await import('@/lib/supabase-admin');
    
    const posts = await getPublishedPostSlugs();
    
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Erreur lors de la génération des paramètres statiques:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  // Check if post is published
  if (post.status !== 'published') {
    notFound();
  }
  
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2">
          <BlogPostContent post={post} />
        </div>
        
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <BlogSidebar recentPosts={recentPosts} />
        </aside>
      </div>
    </div>
  );
}
