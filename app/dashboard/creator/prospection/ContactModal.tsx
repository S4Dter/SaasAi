// app/dashboard/creator/prospection/ContactModal.tsx
'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: {
    id: string;
    name: string;
    company: string;
  } | null;
  onSubmit: (prospectId: string, message: string) => Promise<void>;
}

export default function ContactModal({ 
  isOpen, 
  onClose, 
  prospect, 
  onSubmit 
}: ContactModalProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prospect) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(prospect.id, message);
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !prospect) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h2 className="text-xl font-semibold mb-4">
          Contacter {prospect.company}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Présentez votre agent IA et expliquez comment il peut aider cette entreprise..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}