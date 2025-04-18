export default function CommentCaMarchePage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Comment ça marche</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="text-lg mb-8">
            Découvrez le processus simple et efficace pour intégrer des agents IA à votre entreprise grâce à notre plateforme.
          </p>
          
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Parcourez notre catalogue</h3>
                <p className="text-gray-600">
                  Explorez notre sélection d&apos;agents IA spécialisés, filtrez par secteur d&apos;activité, 
                  fonctionnalités ou prix pour trouver ceux qui correspondent à vos besoins spécifiques.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Contactez le créateur</h3>
                <p className="text-gray-600">
                  Une fois que vous avez identifié un agent intéressant, entrez en contact avec son 
                  créateur pour discuter de vos besoins spécifiques et poser toutes vos questions.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Souscrivez à l&apos;offre adaptée</h3>
                <p className="text-gray-600">
                  Choisissez le modèle de tarification qui vous convient : abonnement mensuel, 
                  achat unique ou paiement à l&apos;usage, selon vos besoins et votre budget.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Intégrez et déployez</h3>
                <p className="text-gray-600">
                  Bénéficiez d&apos;un accompagnement pour l&apos;intégration de l&apos;agent dans vos 
                  systèmes existants et formez vos équipes à son utilisation optimale.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Prêt à commencer ?</h2>
          <p className="mb-6">Explorez notre catalogue d&apos;agents IA et trouvez celui qui transformera votre entreprise.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300">
            Explorer le catalogue
          </button>
        </div>
      </div>
    </main>
  );
}
