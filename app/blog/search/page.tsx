import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Résultats de recherche - Blog',
  description: 'Résultats de votre recherche sur notre blog.',
  robots: {
    index: false, // Search results pages shouldn't be indexed
    follow: true,
  }
}

// In a real app, you would use searchParams from Next.js for server components
// For example: export default function SearchPage({ searchParams }: { searchParams: { q: string } })
export default function SearchPage() {
  // Placeholder for demo - in a real app, you'd get this from searchParams.q and fetch results
  const query = "exemple de recherche";
  const results = Array.from({ length: 8 });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-blue-600">Accueil</Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <span>Recherche</span>
            </li>
          </ol>
        </nav>
        
        {/* Search Header */}
        <section className="mb-10">
          <h1 className="text-3xl font-bold mb-6">Résultats de recherche</h1>
          
          {/* Search Form */}
          <form className="flex mb-8">
            <input 
              type="text" 
              defaultValue={query}
              placeholder="Rechercher dans le blog..." 
              className="flex-grow px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-3 rounded-r-md hover:bg-blue-700 transition font-medium"
            >
              Rechercher
            </button>
          </form>
          
          {/* Search Stats */}
          <p className="text-gray-600">
            {results.length} résultats trouvés pour &quot;<span className="font-medium">{query}</span>&quot;
          </p>
        </section>
        
        {/* Search Results */}
        <section className="mb-12">
          <div className="space-y-8">
            {results.map((_, i) => (
              <article key={i} className="pb-8 border-b border-gray-200">
                {/* Category + Date */}
                <div className="text-sm text-gray-500 mb-2">
                  <span className="text-blue-600">CATÉGORIE</span> • JAN 0{i + 1}, 2025
                </div>
                
                {/* Title */}
                <h2 className="text-xl font-bold mb-2 hover:text-blue-600">
                  <Link href={`/blog/article-${i + 1}`}>
                    Titre de l&apos;article {i + 1} avec le terme &quot;<span className="bg-yellow-100">{query}</span>&quot;
                  </Link>
                </h2>
                
                {/* Excerpt */}
                <p className="text-gray-600 mb-4">
                  Extrait de l&apos;article qui contient le terme recherché... 
                  <span className="bg-yellow-100">{query}</span> ... avec un peu de contexte
                  avant et après pour donner une idée du contenu de l&apos;article. Cette
                  description aide l&apos;utilisateur à déterminer si ce résultat correspond à sa recherche.
                </p>
                
                {/* Read more link */}
                <Link href={`/blog/article-${i + 1}`} className="text-blue-600 font-medium hover:underline">
                  Lire la suite →
                </Link>
              </article>
            ))}
          </div>
        </section>
        
        {/* Pagination */}
        <div className="mb-12 flex justify-center">
          <nav className="inline-flex" aria-label="Pagination">
            <a href="#" className="px-4 py-2 border border-gray-300 rounded-l-md bg-white text-gray-700 hover:bg-gray-50">
              Précédent
            </a>
            <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-white text-blue-600 font-medium">
              1
            </a>
            <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              2
            </a>
            <a href="#" className="px-4 py-2 border border-gray-300 rounded-r-md bg-white text-gray-700 hover:bg-gray-50">
              Suivant
            </a>
          </nav>
        </div>
        
        {/* Search Tips */}
        <div className="bg-gray-50 p-6 rounded-xl mb-12">
          <h2 className="text-xl font-bold mb-3">Conseils de recherche</h2>
          <ul className="space-y-2 text-gray-600 list-disc list-inside">
            <li>Utilisez des mots-clés spécifiques pour affiner vos résultats</li>
            <li>Essayez des synonymes si vous ne trouvez pas ce que vous cherchez</li>
            <li>Les recherches avec plusieurs mots trouvent des articles contenant tous ces mots</li>
            <li>Vous pouvez également parcourir nos <Link href="/blog" className="text-blue-600 hover:underline">catégories</Link> pour trouver du contenu</li>
          </ul>
        </div>
        
        {/* Popular Searches */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4">Recherches populaires</h2>
          <div className="flex flex-wrap gap-2">
            {['marketing digital', 'réseaux sociaux', 'SEO', 'contenu', 'stratégie', 'analytics'].map((term, i) => (
              <Link 
                key={i} 
                href={`/blog/search?q=${encodeURIComponent(term)}`}
                className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm hover:bg-gray-100"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Not Finding What You're Looking For */}
        <div className="bg-blue-50 p-6 rounded-xl text-center">
          <h3 className="text-lg font-bold mb-2">Vous ne trouvez pas ce que vous cherchez ?</h3>
          <p className="text-gray-600 mb-4">
            Parcourez toutes nos catégories ou contactez-nous pour obtenir de l'aide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/blog" 
              className="px-6 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Parcourir le blog
            </Link>
            <Link 
              href="/contact" 
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
