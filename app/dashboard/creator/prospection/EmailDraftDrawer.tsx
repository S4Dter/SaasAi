'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { Prospect } from '@/types/prospection';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';

interface EmailDraftDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: Prospect;
  emailContent: string;
}

export default function EmailDraftDrawer({
  isOpen,
  onClose,
  prospect,
  emailContent
}: EmailDraftDrawerProps) {
  const [content, setContent] = useState(emailContent);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createBrowserSupabaseClient();
  
  // Fonction pour copier le contenu dans le presse-papier
  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content)
        .then(() => toast.success('Email copié dans le presse-papier'))
        .catch(() => toast.error('Échec de la copie'));
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Clipboard
      const textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      
      try {
        document.execCommand('copy');
        toast.success('Email copié dans le presse-papier');
      } catch (err) {
        toast.error('Échec de la copie');
      }
      
      document.body.removeChild(textarea);
    }
  };
  
  // Fonction pour sauvegarder le brouillon modifié
  const handleSaveDraft = async () => {
    setIsSaving(true);
    
    try {
      // TODO: Implémentation stub, à brancher sur l'API réelle plus tard
      // Intégration future avec n8n
      await fetch('/api/save-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prospectId: prospect.id,
          content
        })
      });
      
      toast.success('Brouillon sauvegardé');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du brouillon:', error);
      toast.error('Échec de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-auto w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl" side="right">
        <SheetHeader className="pb-6">
          <SheetTitle>Brouillon d'email pour {prospect.name}</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="sm" className="absolute top-4 right-4">
              Fermer
            </Button>
          </SheetClose>
        </SheetHeader>
        
        <div className="w-full mx-auto">
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="mb-2">
              <div className="text-sm text-gray-500">À: {prospect.email}</div>
              <div className="text-sm text-gray-500">
                Sujet: Découvrez comment nos agents IA peuvent transformer votre entreprise
              </div>
            </div>
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[400px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Le contenu du brouillon d'email apparaîtra ici..."
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCopy}>
              Copier
            </Button>
            <Button onClick={handleSaveDraft} disabled={isSaving}>
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
          
          <div className="mt-6">
            <div className="text-sm text-gray-500 mb-2">
              <strong>Rappel :</strong> Ce brouillon est généré automatiquement. Assurez-vous de le personnaliser davantage avant de l'envoyer.
            </div>
            <div className="text-xs text-gray-400">
              <strong>TODO :</strong> L'envoi effectif de l'email et le suivi de séquence seront ajoutés plus tard via n8n.
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
export { EmailDraftDrawer}