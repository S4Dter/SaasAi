import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Archives - Blog - AgentMarket',
  description: 'Parcourez tous nos articles par date',
};

export default function ArchivesPage() {
  // Structure d'exemple pour les archives
  const archives = [
    {
      year: 2025,
      months: [
        {
          name: 'Janvier',
          articles: [
            { id: 'article-1', title: 'Titre de l\'article 1', date: '15 janvier 2025' },
            { id: 'article-2', title: 'Titre de l\'article 2', date: '10 janvier 2025' },
            { id: 'article-3', title: 'Titre de l\'article 3', date: '5 janvier 2025' },
          ]
        },
        {
          name: 'Février',
          articles: [
            { id: 'article-4', title: 'Titre de l\'article 4', date: '20 février 2025' },
            { id: 'article-5', title: 'Titre de l\'article 5', date: '15 février 2025' },
          ]
        }
      ]
    },
    {
      year: 2024,
      months: [
        {
          name: 'Décembre',
          articles: [
            { id: 'article-6', title: 'Titre de l\'article 6', date: '25 décembre 2024' },
            { id: 'article-7', title: 'Titre de l\'article 7', date: '20 décembre 2024' },
            { id: 'article-8', title: 'Titre de l\'article 8', date: '15 décembre 2024' },
          ]
        },
        {
          name: 'Novembre',
          articles: [
            { id: 'article-9', title: 'Titre de l\'article 9', date: '30 novembre 2024' },
            { id: 'article-10', title: 'Titre de l\'article 10', date: '25 novembre 2024' },
          ]
        }
      ]
    }
  ];
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:underline">
          &larr; Retour au blog
        </Link>
      </div>
      
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Archives du blog</h1>
        <p className="text-xl text-gray-600 mb-8">
          Parcourez tous nos articles organisés par date.
        </p>
        
        <div className="space-y-12">
          {archives.map((yearData) => (
            <div key={yearData.year} className="border-b pb-8 last:border-0">
              <h2 className="text-3xl font-bold mb-6 text-blue-800">{yearData.year}</h2>
              
              <div className="space-y-8">
                {yearData.months.map((month) => (
                  <div key={month.name} className="pl-4 border-l-4 border-blue-200">
                    <h3 className="text-2xl font-bold mb-4">{month.name} {yearData.year}</h3>
                    
                    <ul className="space-y-4">
                      {month.articles.map((article) => (
                        <li key={article.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                          <div className="flex justify-between items-center">
                            <Link href={`/blog/${article.id}`} className="text-lg font-medium text-blue-600 hover:underline">
                              {article.title}
                            </Link>
                            <span className="text-sm text-gray-500">{article.date}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="mt-12 bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Rechercher dans les archives</h2>
        <p className="mb-6">
          Vous cherchez un article spécifique ? Utilisez notre fonction de recherche pour le trouver rapidement.
        </p>
        <Link 
          href="/blog/search" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Rechercher dans le blog
        </Link>
      </section>
    </div>
  );
}
