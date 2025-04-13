import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { APP_NAME, APP_DESCRIPTION } from '../../constants';

// Définition de la police Inter avec les sous-ensembles latin
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Métadonnées pour le SEO
export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  keywords: ['agents IA', 'intelligence artificielle', 'marketplace', 'IA entreprise', 'automatisation'],
  authors: [{ name: APP_NAME }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
