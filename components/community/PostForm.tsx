'use client';

import React, { useState } from 'react';
import { CreatePostPayload } from '@/types/community';

interface PostFormProps {
  isAuthenticated: boolean;
  onSubmit: (postData: CreatePostPayload) => Promise<boolean>;
}

const PostForm: React.FC<PostFormProps> = ({ isAuthenticated, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation de base
    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }
    
    if (!content.trim()) {
      setError('Le contenu est requis');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      const success = await onSubmit({ title, content });
      
      if (success) {
        // Réinitialiser le formulaire après soumission réussie
        setTitle('');
        setContent('');
      } else {
        setError('Une erreur est survenue lors de la publication');
      }
    } catch (err) {
      console.error('Erreur lors de la soumission du post:', err);
      setError('Une erreur est survenue lors de la publication');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg mb-6">
        <p className="text-gray-700">Connectez-vous pour publier un message dans la communauté.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Publier un message</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
          Titre
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de votre message"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          disabled={isSubmitting}
          maxLength={100}
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
          Contenu
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Partagez votre message avec la communauté..."
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows={4}
          disabled={isSubmitting}
          maxLength={2000}
        />
      </div>
      
      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Publication en cours...
            </span>
          ) : 'Publier'}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
