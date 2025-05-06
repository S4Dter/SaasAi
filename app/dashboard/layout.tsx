import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { AuthProvider } from '@/lib/context/AuthContext';
import { getServerSession } from '@/lib/api/auth-server';
import { ROUTES } from '@/constants';

// Layout pour les pages du tableau de bord
// - Vérifie l'authentification côté serveur
// - Inclut le AuthProvider pour les composants client
// - Ne redirige plus côté serveur pour éviter les boucles
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Vérification de l'authentification côté serveur
  const session = await getServerSession();
  
  console.log('Dashboard Layout - User Session:', session ? `Session trouvée pour ${session.user.email}` : 'Aucune session');
  
  // Préparer les données utilisateur à passer au client
  // Si l'utilisateur n'est pas authentifié, nous passons quand même un objet vide
  // et laissons le client gérer l'état non authentifié
  const userDataForClient = session ? {
    id: session.user?.id || '',
    email: session.user?.email || '',
    name: session.user?.user_metadata?.name || '',
    role: session.dbData?.role || session.user.user_metadata?.role || ''
  } : {
    id: '',
    email: '',
    name: '',
    role: ''
  };
  
  console.log('Dashboard données utilisateur pour localStorage:', JSON.stringify(userDataForClient));
  
  // Obtenir le rôle de l'utilisateur si disponible
  const userRole = session ? (session.dbData?.role || session.user.user_metadata?.role) : null;
  
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
                  console.warn('⚠️ ATTENTION: Données utilisateur invalides ou sans ID');
                }
                
                localStorage.setItem('user', JSON.stringify(userData));
                
                if (userData && userData.id) {
                  console.log('✅ Données utilisateur injectées dans localStorage avec ID:', userData.id);
                }
                
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
      
      {/* Si aucune session n'est disponible, nous affichons quand même le layout
          et laissons le client décider du comportement */}
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar - à ajuster selon vos besoins */}
          {userRole && (
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
          )}
          
          {/* Contenu principal */}
          <main className={`${userRole ? 'flex-1' : 'w-full'} p-6`}>
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
