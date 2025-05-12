import { Metadata } from 'next'
import Link from 'next/link'

export async function generateMetadata({ 
  params 
}: { 
  params: { category: string } 
}): Promise<Metadata> {
  // In a real implementation, you would fetch the category data based on the slug
  // and use it to generate dynamic metadata
  const category = decodeURIComponent(params.category)
  
  return {
    title: `${category} - Catégorie Blog`,
    description: `Tous nos articles dans la catégorie ${category}. Découvrez nos analyses, guides et conseils sur ce sujet.`,
    openGraph: {
      title: `${category} - Catégorie Blog`,
      description: `Tous nos articles dans la catégorie ${category}. Découvrez nos analyses, guides et conseils sur ce sujet.`,
      url: `/blog/category/${params.category}`,
      type: 'website',
    },
  }
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = decodeURIComponent(params.category)
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <section className="mb-16">
        <div className="relative h-[250px] w-full rounded-xl overflow-hidden bg-gray-100">
          {/* Category image placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400">[Image de la catégorie]</span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
            <h1 className="text-4xl font-bold text-white mb-2">Catégorie: {category}</h1>
            <p className="text-lg text-white/90 max-w-2xl">
              Découvrez tous nos articles sur ce sujet
            </p>
          </div>
        </div>
      </section>
      
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
            <span>Catégorie: {category}</span>
          </li>
        </ol>
      </nav>
      
      {/* Category Description */}
      <div className="bg-gray-50 p-6 rounded-xl mb-12">
        <h2 className="text-xl font-bold mb-3">À propos de cette catégorie</h2>
        <p className="text-gray-600">
          Description détaillée de la catégorie {category}. Cette section permet d'expliquer 
          les sujets traités dans cette catégorie et peut inclure des mots-clés importants 
          pour le référencement SEO.
        </p>
      </div>
      
      {/* Main Content - Two Columns */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Blog Posts Column */}
        <section className="flex-grow">
          <h2 className="text-2xl font-bold mb-6">Articles dans cette catégorie</h2>
          
          <div className="space-y-8">
            {/* Blog post items - will be replaced with actual data */}
            {Array.from({ length: 6 }).map((_, i) => (
              <article key={i} className="flex flex-col md:flex-row gap-6 pb-8 border-b border-gray-200">
                <div className="md:w-1/3 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">[Image de l'article]</span>
                </div>
                <div className="md:w-2/3">
                  <div className="text-sm text-gray-500 mb-2">JAN 0{i + 1}, 2025 • {category.toUpperCase()}</div>
                  <h3 className="text-xl font-bold mb-2">Titre de l'article {i + 1} dans la catégorie {category}</h3>
                  <p className="text-gray-600 mb-4">
                    Description de l'article qui donne envie au lecteur de cliquer pour en savoir plus.
                    Ce résumé est optimisé pour le SEO et met en avant les points principaux de l'article.
                  </p>
                  <Link href={`/blog/article-${i + 1}`} className="text-blue-600 font-medium hover:underline">
                    Lire la suite →
                  </Link>
                </div>
              </article>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-12 flex justify-center">
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
              <span className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700">
                ...
              </span>
              <a href="#" className="px-4 py-2 border border-gray-300 rounded-r-md bg-white text-gray-700 hover:bg-gray-50">
                Suivant
              </a>
            </nav>
          </div>
        </section>
        
        {/* Sidebar */}
        <aside className="lg:w-1/3 space-y-8">
          {/* Search */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Rechercher</h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Mot-clé..." 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </button>
            </div>
          </div>
          
          {/* Other Categories */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Autres Catégories</h3>
            <ul className="space-y-2">
              {['Catégorie 1', 'Catégorie 2', 'Catégorie 3', 'Catégorie 4', 'Catégorie 5'].map((cat, i) => (
                <li key={i}>
                  <Link 
                    href={`/blog/category/${encodeURIComponent(cat.toLowerCase())}`}
                    className={`flex justify-between items-center ${cat.toLowerCase() === category.toLowerCase() ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`}
                  >
                    <span>{cat}</span>
                    <span className="text-gray-500 text-sm">(12)</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Popular Posts */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Articles Populaires</h3>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">[Image]</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Article populaire {i + 1}</h4>
                    <p className="text-sm text-gray-500">JAN 0{i + 1}, 2025</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tags */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm hover:bg-gray-100"
                >
                  Tag {i + 1}
                </a>
              ))}
            </div>
          </div>
          
          {/* Newsletter Signup */}
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-2">Abonnez-vous à notre newsletter</h3>
            <p className="text-gray-600 mb-4">Recevez nos derniers articles directement dans votre boîte mail.</p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                S'abonner
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  )
}
