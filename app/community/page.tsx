import { Metadata } from 'next';
import CommunityClient from '@/CommunityClient';

export const metadata: Metadata = {
  title: 'Communauté | Marketplace',
  description: 'Découvrez et partagez des messages avec notre communauté',
};

export default function CommunityPage() {
  return <CommunityClient />;
}
