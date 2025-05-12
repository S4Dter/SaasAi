import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - AgentMarket',
  description: 'Découvrez les dernières tendances, astuces et actualités sur AgentMarket',
  keywords: 'blog, agents, intelligence artificielle, marché, tendances, astuces, actualités',
  openGraph: {
    title: 'Blog - AgentMarket',
    description: 'Découvrez les dernières tendances, astuces et actualités sur AgentMarket',
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-bold text-xl">
                AgentMarket
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/blog" className="text-gray-800 hover:text-blue-600 font-medium">
                Blog
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/blog/search" 
                className="text-gray-600 hover:text-blue-600 text-sm font-medium"
              >
                Rechercher
              </Link>
              <Link 
                href="/blog/categories" 
                className="text-gray-600 hover:text-blue-600 text-sm font-medium"
              >
                Catégories
              </Link>
              <Link 
                href="/blog/archives" 
                className="text-gray-600 hover:text-blue-600 text-sm font-medium"
              >
                Archives
              </Link>
              <Link 
                href="/blog/rss" 
                className="text-gray-600 hover:text-blue-600 text-sm font-medium"
                title="Flux RSS"
              >
                RSS
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <main>
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">À propos du blog</h3>
              <p className="text-gray-300 mb-4">
                Notre blog couvre les dernières tendances, astuces et actualités dans le domaine des agents intelligents et de l'IA.
              </p>
              <Link 
                href="/blog/about" 
                className="text-blue-400 hover:text-blue-300"
              >
                En savoir plus
              </Link>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Catégories populaires</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/blog/category/intelligence-artificielle" 
                    className="text-gray-300 hover:text-blue-300"
                  >
                    Intelligence Artificielle
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/blog/category/tutoriels" 
                    className="text-gray-300 hover:text-blue-300"
                  >
                    Tutoriels
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/blog/category/etudes-de-cas" 
                    className="text-gray-300 hover:text-blue-300"
                  >
                    Études de cas
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/blog/category/tendances" 
                    className="text-gray-300 hover:text-blue-300"
                  >
                    Tendances du marché
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">S'abonner</h3>
              <p className="text-gray-300 mb-4">
                Recevez nos derniers articles directement dans votre boîte mail.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="px-4 py-2 w-full rounded-l focus:outline-none text-gray-800"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r"
                >
                  S'abonner
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} AgentMarket. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
