import { useState } from 'react';
import { toast } from 'react-hot-toast';

// Type pour la fonction de génération d'email
export async function generateEmail(prospectId: string): Promise<string> {
  const res = await fetch('/api/generate-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prospectId }),
  });
  
  if (!res.ok) {
    throw new Error('Generation failed');
  }
  
  const { email } = await res.json();
  return email;
}

// Hook pour wrapper l'appel à l'API avec gestion d'état et toasts
export function useGenerateEmail() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const executeGenerateEmail = async (prospectId: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    // Afficher toast de chargement
    const toastId = toast.loading('Génération du brouillon en cours...');
    
    try {
      const emailContent = await generateEmail(prospectId);
      
      // Succès
      toast.success('Brouillon généré avec succès', { id: toastId });
      setIsLoading(false);
      
      // TODO: À connecter avec n8n pour la séquence d'envoi quand prêt
      
      return emailContent;
    } catch (err) {
      // Échec
      const error = err instanceof Error ? err : new Error('Une erreur est survenue');
      setError(error);
      toast.error(`Échec de la génération: ${error.message}`, { id: toastId });
      setIsLoading(false);
      throw error;
    }
  };

  return {
    generateEmail: executeGenerateEmail,
    isLoading,
    error
  };
}
