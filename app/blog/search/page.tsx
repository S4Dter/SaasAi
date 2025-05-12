import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Recherche - Blog - AgentMarket',
  description: 'Rechercher des articles dans notre blog',
};

export default function SearchPage({ 
  searchParams 
}: { 
  searchParams: { q?: string | string[] }
}) {
  const query = searchParams?.q || '';
  const hasQuery = query.length > 0;
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:underline">
          &larr; Retour au blog
        </Link>
      </div>
      
      <section className="mb-10">
        <h1 className="text-4xl font-bold mb-6">Recherche d'articles</h1>
        
        <form className="mb-8 max-w-3xl mx-auto">
          <div className="flex items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                name="q"
                placeholder="Rechercher des articles..."
                defaultValue={query}
                className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Rechercher
            </button>
          </div>
        </form>
        
        {hasQuery ? (
          <>
            <p className="text-xl mb-8 text-center">
              Résultats de recherche pour : <span className="font-semibold">"{query}"</span>
            </p>
            
            {/* Résultats de recherche */}
            <div className="space-y-8 max-w-4xl mx-auto">
              <article className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 bg-gray-200 h-48 flex items-center justify-center rounded-lg">
                  [Image de l'article]
                </div>
                <div className="md:w-3/4">
                  <span className="text-gray-500 text-sm">01 JAN 2025 • CATÉGORIE</span>
                  <h2 className="text-xl font-bold mt-2 mb-3">Résultat d'article 1 contenant "{query}"</h2>
                  <p className="text-gray-600 mb-4">
                    Description de l'article avec le terme <mark className="bg-yellow-200 px-1">{query}</mark> mis en évidence.
                    Cette description donne un aperçu du contenu et incite à la lecture.
                  </p>
                  <Link href="/blog/article-1" className="text-blue-600 hover:underline">
                    Lire la suite &rarr;
                  </Link>
                </div>
              </article>
              
              <article className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 bg-gray-200 h-48 flex items-center justify-center rounded-lg">
                  [Image de l'article]
                </div>
                <div className="md:w-3/4">
                  <span className="text-gray-500 text-sm">01 JAN 2025 • CATÉGORIE</span>
                  <h2 className="text-xl font-bold mt-2 mb-3">Résultat d'article 2 avec "{query}"</h2>
                  <p className="text-gray-600 mb-4">
                    Description de l'article avec le terme <mark className="bg-yellow-200 px-1">{query}</mark> mis en évidence.
                    Cette description donne un aperçu du contenu et incite à la lecture.
                  </p>
                  <Link href="/blog/article-2" className="text-blue-600 hover:underline">
                    Lire la suite &rarr;
                  </Link>
                </div>
              </article>
              
              <article className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 bg-gray-200 h-48 flex items-center justify-center rounded-lg">
                  [Image de l'article]
                </div>
                <div className="md:w-3/4">
                  <span className="text-gray-500 text-sm">01 JAN 2025 • CATÉGORIE</span>
                  <h2 className="text-xl font-bold mt-2 mb-3">Résultat d'article 3 mentionnant "{query}"</h2>
                  <p className="text-gray-600 mb-4">
                    Description de l'article avec le terme <mark className="bg-yellow-200 px-1">{query}</mark> mis en évidence.
                    Cette description donne un aperçu du contenu et incite à la lecture.
                  </p>
                  <Link href="/blog/article-3" className="text-blue-600 hover:underline">
                    Lire la suite &rarr;
                  </Link>
                </div>
              </article>
            </div>
            
            <div className="mt-10 flex justify-center">
              <nav className="flex items-center">
                <span className="px-4 py-2 text-gray-500">Page</span>
                <a href="#" className="px-4 py-2 mx-1 bg-blue-600 text-white rounded-md">1</a>
                <a href="#" className="px-4 py-2 mx-1 text-gray-700 hover:bg-gray-100 rounded-md">2</a>
                <span className="px-4 py-2 text-gray-500">...</span>
              </nav>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600 mt-10">
            Entrez un terme de recherche ci-dessus pour trouver des articles.
          </div>
        )}
      </section>
    </div>
  );
}
