import { Metadata } from 'next';
import { APP_NAME } from '@/constants';
import PricingCreatorClient from './PricingCreatorClient';

export const metadata: Metadata = {
  title: `Tarification Créateurs | ${APP_NAME}`,
  description: 'Découvrez nos formules d\'abonnement pour les créateurs d\'agents IA et trouvez celle qui correspond à vos besoins',
};

/**
 * Page de tarification pour les créateurs
 */
export default function CreatorPricingPage() {
  return <PricingCreatorClient />;
}
