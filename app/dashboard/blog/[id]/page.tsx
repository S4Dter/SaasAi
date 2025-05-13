import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostById } from '@/lib/blog/actions';
import { PostForm } from '@/components/blog-admin/post-form';

interface PostEditPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PostEditPageProps): Promise<Metadata> {
  const post = await getPostById(params.id);
  
  if (!post) {
    return {
      title: 'Article non trouvé - Dashboard',
      description: 'L\'article que vous recherchez n\'existe pas.'
    };
  }
  
  return {
    title: `Modifier: ${post.title} - Dashboard`,
    description: `Modifier l'article "${post.title}"`,
  };
}

export default async function EditPostPage({ params }: PostEditPageProps) {
  const post = await getPostById(params.id);
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Modifier un article</h1>
        <p className="text-muted-foreground">
          Modifier l'article "{post.title}"
        </p>
      </div>
      
      <PostForm post={post} isEditing />
    </div>
  );
}
