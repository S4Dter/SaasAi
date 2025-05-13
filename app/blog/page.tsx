import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllBlogPosts, getAllCategories, getAllTags } from '@/data/blog-posts';

export const metadata: Metadata = {
  title: 'Blog - Articles sur les agents IA',
  description: 'Découvrez nos articles sur les agents IA, les tendances et les meilleures pratiques pour intégrer l\'intelligence artificielle.',
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const categories = getAllCategories();
  const tags = getAllTags();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Articles */}
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold mb-6">Tous les articles</h2>
          
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
        
        {/* Sidebar */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">Catégories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link key={category} href={`/blog/category/${category.toLowerCase()}`}>
                  <span className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full transition-colors">
                    {category}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Tags populaires</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link key={tag} href={`/blog/tag/${tag}`}>
                  <span className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded transition-colors">
                    #{tag}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
