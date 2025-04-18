export default function CommunautePage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Communauté des créateurs</h1>
        
        <p className="text-lg mb-8">
          Rejoignez notre communauté dynamique de créateurs d&apos;agents IA, partagez vos connaissances, 
          développez votre réseau et accédez à des ressources exclusives pour faire évoluer votre activité.
        </p>
        
        {/* Avantages de la communauté */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Les avantages de notre communauté</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-start">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Networking stratégique</h3>
              <p className="text-gray-600">
                Connectez-vous avec d&apos;autres créateurs, experts en IA et clients potentiels 
                pour développer votre réseau professionnel et explorer de nouvelles opportunités.
              </p>
            </div>
            
            <div className="flex flex-col items-start">
              <div className="bg-purple-100 p-3 rounded-full mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Partage de connaissances</h3>
              <p className="text-gray-600">
                Échangez des conseils, des meilleures pratiques et des solutions avec 
                d&apos;autres créateurs qui partagent les mêmes défis que vous.
              </p>
            </div>
            
            <div className="flex flex-col items-start">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Formations exclusives</h3>
              <p className="text-gray-600">
                Accédez à des webinaires, ateliers et formations spécialisés pour 
                perfectionner vos compétences techniques et commerciales.
              </p>
            </div>
            
            <div className="flex flex-col items-start">
              <div className="bg-red-100 p-3 rounded-full mb-3">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Opportunités de croissance</h3>
              <p className="text-gray-600">
                Bénéficiez d&apos;une visibilité accrue, de collaborations potentielles et 
                d&apos;accès prioritaire aux nouvelles fonctionnalités de la plateforme.
              </p>
            </div>
          </div>
        </div>
        
        {/* Comment participer */}
        <div className="bg-blue-50 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Comment participer</h2>
          
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Forum de discussion</h3>
                <p className="text-gray-700 mb-2">
                  Participez à notre forum en ligne où vous pouvez poser des questions, partager vos 
                  expériences et discuter des dernières tendances en matière d&apos;IA.
                </p>
                <a href="#" className="text-blue-600 hover:underline font-medium">Accéder au forum →</a>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Événements virtuels et physiques</h3>
                <p className="text-gray-700 mb-2">
                  Assistez à nos webinaires hebdomadaires, ateliers mensuels et conférences annuelles 
                  pour approfondir vos connaissances et rencontrer d&apos;autres créateurs.
                </p>
                <a href="#" className="text-blue-600 hover:underline font-medium">Voir le calendrier des événements →</a>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Groupes thématiques</h3>
                <p className="text-gray-700 mb-2">
                  Rejoignez des groupes spécialisés selon votre domaine d&apos;expertise ou vos intérêts 
                  pour des échanges plus ciblés et des collaborations potentielles.
                </p>
                <a href="#" className="text-blue-600 hover:underline font-medium">Explorer les groupes →</a>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Programme de mentorat</h3>
                <p className="text-gray-700 mb-2">
                  Bénéficiez des conseils personnalisés d&apos;experts reconnus ou devenez mentor 
                  pour partager votre expérience avec les nouveaux créateurs.
                </p>
                <a href="#" className="text-blue-600 hover:underline font-medium">En savoir plus sur le mentorat →</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Témoignages */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Ce que disent nos membres</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-indigo-600 text-xl font-bold">JP</span>
                </div>
                <div>
                  <h3 className="font-semibold">Jean-Philippe Durand</h3>
                  <p className="text-sm text-gray-600">Créateur d&apos;agents IA depuis 2 ans</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Cette communauté a été un véritable accélérateur pour mon activité. Les échanges avec 
                d&apos;autres créateurs m&apos;ont permis d&apos;améliorer rapidement mes agents et d&apos;augmenter 
                mes ventes de 40% en seulement 6 mois."
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-pink-600 text-xl font-bold">SM</span>
                </div>
                <div>
                  <h3 className="font-semibold">Sophie Martin</h3>
                  <p className="text-sm text-gray-600">Nouvelle créatrice d&apos;agents IA</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Quand j&apos;ai commencé à développer mon premier agent IA, j&apos;étais complètement perdue. 
                Grâce au programme de mentorat et aux ressources de la communauté, j&apos;ai pu lancer mon 
                premier produit en 3 mois au lieu des 6 initialement prévus."
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-8 text-center text-white">
          <h2 className="text-2xl font-semibold mb-4">Prêt à rejoindre notre communauté ?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Inscrivez-vous dès aujourd&apos;hui pour accéder à tous les avantages de notre communauté 
            et propulser le développement de vos agents IA.
          </p>
          <button className="bg-white text-blue-700 hover:bg-blue-50 font-medium py-3 px-8 rounded-md transition duration-300">
            Rejoindre la communauté
          </button>
        </div>
      </div>
    </main>
  );
}
