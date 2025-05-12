import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

// This would be replaced with your actual data fetching logic
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // In a real implementation, you would fetch the article data based on the slug
  // and use it to generate dynamic metadata
  const slug = params.slug
  
  return {
    title: `Article Title - Blog`,
    description: 'Description de l\'article qui sera utilisée par les moteurs de recherche.',
    openGraph: {
      title: `Article Title - Blog`,
      description: 'Description de l\'article qui sera utilisée par les moteurs de recherche.',
      url: `/blog/${slug}`,
      type: 'article',
      // You can add more OpenGraph tags like published_time, author, etc.
    },
    // Add structured data for better SEO
    other: {
      'application-name': 'Your Site Name',
    }
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const { slug } = params
  
  // In a real implementation, you would fetch the article data based on the slug
  // For now, we'll create a placeholder article structure
  
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
              <span>Titre de l'article</span>
            </li>
          </ol>
        </nav>
        
        {/* Article Header */}
        <header className="mb-8">
          <div className="text-sm text-gray-500 mb-2">Publié le JAN 01, 2025 • CATÉGORIE</div>
          <h1 className="text-4xl font-bold mb-4">Titre de l'article</h1>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <div className="font-medium">Nom de l'auteur</div>
              <div className="text-sm text-gray-500">Titre de l'auteur</div>
            </div>
          </div>
        </header>
        
        {/* Featured Image */}
        <div className="h-[400px] w-full bg-gray-100 rounded-xl mb-8 flex items-center justify-center">
          <span className="text-gray-400">[Image principale de l'article]</span>
        </div>
        
        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {/* Introduction */}
          <p>
            Ceci est l'introduction de l'article. Il s'agit d'un paragraphe qui présente le sujet 
            et donne envie au lecteur de poursuivre sa lecture. Cette introduction est également 
            importante pour le référencement SEO.
          </p>
          
          <h2>Premier sous-titre de l'article</h2>
          <p>
            Contenu de la première section de l'article. Ce paragraphe développe un premier point 
            important du sujet traité. Il peut inclure des exemples, des analyses ou des explications 
            détaillées.
          </p>
          <p>
            Suite du contenu de la première section avec plus de détails et d'informations 
            pertinentes pour le lecteur.
          </p>
          
          <h2>Deuxième sous-titre de l'article</h2>
          <p>
            Contenu de la deuxième section de l'article. Cette partie aborde un autre aspect 
            important du sujet principal.
          </p>
          
          <ul>
            <li>Premier élément d'une liste à puces</li>
            <li>Deuxième élément avec des informations importantes</li>
            <li>Troisième élément pour compléter l'explication</li>
          </ul>
          
          <h2>Troisième sous-titre de l'article</h2>
          <p>
            Contenu de la troisième section qui peut présenter des cas pratiques, des exemples 
            concrets ou des études de cas pertinentes pour le sujet.
          </p>
          
          <blockquote>
            Ceci est une citation importante ou un extrait mis en évidence pour attirer 
            l'attention du lecteur sur un point clé de l'article.
          </blockquote>
          
          <h2>Conclusion</h2>
          <p>
            La conclusion résume les points principaux abordés dans l'article et peut proposer 
            une ouverture ou des perspectives futures sur le sujet. Elle est également importante 
            pour le référencement SEO car elle récapitule les idées clés.
          </p>
        </div>
        
        {/* Tags */}
        <div className="mb-12">
          <div className="text-lg font-bold mb-4">Tags</div>
          <div className="flex flex-wrap gap-2">
            {['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4'].map((tag, i) => (
              <a 
                key={i} 
                href="#" 
                className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm hover:bg-gray-100"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
        
        {/* Author Box */}
        <div className="bg-gray-50 rounded-xl p-6 mb-12">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div>
              <div className="font-bold text-lg mb-1">Nom de l'auteur</div>
              <div className="text-gray-600 mb-4">
                Brève biographie de l'auteur. Description de son expertise, son expérience et 
                éventuellement son rôle dans l'entreprise ou l'organisation.
              </div>
              <div className="flex space-x-3">
                <a href="#" className="text-blue-600 hover:underline">Twitter</a>
                <a href="#" className="text-blue-600 hover:underline">LinkedIn</a>
                <a href="#" className="text-blue-600 hover:underline">Site Web</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Posts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Articles similaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">[Image]</span>
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-1">JAN 01, 2025</div>
                  <h3 className="font-bold mb-2">Titre de l'article similaire {i + 1}</h3>
                  <a href="#" className="text-blue-600 text-sm font-medium hover:underline">
                    Lire la suite →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Comments Section - Placeholder */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Commentaires</h2>
          <div className="bg-gray-50 p-8 rounded-xl text-center">
            <p className="text-gray-500">
              Section de commentaires - À remplacer par votre système de commentaires
            </p>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="bg-blue-50 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Abonnez-vous à notre newsletter</h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Recevez les derniers articles et actualités directement dans votre boîte mail.
            Pas de spam, promis !
          </p>
          <form className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Votre email" 
              className="flex-grow px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-3 rounded-r-md hover:bg-blue-700 transition font-medium"
            >
              S'abonner
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
