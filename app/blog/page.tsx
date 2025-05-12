import { Metadata } from 'next';
import Link from 'next/link';
import { getArticles, getCategories } from '@/lib/utils/blog';

export const metadata: Metadata = {
  title: 'Blog - AgentMarket',
  description: 'Découvrez nos articles, guides et actualités sur notre blog.',
  openGraph: {
    title: 'Blog - AgentMarket',
    description: 'Découvrez nos articles, guides et actualités sur notre blog.',
    url: '/blog',
    type: 'website',
  },
};

export default function BlogPage() {
  const articles = getArticles(10, 0);
  const featuredArticles = articles.slice(0, 2);
  const regularArticles = articles.slice(2, 7);
  const categories = getCategories();
  const popularArticles = [...articles].sort(() => 0.5 - Math.random()).slice(0, 3);
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
          {/* Category items */}
          {categories.slice(0, 5).map((category, i) => (
            <Link
              key={i}
              href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-gray-50 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 transition"
            >
              <h3 className="font-medium">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Articles à la Une</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Featured post items */}
          {featuredArticles.map((article, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">[Image de l'article]</span>
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">{article.date} • {article.category.toUpperCase()}</div>
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">
                  {article.excerpt}
                </p>
                <Link href={`/blog/${article.slug}`} className="text-blue-600 font-medium hover:underline">
                  Lire la suite →
                </Link>
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
            {/* Blog post items */}
            {regularArticles.map((article, i) => (
              <article key={i} className="flex flex-col md:flex-row gap-6 pb-8 border-b border-gray-200">
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
            <form action="/blog/search" method="get" className="relative">
              <input
                type="text"
                name="q"
                placeholder="Mot-clé..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </button>
            </form>
          </div>

          {/* Popular Posts */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Articles Populaires</h3>
            <div className="space-y-4">
              {popularArticles.map((article, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">[Image]</span>
                  </div>
                  <div>
                    <Link href={`/blog/${article.slug}`} className="font-medium hover:text-blue-600">
                      {article.title}
                    </Link>
                    <p className="text-sm text-gray-500">{article.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Catégories</h3>
            <ul className="space-y-2">
              {categories.map((category, i) => (
                <li key={i}>
                  <Link
                    href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex justify-between items-center text-gray-700 hover:text-blue-600"
                  >
                    <span>{category.name}</span>
                    <span className="text-gray-500 text-sm">({category.count})</span>
                  </Link>
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
                <Link
                  key={i}
                  href={`/blog/tag/tag-${i + 1}`}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm hover:bg-gray-100"
                >
                  Tag {i + 1}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
