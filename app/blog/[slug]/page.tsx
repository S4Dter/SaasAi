import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = await params;
  
  return {
    title: `${slug.slug} - Blog - AgentMarket`,
    description: `Article détaillé sur ${slug.slug}`,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = await params;
  
  return (
    <div className="container mx-auto py-10 px-4">
      <article className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/blog" className="text-blue-600 hover:underline">
            &larr; Retour au blog
          </Link>
        </div>
        
        <div className="mb-10">
          <span className="text-gray-500 text-sm uppercase">01 JAN 2025 • CATÉGORIE</span>
          <h1 className="text-4xl font-bold mt-2 mb-4">{slug.slug}</h1>
          <div className="relative w-full h-96 bg-gray-100 mb-6 flex items-center justify-center">
            [Image principale de l'article]
          </div>
        </div>
        
        <div className="prose lg:prose-xl mx-auto">
          <p className="lead text-xl mb-6">
            Ici se trouvera l'introduction de l'article qui présente le sujet de manière attrayante et donne envie au lecteur de continuer.
          </p>
          
          <h2>Première section</h2>
          <p>
            Contenu détaillé de la première section de l'article. Vous pourrez ajouter ici votre texte riche en mots-clés et informations pertinentes pour votre référencement.
          </p>
          
          <h2>Deuxième section</h2>
          <p>
            Contenu détaillé de la deuxième section de l'article, avec des informations spécifiques et utiles pour vos lecteurs.
          </p>
          
          <h2>Troisième section</h2>
          <p>
            Contenu détaillé de la troisième section, apportant une valeur ajoutée supplémentaire et répondant aux questions que se posent vos lecteurs.
          </p>
          
          <h2>Conclusion</h2>
          <p>
            Résumé des points clés abordés et conclusion avec éventuellement un appel à l'action.
          </p>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold mb-6">Articles similaires</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">Article similaire 1</h4>
              <p className="text-sm text-gray-600 mb-2">Brève description de l'article connexe</p>
              <Link href="/blog/article-similaire-1" className="text-blue-600 text-sm hover:underline">
                Lire la suite &rarr;
              </Link>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">Article similaire 2</h4>
              <p className="text-sm text-gray-600 mb-2">Brève description de l'article connexe</p>
              <Link href="/blog/article-similaire-2" className="text-blue-600 text-sm hover:underline">
                Lire la suite &rarr;
              </Link>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">Article similaire 3</h4>
              <p className="text-sm text-gray-600 mb-2">Brève description de l'article connexe</p>
              <Link href="/blog/article-similaire-3" className="text-blue-600 text-sm hover:underline">
                Lire la suite &rarr;
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
