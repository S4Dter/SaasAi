'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";

/**
 * Page intermédiaire pour résoudre le problème de redirection
 * Redirige automatiquement vers le tableau de bord approprié basé sur le rôle de l'utilisateur
 */
export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Récupération du rôle depuis localStorage
    const userRole = localStorage.getItem('user-role');
    
    // Détermination de la destination de redirection
    let redirectPath: string = ROUTES.HOME;
    
    if (userRole === 'creator') {
      redirectPath = ROUTES.DASHBOARD.CREATOR.ROOT;
    } else if (userRole === 'enterprise') {
      redirectPath = ROUTES.DASHBOARD.ENTERPRISE.ROOT;
    }
    
    console.log('Redirection vers:', redirectPath);
    
    // Redirection directe via window.location pour éviter les problèmes de cache
    window.location.href = redirectPath;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Redirection en cours...</h2>
        <p className="text-gray-500 mt-2">Vous allez être redirigé vers votre espace personnel.</p>
      </div>
    </div>
  );
}
