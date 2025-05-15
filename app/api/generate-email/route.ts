import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getServerSession } from '@/lib/api/auth-server';

/**
 * API endpoint pour générer un brouillon d'email personnalisé pour un prospect
 * Utilise OpenAI pour la génération (appel côté serveur)
 */
export async function POST(request: Request) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non autorisé. Veuillez vous connecter.' },
        { status: 401 }
      );
    }
    
    // Vérifier le rôle créateur
    if (session.user.role !== 'creator') {
      return NextResponse.json(
        { error: 'Accès réservé aux créateurs.' },
        { status: 403 }
      );
    }
    
    // Obtenir les données de la requête
    const { prospectId } = await request.json();
    
    if (!prospectId) {
      return NextResponse.json(
        { error: 'ID du prospect requis' },
        { status: 400 }
      );
    }
    
    // Créer le client Supabase
    const supabase = createServerSupabaseClient();
    
    // Récupérer les informations du prospect
    const { data: prospectData, error: prospectError } = await supabase
      .from('prospects')
      .select('*')
      .eq('id', prospectId)
      .single();
    
    if (prospectError || !prospectData) {
      console.error('Erreur lors de la récupération du prospect:', prospectError);
      return NextResponse.json(
        { error: 'Prospect non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier que le prospect appartient bien à l'utilisateur (sécurité supplémentaire)
    if (prospectData.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas autorisé à accéder à ce prospect' },
        { status: 403 }
      );
    }
    
    // Récupérer les agents de l'utilisateur pour personnaliser l'email
    const { data: userAgents, error: agentsError } = await supabase
      .from('agents')
      .select('id, name, description, category, price')
      .eq('user_id', session.user.id)
      .limit(3);
    
    if (agentsError) {
      console.error('Erreur lors de la récupération des agents:', agentsError);
    }
    
    // Appel à OpenAI pour générer l'email
    // Dans un environnement de production, utilisez votre propre clé API et la bonne configuration
    const emailContent = await generateEmailWithOpenAI(prospectData, userAgents || []);
    
    // Mettre à jour la table des activités
    await supabase
      .from('prospect_activities')
      .insert([
        {
          prospect_id: prospectId,
          type: 'email_sent',
          details: 'Brouillon d\'email généré',
          created_at: new Date().toISOString()
        }
      ]);
    
    return NextResponse.json({ email: emailContent });
  } catch (error) {
    console.error('Erreur lors de la génération de l\'email:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la génération de l\'email' },
      { status: 500 }
    );
  }
}

/**
 * Fonction qui appelle OpenAI pour générer un email personnalisé
 * Cette implémentation est simplifiée et devrait être remplacée par un vrai appel à l'API OpenAI
 */
async function generateEmailWithOpenAI(prospect: any, agents: any[]) {
  // Simuler un délai pour représenter l'appel à l'API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Dans un environnement de production, utilisez l'API OpenAI
  // const response = await openai.chat.completions.create({...});
  
  // Pour le moment, nous retournons un email template avec les données du prospect
  return `Bonjour ${prospect.name},

Je suis [Votre Nom], créateur d'agents IA spécialisés dans le secteur ${prospect.industry_interest}.

En explorant votre profil et les besoins de ${prospect.company}, j'ai remarqué que nos solutions pourraient parfaitement répondre à vos attentes, particulièrement avec un budget ${prospect.budget}.

${agents.length > 0 ? `Parmi nos agents qui pourraient vous intéresser :
${agents.map(agent => `- ${agent.name}: ${agent.description.substring(0, 100)}...`).join('\n')}` : ''}

${prospect.needs ? `Concernant vos besoins spécifiques (${prospect.needs}), nous pouvons proposer une solution personnalisée.` : ''}

Seriez-vous disponible pour un appel de 15 minutes cette semaine afin de discuter de la façon dont nos agents IA pourraient contribuer à votre succès ?

Bien cordialement,
[Votre Nom]
Créateur d'Agents IA
`;
}
