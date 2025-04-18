export default function OutilsProspectionPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Outils de prospection</h1>
        
        <p className="text-lg mb-8">
          Développez votre activité grâce à nos outils de prospection conçus pour aider les créateurs d&apos;agents IA 
          à trouver des clients et à maximiser leurs ventes.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Nos outils pour trouver des clients</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-300">
              <div className="text-blue-600 mb-3">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Analyses de marché</h3>
              <p className="text-gray-600">
                Accédez à des rapports détaillés sur les tendances du marché, les besoins des entreprises 
                et les opportunités émergentes dans le domaine de l&apos;IA.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-300">
              <div className="text-blue-600 mb-3">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Matchmaking intelligent</h3>
              <p className="text-gray-600">
                Notre algorithme identifie les entreprises les plus susceptibles d&apos;être intéressées 
                par votre agent IA et vous met en relation avec elles.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-300">
              <div className="text-blue-600 mb-3">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Événements de networking</h3>
              <p className="text-gray-600">
                Participez à des webinaires, ateliers et conférences virtuelles pour présenter 
                votre agent IA à des clients potentiels et échanger avec d&apos;autres créateurs.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-300">
              <div className="text-blue-600 mb-3">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Retours clients</h3>
              <p className="text-gray-600">
                Collectez et analysez les retours des utilisateurs pour améliorer votre agent 
                et mieux répondre aux besoins du marché.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tableaux de bord analytiques</h2>
          <p className="mb-4">
            Suivez les performances de votre agent et adaptez votre stratégie grâce à nos tableaux de bord détaillés.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">Vues</div>
              <p className="text-sm text-gray-600">Nombre de fois que votre agent a été vu par des entreprises</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">Clics</div>
              <p className="text-sm text-gray-600">Nombre de visiteurs ayant cliqué sur votre fiche détaillée</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-1">Contacts</div>
              <p className="text-sm text-gray-600">Nombre d&apos;entreprises vous ayant contacté</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">Conversions</div>
              <p className="text-sm text-gray-600">Nombre de ventes ou d&apos;abonnements souscrits</p>
            </div>
          </div>
          
          <p className="text-gray-700">
            Tous les tableaux de bord sont disponibles dans votre espace créateur après connexion. 
            Des rapports hebdomadaires et mensuels sont également envoyés par email pour vous tenir informé.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Outils de communication</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Messagerie intégrée</h3>
                <p className="text-gray-600">
                  Échangez directement avec les entreprises intéressées par votre agent via notre 
                  plateforme sécurisée, sans avoir à partager vos coordonnées personnelles.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Notifications en temps réel</h3>
                <p className="text-gray-600">
                  Recevez des alertes instantanées lorsqu&apos;une entreprise consulte votre fiche, 
                  vous contacte ou interagit avec votre agent de quelque manière que ce soit.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Modèles de proposition</h3>
                <p className="text-gray-600">
                  Utilisez nos modèles professionnels pour créer rapidement des propositions 
                  commerciales personnalisées et convaincantes pour vos prospects.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Suivi des leads</h3>
                <p className="text-gray-600">
                  Gérez efficacement votre pipeline commercial avec notre outil de suivi des leads, 
                  des premiers contacts jusqu&apos;à la signature du contrat.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Prêt à développer votre activité ?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Accédez à tous nos outils de prospection et commencez à générer de nouvelles opportunités commerciales dès aujourd&apos;hui.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300">
            Accéder à l&apos;espace créateur
          </button>
        </div>
      </div>
    </main>
  );
}
