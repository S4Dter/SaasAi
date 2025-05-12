import { Metadata } from 'next';
import Link from 'next/link';
import { searchArticles } from '@/lib/utils/blog';

export const metadata: Metadata = {
  title: 'Recherche - Blog - AgentMarket',
  description: 'Rechercher des articles sur notre blog',
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const searchQuery = searchParams.q || '';
  const searchResults = searchQuery ? searchArticles(searchQuery) : [];
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:underline">
          &larr; Retour au blog
        </Link>
      </div>
      
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Résultats de recherche</h1>
        <p className="text-xl text-gray-600">
          {searchQuery ? (
            <>
              {searchResults.length} résultat{searchResults.length !== 1 ? 's' : ''} trouvé{searchResults.length !== 1 ? 's' : ''} pour <strong>"{searchQuery}"</strong>
            </>
          ) : (
            'Veuillez saisir un terme de recherche'
          )}
        </p>
        
        <div className="mt-6">
          <form action="/blog/search" method="get" className="flex w-full max-w-2xl">
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Rechercher des articles..."
              className="flex-grow px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-r-md hover:bg-blue-700 transition"
            >
              Rechercher
            </button>
          </form>
        </div>
      </section>
      
      {searchQuery && (
        <div className="space-y-8">
          {searchResults.length > 0 ? (
            searchResults.map((article, index) => (
              <article key={index} className="flex flex-col md:flex-row gap-6 pb-8 border-b border-gray-200">
                <div className="md:w-1/3 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">[Image de l'article]</span>
                </div>
                <div className="md:w-2/3">
                  <div className="text-sm text-gray-500 mb-2">{article.date} • {article.category.toUpperCase()}</div>
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {article.excerpt}
                  </p>
                  <Link href={`/blog/${article.slug}`} className="text-blue-600 font-medium hover:underline">
                    Lire la suite →
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-7xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold mb-2">Aucun résultat trouvé</h2>
              <p className="text-gray-600 mb-6">
                Nous n'avons trouvé aucun article correspondant à votre recherche. Essayez avec d'autres termes.
              </p>
              <Link href="/blog" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
                Retourner au blog
              </Link>
            </div>
          )}
        </div>
      )}
      
      {searchResults.length > 0 && searchResults.length > 10 && (
        <div className="mt-12 flex justify-center">
          <nav className="inline-flex">
            <span className="px-4 py-2 border border-gray-300 rounded-l-md bg-white text-gray-500">
              Précédent
            </span>
            <span className="px-4 py-2 border-t border-b border-gray-300 bg-blue-600 text-white">
              1
            </span>
            <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              2
            </a>
            <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              3
            </a>
            <span className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700">
              ...
            </span>
            <a href="#" className="px-4 py-2 border border-gray-300 rounded-r-md bg-white text-gray-700 hover:bg-gray-50">
              Suivant
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
