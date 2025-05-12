import { Metadata } from 'next';
import Link from 'next/link';
import { getArticleBySlug, getArticles } from '@/lib/utils/blog';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Article non trouvé - Blog - AgentMarket',
      description: 'Cet article n\'existe pas ou a été déplacé.',
    };
  }
  
  return {
    title: `${article.title} - Blog - AgentMarket`,
    description: article.excerpt,
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticleBySlug(params.slug);
  
  if (!article) {
    notFound();
  }
  
  const allArticles = getArticles(100);
  const similarArticles = allArticles
    .filter(a => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);
  
  return (
    <div className="container mx-auto py-10 px-4">
      <article className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/blog" className="text-blue-600 hover:underline">
            &larr; Retour au blog
          </Link>
        </div>
        
        <div className="mb-10">
          <span className="text-gray-500 text-sm uppercase">{article.date} • {article.category.toUpperCase()}</span>
          <h1 className="text-4xl font-bold mt-2 mb-4">{article.title}</h1>
          <div className="relative w-full h-96 bg-gray-100 mb-6 flex items-center justify-center">
            [Image principale de l'article]
          </div>
        </div>
        
        <div className="prose lg:prose-xl mx-auto">
          <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold mb-6">Articles similaires</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarArticles.length > 0 ? (
              similarArticles.map((similarArticle, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">{similarArticle.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{similarArticle.excerpt.substring(0, 80)}...</p>
                  <Link href={`/blog/${similarArticle.slug}`} className="text-blue-600 text-sm hover:underline">
                    Lire la suite &rarr;
                  </Link>
                </div>
              ))
            ) : (
              <div className="lg:col-span-3 text-center py-4">
                <p className="text-gray-600">Aucun article similaire trouvé</p>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
