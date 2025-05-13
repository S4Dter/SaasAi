import { Metadata } from 'next';
import { PostForm } from '@/components/blog-admin/post-form';

export const metadata: Metadata = {
  title: 'Nouvel article - Dashboard',
  description: 'Créez un nouvel article pour votre blog',
};

export default function NewPostPage() {
  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Nouvel article</h1>
        <p className="text-muted-foreground">
          Créez un nouvel article pour votre blog
        </p>
      </div>
      
      <PostForm />
    </div>
  );
}
