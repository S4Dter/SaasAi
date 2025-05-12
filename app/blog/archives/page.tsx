import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Archives - Blog',
  description: 'Parcourez nos articles de blog par date de publication.',
  openGraph: {
    title: 'Archives - Blog',
    description: 'Parcourez nos articles de blog par date de publication.',
    url: '/blog/archives',
    type: 'website',
  },
}

export default function ArchivesPage() {
  // This would be fetched from a database in a real implementation
  const years = [2025, 2024, 2023];
  
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
              <span>Archives</span>
            </li>
          </ol>
        </nav>
        
        {/* Page Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Archives du Blog</h1>
          <p className="text-gray-600 text-lg">
            Parcourez tous nos articles par date de publication
          </p>
        </header>
        
        {/* Archives by Year */}
        <div className="space-y-12 mb-16">
          {years.map(year => (
            <section key={year}>
              <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">{year}</h2>
              
              <div className="space-y-8">
                {/* Months - in a real app these would be dynamic based on content */}
                {['Décembre', 'Novembre', 'Octobre', 'Septembre', 'Août', 'Juillet', 
                  'Juin', 'Mai', 'Avril', 'Mars', 'Février', 'Janvier']
                  .map((month, monthIndex) => (
                    <div key={monthIndex}>
                      <h3 className="text-xl font-bold mb-4">{month}</h3>
                      
                      {/* Articles for this month - would be dynamically generated */}
                      <ul className="space-y-3">
                        {/* Only show articles for some months to make it look realistic */}
                        {monthIndex < 6 && Array.from({ length: monthIndex % 3 + 1 }).map((_, i) => (
                          <li key={i} className="border-b border-gray-100 pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <Link 
                                  href={`/blog/article-${i + 1}`} 
                                  className="font-medium hover:text-blue-600"
                                >
                                  Titre de l'article {i + 1} de {month} {year}
                                </Link>
                                <div className="text-sm text-gray-500 mt-1">
                                  <span className="text-blue-600">CATÉGORIE</span> • {month.substring(0, 3).toUpperCase()} {(30 - i).toString().padStart(2, '0')}, {year}
                                </div>
                              </div>
                              <Link 
                                href={`/blog/article-${i + 1}`}
                                className="text-blue-600 text-sm font-medium hover:underline ml-4"
                              >
                                Lire →
                              </Link>
                            </div>
                          </li>
                        ))}
                        
                        {/* Show "No articles" for some months to make it look realistic */}
                        {monthIndex >= 6 && (
                          <li className="text-gray-500 italic">
                            Aucun article publié ce mois-ci
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
              </div>
            </section>
          ))}
        </div>
        
        {/* Browse by Category */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Parcourir par catégorie</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <Link 
                key={i} 
                href={`/blog/category/catégorie-${i + 1}`}
                className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition flex items-center justify-between"
              >
                <span className="font-medium">Catégorie {i + 1}</span>
                <span className="text-gray-500 text-sm">(12)</span>
              </Link>
            ))}
          </div>
        </section>
        
        {/* Tags Cloud */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Tags populaires</h2>
          
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <a 
                key={i} 
                href="#" 
                className={`px-3 py-1 rounded-full text-sm 
                  ${i % 5 === 0 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : 'bg-gray-50 text-gray-700 border border-gray-200'} 
                  hover:bg-gray-100`}
                style={{ fontSize: `${Math.min(1.1 + (i % 3) * 0.1, 1.3)}rem` }}
              >
                Tag {i + 1}
              </a>
            ))}
          </div>
        </section>
        
        {/* Search Box */}
        <div className="bg-gray-50 p-8 rounded-xl text-center mb-16">
          <h3 className="text-xl font-bold mb-4">Rechercher dans les archives</h3>
          <p className="text-gray-600 mb-6">
            Vous ne trouvez pas ce que vous cherchez ? Utilisez notre moteur de recherche.
          </p>
          <form className="max-w-md mx-auto flex">
            <input 
              type="text" 
              placeholder="Mot-clé..." 
              className="flex-grow px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-3 rounded-r-md hover:bg-blue-700 transition font-medium"
            >
              Rechercher
            </button>
          </form>
        </div>
        
        {/* Back to Blog Link */}
        <div className="text-center">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-blue-600 font-medium hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à la page principale du blog
          </Link>
        </div>
      </div>
    </div>
  )
}
