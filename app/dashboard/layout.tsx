import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AuthProvider } from '@/lib/context/AuthContext';
import { getServerSession } from '@/lib/api/auth-server';
import { ROUTES } from '@/constants';

// Layout pour les pages du tableau de bord
// - Vérifie l'authentification côté serveur
// - Inclut le AuthProvider pour les composants client
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Vérification de l'authentification côté serveur
  const session = await getServerSession();
  
  console.log('Dashboard Layout - User Session:', session ? `Session trouvée pour ${session.user.email}` : 'Aucune session');
  
  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  if (!session) {
    console.error('Aucune session trouvée dans le layout Dashboard, redirection vers signin');
    redirect(ROUTES.AUTH.SIGNIN);
  }
  
  // Au lieu d'utiliser un cookie, nous stockerons les données utilisateur dans un script côté client
  // qui initialise le localStorage au chargement de la page
  const userDataForClient = {
    id: session.user?.id || '',
    email: session.user?.email || '',
    name: session.user?.user_metadata?.name || ''
  };
  
  console.log('Dashboard données utilisateur pour localStorage:', JSON.stringify(userDataForClient));
  
  // Obtenir le rôle de l'utilisateur
  const userRole = session.dbData?.role || session.user.user_metadata?.role;
  
  // Navigation adaptée au rôle
  return (
    <AuthProvider>
      {/* Script pour injecter les données utilisateur dans le localStorage avec plus de debugging */}
      <script id="user-data-script"
        dangerouslySetInnerHTML={{
          __html: `
            console.log('Script d\'injection des données utilisateur exécuté');
            try {
              if (typeof window !== 'undefined') {
                // Stocker les données utilisateur dans localStorage
                const userData = ${JSON.stringify(userDataForClient)};
                console.log('Données utilisateur à injecter:', userData);
                
                if (!userData || !userData.id) {
                  console.error('⚠️ ATTENTION: Données utilisateur invalides ou sans ID');
                }
                
                localStorage.setItem('user', JSON.stringify(userData));
                console.log('✅ Données utilisateur injectées dans localStorage avec ID:', userData.id);
                
                // Vérification que les données ont bien été stockées
                const storedData = localStorage.getItem('user');
                if (storedData) {
                  try {
                    const parsedData = JSON.parse(storedData);
                    console.log('Vérification des données stockées:', parsedData);
                    if (parsedData.id !== userData.id) {
                      console.error('⚠️ Incohérence dans l\'ID stocké');
                    }
                  } catch (e) {
                    console.error('Erreur lors de la vérification des données:', e);
                  }
                } else {
                  console.error('⚠️ Aucune donnée n\'a été stockée dans localStorage');
                }
              }
            } catch (e) {
              console.error('Erreur lors de l\'injection des données utilisateur:', e);
            }
          `
        }}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar - à ajuster selon vos besoins */}
          <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {userRole === 'creator' ? 'Espace Créateur' : 'Espace Entreprise'}
              </h2>
              
              <nav className="mt-6 space-y-1">
                {userRole === 'creator' ? (
                  // Navigation pour les créateurs
                  <>
                    <a 
                      href={ROUTES.DASHBOARD.CREATOR.ROOT} 
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
                    >
                      Tableau de bord
                    </a>
                    <a 
                      href={ROUTES.DASHBOARD.CREATOR.AGENTS} 
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
                    >
                      Mes Agents
                    </a>
                    <a 
                      href={ROUTES.DASHBOARD.CREATOR.STATS} 
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
                    >
                      Statistiques
                    </a>
                  </>
                ) : (
                  // Navigation pour les entreprises
                  <>
                    <a 
                      href={ROUTES.DASHBOARD.ENTERPRISE.ROOT} 
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
                    >
                      Accueil
                    </a>
                    <a 
                      href={ROUTES.DASHBOARD.ENTERPRISE.FAVORITES} 
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
                    >
                      Favoris
                    </a>
                    <a 
                      href={ROUTES.DASHBOARD.ENTERPRISE.HISTORY} 
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
                    >
                      Historique
                    </a>
                  </>
                )}
                
                {/* Liens communs */}
                <a 
                  href={ROUTES.COMMUNITY} 
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
                >
                  Communauté
                </a>
                <a 
                  href={ROUTES.HOME} 
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
                >
                  Retour au site
                </a>
              </nav>
            </div>
          </aside>
          
          {/* Contenu principal */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
