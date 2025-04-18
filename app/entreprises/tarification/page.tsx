export default function TarificationEntreprisePage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Tarification pour entreprises</h1>
        
        <p className="text-lg text-center mb-12 max-w-3xl mx-auto">
          Des formules adaptées à tous les besoins et toutes les tailles d&apos;entreprise pour accéder aux meilleurs agents IA du marché.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Forfait Découverte */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col">
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-center">Découverte</h2>
              <div className="flex justify-center items-baseline my-4">
                <span className="text-5xl font-extrabold">49€</span>
                <span className="text-xl text-gray-500 ml-1">/mois</span>
              </div>
              <p className="text-gray-600 text-center">Idéal pour les petites entreprises</p>
            </div>
            
            <div className="p-6 flex-grow">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Accès à 5 agents maximum</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>5 000 interactions/mois</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Support par email</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Intégration API basique</span>
                </li>
              </ul>
            </div>
            
            <div className="p-6">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300">
                Choisir ce forfait
              </button>
            </div>
          </div>
          
          {/* Forfait Business */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden border-2 border-blue-500 flex flex-col relative">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-semibold">
              Populaire
            </div>
            
            <div className="p-6 bg-blue-50 border-b border-blue-100">
              <h2 className="text-2xl font-bold text-center">Business</h2>
              <div className="flex justify-center items-baseline my-4">
                <span className="text-5xl font-extrabold">199€</span>
                <span className="text-xl text-gray-500 ml-1">/mois</span>
              </div>
              <p className="text-gray-600 text-center">Pour les entreprises en croissance</p>
            </div>
            
            <div className="p-6 flex-grow">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Accès à 20 agents maximum</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>50 000 interactions/mois</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Support prioritaire</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Intégration API complète</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Rapports d&apos;analyse mensuels</span>
                </li>
              </ul>
            </div>
            
            <div className="p-6">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300">
                Choisir ce forfait
              </button>
            </div>
          </div>
          
          {/* Forfait Enterprise */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col">
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-center">Enterprise</h2>
              <div className="flex justify-center items-baseline my-4">
                <span className="text-5xl font-extrabold">Sur mesure</span>
              </div>
              <p className="text-gray-600 text-center">Pour les grandes organisations</p>
            </div>
            
            <div className="p-6 flex-grow">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Accès illimité aux agents</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Volume d&apos;interactions personnalisé</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Support dédié 24/7</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Intégration sur mesure</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Contrats adaptés à vos besoins</span>
                </li>
              </ul>
            </div>
            
            <div className="p-6">
              <button className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300">
                Contacter notre équipe
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Besoin d&apos;une solution personnalisée ?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Nos experts sont à votre disposition pour concevoir une offre adaptée aux besoins spécifiques de votre entreprise.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300">
            Demander un devis personnalisé
          </button>
        </div>
      </div>
    </main>
  );
}
