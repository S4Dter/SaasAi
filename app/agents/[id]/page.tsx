import { Metadata } from 'next';
import { APP_NAME } from '@/constants';
import AgentDetailsClient from './AgentDetailsClient';

interface AgentPageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: `Détails de l'agent | ${APP_NAME}`,
  description: 'Découvrez les détails, fonctionnalités et tarifs de cet agent IA',
};

export default function AgentPage({ params }: AgentPageProps) {
  return <AgentDetailsClient id={params.id} />;
}
