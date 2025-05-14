import { Metadata } from 'next';
import { APP_NAME } from '@/constants';
import PricingEnterpriseClient from './PricingEnterpriseClient';

export const metadata: Metadata = {
  title: `Tarification Entreprises | ${APP_NAME}`,
  description: 'Découvrez nos formules d\'abonnement pour les entreprises et trouvez celle qui correspond à vos besoins',
};

/**
 * Page de tarification pour les entreprises
 */
export default function EnterprisePricingPage() {
  return <PricingEnterpriseClient />;
}
