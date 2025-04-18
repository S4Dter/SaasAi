export default function GuideCreateurPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Guide du créateur</h1>
        
        <p className="text-lg mb-8">
          Ce guide complet vous accompagne à chaque étape de votre parcours en tant que créateur d&apos;agents IA 
          sur notre plateforme, de la conception initiale jusqu&apos;à la réussite commerciale.
        </p>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Sommaire</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 font-semibold rounded-full w-6 h-6 flex items-center justify-center mr-3">1</span>
                <a href="#conception" className="text-blue-600 hover:underline">Conception et développement</a>
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 font-semibold rounded-full w-6 h-6 flex items-center justify-center mr-3">2</span>
                <a href="#optimisation" className="text-blue-600 hover:underline">Optimisation et validation</a>
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 font-semibold rounded-full w-6 h-6 flex items-center justify-center mr-3">3</span>
                <a href="#publication" className="text-blue-600 hover:underline">Publication sur la marketplace</a>
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 font-semibold rounded-full w-6 h-6 flex items-center justify-center mr-3">4</span>
                <a href="#promotion" className="text-blue-600 hover:underline">Promotion et visibilité</a>
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 font-semibold rounded-full w-6 h-6 flex items-center justify-center mr-3">5</span>
                <a href="#faq" className="text-blue-600 hover:underline">FAQ et ressources</a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Section 1: Conception et développement */}
        <div id="conception" className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
            Conception et développement
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Identifier un besoin du marché</h3>
              <p className="text-gray-700 mb-3">
                Commencez par identifier un problème spécifique que votre agent IA peut résoudre pour les entreprises. 
                Effectuez une étude de marché pour comprendre les besoins non satisfaits et la demande potentielle.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Analysez les tendances du marché et les demandes des entreprises</li>
                <li>Identifiez les niches sous-exploitées ou mal desservies</li>
                <li>Évaluez la concurrence existante et leurs lacunes</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Définir les fonctionnalités clés</h3>
              <p className="text-gray-700 mb-3">
                Élaborez une liste des fonctionnalités essentielles que votre agent doit offrir pour résoudre 
                efficacement le problème identifié. Concentrez-vous sur la valeur ajoutée unique.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-800 font-medium">Conseil :</p>
                <p className="text-gray-700">
                  Privilégiez la qualité à la quantité. Un agent qui fait quelques tâches remarquablement bien 
                  est préférable à un agent qui en fait beaucoup de façon médiocre.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section 2: Optimisation et validation */}
        <div id="optimisation" className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
            Optimisation et validation
          </h2>
          
          <div className="space-y-4">
            <p className="text-gray-700">
              Testez rigoureusement votre agent avec des utilisateurs réels pour identifier les bugs, 
              améliorer les performances et affiner l&apos;expérience utilisateur.
            </p>
            
            <h3 className="text-xl font-semibold mb-2">Documentation technique</h3>
            <p className="text-gray-700 mb-3">
              Créez une documentation complète et claire pour faciliter l&apos;intégration et l&apos;utilisation 
              de votre agent par les entreprises clientes.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-800 font-medium">Éléments à inclure :</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Guide d&apos;intégration technique détaillé</li>
                <li>Documentation de l&apos;API avec exemples</li>
                <li>Guide de dépannage et FAQ techniques</li>
                <li>Bonnes pratiques d&apos;utilisation</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Section 3: Publication sur la marketplace */}
        <div id="publication" className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
            Publication sur la marketplace
          </h2>
          
          <div className="space-y-4">
            <p className="text-gray-700">
              Concevez une fiche produit convaincante qui met en avant les avantages uniques de votre agent 
              et répond clairement aux besoins des entreprises ciblées.
            </p>
            
            <h3 className="text-xl font-semibold mb-2">Stratégie de tarification</h3>
            <p className="text-gray-700 mb-3">
              Définissez un modèle de tarification compétitif et adapté à votre cible, qui reflète 
              la valeur de votre agent tout en restant attractif pour les clients potentiels.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-800 font-medium">Critères d&apos;évaluation :</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Fonctionnalité et fiabilité</li>
                <li>Sécurité et confidentialité des données</li>
                <li>Qualité de la documentation technique</li>
                <li>Expérience utilisateur et interface</li>
                <li>Pertinence et valeur ajoutée</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Section 4: Promotion et visibilité */}
        <div id="promotion" className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
            Promotion et visibilité
          </h2>
          
          <div className="space-y-4">
            <p className="text-gray-700">
              Optimisez votre fiche produit avec des mots-clés pertinents pour améliorer sa visibilité 
              dans les recherches sur la marketplace et attirer plus de clients potentiels.
            </p>
            
            <h3 className="text-xl font-semibold mb-2">Marketing et promotion</h3>
            <p className="text-gray-700 mb-3">
              Utilisez différents canaux pour promouvoir votre agent IA et attirer des clients au-delà 
              de la marketplace elle-même.
            </p>
            
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Créez du contenu de qualité sur votre blog ou site web</li>
              <li>Partagez votre agent sur les réseaux sociaux professionnels</li>
              <li>Participez aux webinaires et événements de la communauté</li>
              <li>Proposez des démos gratuites ou des périodes d&apos;essai</li>
              <li>Demandez des avis et témoignages à vos premiers clients</li>
            </ul>
          </div>
        </div>
        
        {/* Section 5: FAQ et ressources */}
        <div id="faq" className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
            FAQ et ressources
          </h2>
          
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-semibold mb-2">Combien de temps prend le processus de validation ?</h4>
              <p className="text-gray-700">
                Le processus de validation prend généralement entre 2 et 5 jours ouvrés, selon la complexité 
                de votre agent et le volume de demandes en cours de traitement.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-semibold mb-2">Quelles sont les commissions prélevées par la plateforme ?</h4>
              <p className="text-gray-700">
                La plateforme prélève une commission de 15% sur chaque transaction. Cette commission inclut 
                les frais de traitement des paiements, l&apos;hébergement, le support et la promotion de votre agent.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Quel support est disponible pour les créateurs ?</h4>
              <p className="text-gray-700">
                Les créateurs bénéficient d&apos;un support dédié via email et chat, d&apos;un accès à notre 
                communauté privée, et de ressources exclusives comme des webinaires et formations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
