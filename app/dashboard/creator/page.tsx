import { Metadata } from 'next';
import { APP_NAME, ROUTES } from '@/constants';
import { withRoleProtection } from '@/lib/utils/withRoleProtection';
import CreatorDashboardClient from './CreatorDashboardClient';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: `Tableau de bord Créateur | ${APP_NAME}`,
  description: 'Gérez vos agents IA, suivez vos performances et développez votre activité',
};

export default async function CreatorDashboardPage() {
  try {
    // Vérifier l'authentification côté serveur via cookie sécurisé
    const userData = await withRoleProtection('creator');

    // Construction des props pour le client
    const clientUserData = {
      id: userData?.user?.id || '',
      email: userData?.email || '',
      name: userData?.name || '',
    };

    // Si l'ID est manquant, on tente une récupération directe via Supabase
    if (!clientUserData.id) {
      const { createServerSupabaseClient } = await import('@/lib/api/auth-server');
      const supabase = createServerSupabaseClient();
      const { data: sessionData, error } = await supabase.auth.getSession();

      if (sessionData?.session?.user?.id && !error) {
        clientUserData.id = sessionData.session.user.id;
        clientUserData.email = sessionData.session.user.email || clientUserData.email;

        const { data: profileData } = await supabase
          .from('users')
          .select('name')
          .eq('id', clientUserData.id)
          .single();

        if (profileData?.name) {
          clientUserData.name = profileData.name;
        }
      }
    }

    // 🚫 Rediriger immédiatement si l’ID est toujours absent
    if (!clientUserData.id) {
      console.warn('[DASHBOARD] Aucune session valide détectée. Redirection serveur vers /auth/signin.');
      redirect(ROUTES.AUTH.SIGNIN);
    }

    // ✅ Rendu normal avec les bonnes données
    return <CreatorDashboardClient userData={clientUserData} />;
  } catch (error) {
    console.error('[DASHBOARD] Erreur de vérification serveur:', error);
    redirect(ROUTES.AUTH.SIGNIN);
  }
}
