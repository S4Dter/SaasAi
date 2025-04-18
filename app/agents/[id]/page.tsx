import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAgentById } from '@/mock/agents';
import AgentDetails from '@/components/agents/AgentDetails';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import { getUserById } from '@/mock/users';

// Types compatibles avec Next.js App Router
interface ParamsType {
  id: string;
}

type AgentPageProps = {
  params: ParamsType | Promise<ParamsType>;
  searchParams?: Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>;
};

// Fonction generateMetadata typée correctement
export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  // Résoudre params s'il s'agit d'une Promise
  const resolvedParams = params instanceof Promise ? await params : params;
  const agent = getAgentById(resolvedParams.id);

  if (!agent) {
    return {
      title: 'Agent non trouvé',
      description: "L'agent demandé n'existe pas ou a été supprimé.",
    };
  }

  return {
    title: agent.name,
    description: agent.shortDescription,
    keywords: [agent.category, 'agent IA', ...agent.integrations],
    openGraph: {
      title: agent.name,
      description: agent.shortDescription,
      type: 'website',
      images: [
        {
          url: agent.logoUrl.startsWith('http')
            ? agent.logoUrl
            : `${process.env.NEXT_PUBLIC_BASE_URL || ''}${agent.logoUrl}`,
          width: 1200,
          height: 630,
          alt: agent.name,
        },
      ],
    },
  };
}

// Composant de page avec une gestion correcte de params Promise
export default async function AgentPage({ params }: AgentPageProps) {
  // Résoudre params s'il s'agit d'une Promise
  const resolvedParams = params instanceof Promise ? await params : params;
  const agent = getAgentById(resolvedParams.id);
  
  if (!agent) notFound();

  const creator = getUserById(agent.creatorId);

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <nav className="flex text-sm">
            <Link href={ROUTES.HOME} className="text-gray-500 hover:text-gray-700">
              Accueil
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link href={ROUTES.AGENTS} className="text-gray-500 hover:text-gray-700">
              Catalogue
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-900 font-medium">{agent.name}</span>
          </nav>
        </div>

        <AgentDetails agent={agent} />

        <div className="mt-8 flex justify-between">
          <Link href={ROUTES.AGENTS}>
            <Button variant="outline">Retour au catalogue</Button>
          </Link>

          <div className="flex gap-4">
            <Button variant="secondary">Ajouter aux favoris</Button>
            <Button>Contacter le créateur</Button>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vous pourriez aussi aimer</h2>
          <div className="bg-blue-50 p-8 text-center rounded-lg border border-blue-100">
            <p className="text-gray-700">
              Dans une application réelle, une liste d'agents similaires serait affichée ici,
              basée sur la catégorie ou d'autres métadonnées.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}