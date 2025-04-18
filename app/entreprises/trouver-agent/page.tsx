export default function TrouverAgentPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Trouver un agent IA</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="text-lg mb-4">
            Découvrez notre catalogue complet d&apos;agents IA spécialisés pour répondre aux besoins spécifiques de votre entreprise.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Comment trouver l&apos;agent parfait ?</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-xl">Parcourez par catégorie</h3>
              <p className="text-gray-600">Filtrez les agents par secteur d&apos;activité, type d&apos;intégration, et cas d&apos;utilisation.</p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-xl">Comparez les fonctionnalités</h3>
              <p className="text-gray-600">Examinez en détail ce que chaque agent peut faire pour votre entreprise.</p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-xl">Contactez les créateurs</h3>
              <p className="text-gray-600">Discutez directement avec les créateurs pour des besoins spécifiques.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Besoin d&apos;assistance ?</h2>
          <p className="mb-4">Notre équipe est disponible pour vous aider à identifier l&apos;agent IA qui correspond le mieux à vos besoins.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300">
            Demander conseil
          </button>
        </div>
      </div>
    </main>
  );
}
