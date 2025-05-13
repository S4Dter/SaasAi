import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPostsByTag, getAllTags } from '@/data/blog-posts';

// Générer les métadonnées dynamiquement
export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag);
  const posts = getBlogPostsByTag(tag);
  
  if (!posts.length) {
    return {
      title: 'Tag non trouvé',
      description: 'Le tag que vous recherchez n\'existe pas',
    };
  }
  
  return {
    title: `Articles tagués #${tag} - Blog`,
    description: `Découvrez tous nos articles tagués #${tag} et les dernières tendances en IA.`,
  };
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const posts = getBlogPostsByTag(tag);
  
  if (!posts.length) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 flex items-center mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Retour au blog
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Articles tagués : #{tag}</h1>
          <p className="text-gray-600 mt-2">{posts.length} article{posts.length > 1 ? 's' : ''}</p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                {post.coverImage && (
                  <div className="md:w-1/3">
                    <Link href={`/blog/${post.slug}`}>
                      <div className="relative h-48 md:h-full">
                        <Image 
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>
                  </div>
                )}
                
                <div className="p-6 md:w-2/3">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {post.category}
                    </span>
                    <span className="mx-2">•</span>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </time>
                  </div>
                  
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  
                  <div className="flex items-center">
                    {post.author.avatar && (
                      <div className="relative w-10 h-10 mr-4">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                      <p className="text-sm text-gray-500">{post.author.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
