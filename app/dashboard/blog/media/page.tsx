import { Metadata } from 'next';
import { getAllMedia } from '@/lib/blog/actions';
import { MediaLibrary } from '@/components/blog-admin/media-library';

export const metadata: Metadata = {
  title: 'Gérer les médias - Dashboard',
  description: 'Gérez les médias de votre blog',
};

export default async function MediaPage() {
  const media = await getAllMedia();
  
  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Gestion des médias</h1>
        <p className="text-muted-foreground">
          Uploadez et gérez les images et autres médias pour votre blog
        </p>
      </div>
      
      <MediaLibrary initialMedia={media} />
    </div>
  );
}
