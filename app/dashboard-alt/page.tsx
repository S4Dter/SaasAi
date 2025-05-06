// app/dashboard-alt/page.tsx
import Link from 'next/link';
import { ROUTES } from '@/constants';

export default function EmergencyDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord d'urgence</h1>
      
      <div className="bg-amber-50 p-4 rounded mb-6">
        <p>
          Version simplifiée pour contourner les problèmes techniques. 
          Cette page ne tente pas de vérifier l'authentification ou de charger des données.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border p-4 rounded shadow">
          <h2 className="font-bold mb-2">Ajouter un agent</h2>
          <Link href={ROUTES.DASHBOARD.CREATOR.ADD_AGENT} className="text-blue-600">
            Accéder →
          </Link>
        </div>
        
        <div className="border p-4 rounded shadow">
          <h2 className="font-bold mb-2">Liste des agents</h2>
          <Link href={ROUTES.DASHBOARD.CREATOR.AGENTS} className="text-blue-600">
            Accéder →
          </Link>
        </div>
      </div>
    </div>
  );
}