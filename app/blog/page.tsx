import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Your Site Name',
  description: 'Découvrez nos articles, guides et actualités sur notre blog.',
  openGraph: {
    title: 'Blog | Your Site Name',
    description: 'Découvrez nos articles, guides et actualités sur notre blog.',
    url: '/blog',
    type: 'website',
  },
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="relative h-[400px] w-full rounded-xl overflow-hidden bg-gray-100">
          {/* Hero image placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400">[Image principale du blog]</span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
            <h1 className="text-4xl font-bold text-white mb-2">Notre Blog</h1>
            <p className="text-lg text-white/90 max-w-2xl">
              Découvrez les dernières tendances, astuces et actualités
            </p>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Catégories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Category items - will be replaced with actual data */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i} 
              className="bg-gray-50 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 transition"
            >
              <h3 className="font-medium">Catégorie {i + 1}</h3>
            </div>
          ))}
        </div>
      </section>
      
      {/* Featured Posts Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Articles à la Une</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Featured post items - will be replaced with actual data */}
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">[Image de l'article]</span>
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">JAN 01, 2025 • CATÉGORIE</div>
                <h3 className="text-xl font-bold mb-2">Titre de l'article à la une {i + 1}</h3>
                <p className="text-gray-600 mb-4">
                  Description courte de l'article qui présente son contenu de manière attrayante.
                </p>
                <a href="#" className="text-blue-600 font-medium hover:underline">
                  Lire la suite →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Main Blog Content - Two Columns */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Blog Posts Column */}
        <section className="flex-grow">
          <h2 className="text-2xl font-bold mb-6">Tous les Articles</h2>
          
          <div className="space-y-8">
            {/* Blog post items - will be replaced with actual data */}
            {Array.from({ length: 5 }).map((_, i) => (
              <article key={i} className="flex flex-col md:flex-row gap-6 pb-8 border-b border-gray-200">
                <div className="md:w-1/3 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">[Image de l'article]</span>
                </div>
                <div className="md:w-2/3">
                  <div className="text-sm text-gray-500 mb-2">JAN 0{i + 1}, 2025 • CATÉGORIE</div>
                  <h3 className="text-xl font-bold mb-2">Titre de l'article de blog {i + 1}</h3>
                  <p className="text-gray-600 mb-4">
                    Description de l'article qui donne envie au lecteur de cliquer pour en savoir plus.
                    Ce résumé doit être optimisé pour le SEO tout en restant attractif.
                  </p>
                  <a href="#" className="text-blue-600 font-medium hover:underline">
                    Lire la suite →
                  </a>
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
          
          {/* Categories */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Catégories</h3>
            <ul className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i}>
                  <a href="#" className="flex justify-between items-center text-gray-700 hover:text-blue-600">
                    <span>Catégorie {i + 1}</span>
                    <span className="text-gray-500 text-sm">(12)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter Signup */}
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-2">Abonnez-vous à notre newsletter</h3>
            <p className="text-gray-600 mb-4">Recevez nos derniers articles et actualités directement dans votre boîte mail.</p>
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
          
          {/* Tags */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
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
        </aside>
      </div>
    </div>
  )
}
