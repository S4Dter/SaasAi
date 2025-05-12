import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const categoryParam = await params;
  
  return {
    title: `${categoryParam.category} - Catégorie - Blog - AgentMarket`,
    description: `Articles dans la catégorie ${categoryParam.category}`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const categoryParam = await params;
  const category = categoryParam.category;
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:underline">
          &larr; Retour au blog
        </Link>
      </div>
      
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Catégorie : {category}</h1>
        <p className="text-xl text-gray-600">
          Découvrez tous nos articles dans la catégorie {category}
        </p>
      </section>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Article 1 */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            [Image de l'article]
          </div>
          <div className="p-6">
            <span className="text-gray-500 text-sm">01 JAN 2025 • {category.toUpperCase()}</span>
            <h2 className="text-xl font-bold mt-2 mb-3">Titre de l'article 1</h2>
            <p className="text-gray-600 mb-4">
              Description courte de l'article qui présente son contenu de manière attrayante.
            </p>
            <Link href="/blog/article-1" className="text-blue-600 hover:underline">
              Lire la suite &rarr;
            </Link>
          </div>
        </article>
        
        {/* Article 2 */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            [Image de l'article]
          </div>
          <div className="p-6">
            <span className="text-gray-500 text-sm">01 JAN 2025 • {category.toUpperCase()}</span>
            <h2 className="text-xl font-bold mt-2 mb-3">Titre de l'article 2</h2>
            <p className="text-gray-600 mb-4">
              Description courte de l'article qui présente son contenu de manière attrayante.
            </p>
            <Link href="/blog/article-2" className="text-blue-600 hover:underline">
              Lire la suite &rarr;
            </Link>
          </div>
        </article>
        
        {/* Article 3 */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            [Image de l'article]
          </div>
          <div className="p-6">
            <span className="text-gray-500 text-sm">01 JAN 2025 • {category.toUpperCase()}</span>
            <h2 className="text-xl font-bold mt-2 mb-3">Titre de l'article 3</h2>
            <p className="text-gray-600 mb-4">
              Description courte de l'article qui présente son contenu de manière attrayante.
            </p>
            <Link href="/blog/article-3" className="text-blue-600 hover:underline">
              Lire la suite &rarr;
            </Link>
          </div>
        </article>
        
        {/* Article 4 */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            [Image de l'article]
          </div>
          <div className="p-6">
            <span className="text-gray-500 text-sm">01 JAN 2025 • {category.toUpperCase()}</span>
            <h2 className="text-xl font-bold mt-2 mb-3">Titre de l'article 4</h2>
            <p className="text-gray-600 mb-4">
              Description courte de l'article qui présente son contenu de manière attrayante.
            </p>
            <Link href="/blog/article-4" className="text-blue-600 hover:underline">
              Lire la suite &rarr;
            </Link>
          </div>
        </article>
        
        {/* Article 5 */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            [Image de l'article]
          </div>
          <div className="p-6">
            <span className="text-gray-500 text-sm">01 JAN 2025 • {category.toUpperCase()}</span>
            <h2 className="text-xl font-bold mt-2 mb-3">Titre de l'article 5</h2>
            <p className="text-gray-600 mb-4">
              Description courte de l'article qui présente son contenu de manière attrayante.
            </p>
            <Link href="/blog/article-5" className="text-blue-600 hover:underline">
              Lire la suite &rarr;
            </Link>
          </div>
        </article>
        
        {/* Article 6 */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            [Image de l'article]
          </div>
          <div className="p-6">
            <span className="text-gray-500 text-sm">01 JAN 2025 • {category.toUpperCase()}</span>
            <h2 className="text-xl font-bold mt-2 mb-3">Titre de l'article 6</h2>
            <p className="text-gray-600 mb-4">
              Description courte de l'article qui présente son contenu de manière attrayante.
            </p>
            <Link href="/blog/article-6" className="text-blue-600 hover:underline">
              Lire la suite &rarr;
            </Link>
          </div>
        </article>
      </div>
      
      <div className="mt-12 flex justify-center">
        <nav className="flex items-center">
          <span className="px-4 py-2 text-gray-500">Page</span>
          <a href="#" className="px-4 py-2 mx-1 bg-blue-600 text-white rounded-md">1</a>
          <a href="#" className="px-4 py-2 mx-1 text-gray-700 hover:bg-gray-100 rounded-md">2</a>
          <a href="#" className="px-4 py-2 mx-1 text-gray-700 hover:bg-gray-100 rounded-md">3</a>
          <span className="px-4 py-2 text-gray-500">...</span>
        </nav>
      </div>
    </div>
  );
}
