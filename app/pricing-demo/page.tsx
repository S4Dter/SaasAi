/**
 * Cette page a été remplacée par app/pricing/page.tsx pour l'affichage tarifaire.
 * Redirection vers la page principale de tarification.
 */

import { redirect } from 'next/navigation';

export default function PricingDemoPage() {
  // Rediriger vers la page principale de tarification
  redirect('/pricing');
  return null;
}
