import { Metadata } from 'next';
import { APP_NAME } from '@/constants';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
  title: `Tarification | ${APP_NAME}`,
  description: 'Découvrez nos différentes formules d\'abonnement et trouvez celle qui vous convient',
};

/**
 * Page de tarification
 */
export default function PricingPage() {
  return <PricingClient />;
}
