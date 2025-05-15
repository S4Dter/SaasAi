import { Suspense } from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/api/auth-server';
import ProspectsTable from './ProspectsTable';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { APP_NAME } from '@/constants';

export const metadata: Metadata = {
  title: `Prospection | ${APP_NAME}`,
  description: 'Gérez vos prospects et trouvez de nouvelles opportunités',
};

export default async function ProspectionPage() {
  // Vérification de la session et du rôle créateur
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect('/signin?callbackUrl=/dashboard/creator/prospection');
  }
  
  const userRole = session.user.role;
  
  if (userRole !== 'creator') {
    redirect('/dashboard');
  }
  
  // Création du client Supabase côté serveur
  const supabase = createServerSupabaseClient();
  
  // Récupération des prospects ordonnés par match_score DESC
  const { data: initialProspects, error } = await supabase
    .from('prospects')
    .select('*')
    .order('match_score', { ascending: false });
    
  if (error) {
    console.error('Error fetching prospects:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Prospection</h1>
      <Suspense fallback={<div>Chargement des prospects...</div>}>
        <ProspectsTable initialData={initialProspects || []} />
      </Suspense>
    </div>
  );
}
