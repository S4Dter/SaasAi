export default function PublierAgentPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Publier un agent IA</h1>
        
        <p className="text-lg mb-8">
          Vous avez développé un agent IA innovant ? Partagez-le sur notre marketplace et connectez-vous avec des entreprises à la recherche de solutions comme la vôtre.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Comment publier votre agent</h2>
          
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Créez votre compte</h3>
                <p className="text-gray-600">
                  Inscrivez-vous en tant que créateur sur notre plateforme et complétez votre profil 
                  pour mettre en avant votre expertise et votre expérience.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Décrivez votre agent</h3>
                <p className="text-gray-600">
                  Fournissez une description détaillée de votre agent, ses fonctionnalités, 
                  ses cas d&apos;utilisation et les problèmes qu&apos;il résout. N&apos;oubliez pas 
                  d&apos;ajouter des captures d&apos;écran et des démos si possible.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Définissez votre modèle de tarification</h3>
                <p className="text-gray-600">
                  Choisissez entre un abonnement mensuel, un achat unique ou un paiement à l&apos;usage. 
                  Vous pouvez également proposer différentes formules selon les fonctionnalités offertes.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Spécifiez les détails techniques</h3>
                <p className="text-gray-600">
                  Précisez les méthodes d&apos;intégration disponibles (API, widget, application web, etc.), 
                  les exigences techniques et toute autre information pertinente pour les entreprises.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                5
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Soumettez pour validation</h3>
                <p className="text-gray-600">
                  Notre équipe examinera votre agent pour s&apos;assurer qu&apos;il répond à nos normes de qualité 
                  avant de le publier sur la marketplace. Ce processus prend généralement 2 à 3 jours ouvrables.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Avantages</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Accès à un marché d&apos;entreprises en recherche active de solutions IA</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Gestion simplifiée des paiements et de la facturation</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Exposition et visibilité au sein de notre communauté</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Retours clients directs pour améliorer votre produit</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Nos critères de qualité</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Performance et fiabilité démontrées</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Respect des standards de sécurité et de confidentialité</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Documentation technique complète</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Valeur ajoutée claire pour les utilisateurs finaux</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Prêt à publier votre agent ?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Rejoignez notre communauté de créateurs et commencez à monétiser votre agent IA dès aujourd&apos;hui.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300">
            Créer un compte créateur
          </button>
        </div>
      </div>
    </main>
  );
}
