import { ReactNode } from 'react'

interface BlogLayoutProps {
  children: ReactNode
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <main className="min-h-screen bg-white">
      {/* Blog Header - Optional custom header for the blog section */}
      <header className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <a href="/" className="text-gray-900 font-medium">Accueil</a>
              <a href="/blog" className="text-blue-600 font-medium">Blog</a>
              {/* Add more navigation items as needed */}
              <a href="#" className="text-gray-600 hover:text-gray-900">Catégories</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Archives</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">À propos</a>
            </div>
            <div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                S'abonner
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      {children}

      {/* Blog Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">À propos du blog</h3>
              <p className="text-gray-600">
                Notre blog partage des informations pertinentes, des analyses approfondies et des conseils pratiques 
                dans notre domaine d'expertise.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Catégories</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Articles populaires</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Archives</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">À propos</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Restez connecté</h3>
              <p className="text-gray-600 mb-4">
                Abonnez-vous à notre newsletter pour recevoir les derniers articles et mises à jour.
              </p>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Votre email" 
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
                >
                  →
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Your Company. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
