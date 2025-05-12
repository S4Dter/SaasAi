import { Metadata } from 'next';
import Link from 'next/link';
import { getArticlesByCategory } from '@/lib/utils/blog';
import { notFound } from 'next/navigation';

type Props = {
  params: { category: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export function generateMetadata({ params }: Props): Metadata {
  const decodedCategory = decodeURIComponent(params.category).replace(/-/g, ' ');
  
  return {
    title: `${decodedCategory} - Catégorie - Blog - AgentMarket`,
    description: `Articles dans la catégorie ${decodedCategory}`,
  };
}

export default function CategoryPage({ params }: Props) {
  const decodedCategory = decodeURIComponent(params.category).replace(/-/g, ' ');
  const articles = getArticlesByCategory(decodedCategory);
  
  if (articles.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <Link href="/blog" className="text-blue-600 hover:underline">
            &larr; Retour au blog
          </Link>
        </div>
        
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Catégorie : {decodedCategory}</h1>
          <p className="text-xl text-gray-600">
            Aucun article trouvé dans cette catégorie
          </p>
        </section>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:underline">
          &larr; Retour au blog
        </Link>
      </div>
      
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Catégorie : {decodedCategory}</h1>
        <p className="text-xl text-gray-600">
          Découvrez tous nos articles dans la catégorie {decodedCategory}
        </p>
      </section>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <article key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              [Image de l'article]
            </div>
            <div className="p-6">
              <span className="text-gray-500 text-sm">{article.date} • {article.category.toUpperCase()}</span>
              <h2 className="text-xl font-bold mt-2 mb-3">{article.title}</h2>
              <p className="text-gray-600 mb-4">
                {article.excerpt}
              </p>
              <Link href={`/blog/${article.slug}`} className="text-blue-600 hover:underline">
                Lire la suite &rarr;
              </Link>
            </div>
          </article>
        ))}
      </div>
      
      {articles.length > 6 && (
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center">
            <span className="px-4 py-2 text-gray-500">Page</span>
            <a href="#" className="px-4 py-2 mx-1 bg-blue-600 text-white rounded-md">1</a>
            <a href="#" className="px-4 py-2 mx-1 text-gray-700 hover:bg-gray-100 rounded-md">2</a>
            <a href="#" className="px-4 py-2 mx-1 text-gray-700 hover:bg-gray-100 rounded-md">3</a>
            <span className="px-4 py-2 text-gray-500">...</span>
          </nav>
        </div>
      )}
    </div>
  );
}
