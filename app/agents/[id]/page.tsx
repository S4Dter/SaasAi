import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants';

export default function Page() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Page de détail de l'agent
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Cette page est en cours de développement. La configuration actuelle des routes 
          dynamiques requiert une attention particulière dans le contexte de Next.js.
        </p>
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-8">
          <p className="text-gray-800">
            Note technique: Cette page rencontre une erreur liée à l'utilisation de 
            <code className="bg-yellow-100 px-1 rounded">params.id</code> dans un contexte 
            asynchrone. Dans une application de production, nous utiliserions une 
            solution d'accès aux paramètres conforme aux pratiques de Next.js.
          </p>
        </div>
        <Link href={ROUTES.AGENTS}>
          <Button variant="primary">Retour au catalogue</Button>
        </Link>
      </div>
    </div>
  );
}
