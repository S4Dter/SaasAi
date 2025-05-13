import { ReactNode } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Blog',
    template: '%s | Blog'
  },
  description: 'Découvrez nos articles et actualités',
};

interface BlogLayoutProps {
  children: ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Blog Navigation */}
      <div className="border-b">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link 
                href="/blog" 
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                Accueil
              </Link>
              <Link 
                href="/blog/search" 
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                Recherche
              </Link>
            </div>
            
            <div>
              <Link
                href="/dashboard/blog"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Admin
              </Link>
            </div>
          </nav>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Blog Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} | Tous droits réservés
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
