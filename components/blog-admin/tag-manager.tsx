'use client';

import { useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Tag } from '@/types/blog';
import { createTag, updateTag, deleteTag } from '@/lib/blog/actions';
import { generateSlug } from '@/lib/blog/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface TagManagerProps {
  tags: Tag[];
}

export function TagManager({ tags }: TagManagerProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  
  const formRef = useRef<HTMLFormElement>(null);
  
  // Reset form
  const resetForm = () => {
    setName('');
    setSlug('');
    setIsCreating(false);
    setIsEditing(null);
  };
  
  // Start editing a tag
  const handleEdit = (tag: Tag) => {
    setName(tag.name);
    setSlug(tag.slug);
    setIsEditing(tag.id);
    setIsCreating(false);
  };
  
  // Handle form submission (create or update)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!name.trim()) {
      alert('Le nom est requis');
      return;
    }
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug || generateSlug(name));
    
    try {
      if (isEditing) {
        // Update existing tag
        setIsEditing(null);
        await updateTag(isEditing, formData);
      } else {
        // Create new tag
        setIsCreating(false);
        await createTag(formData);
      }
      
      // Reset form and refresh data
      resetForm();
      router.refresh();
    } catch (error) {
      console.error('Error submitting tag:', error);
      alert('Une erreur est survenue');
    }
  };
  
  // Handle tag deletion
  const handleDelete = async (tagId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce tag ?')) {
      return;
    }
    
    try {
      setIsDeleting(tagId);
      await deleteTag(tagId);
      router.refresh();
    } catch (error) {
      console.error('Error deleting tag:', error);
      alert('Une erreur est survenue lors de la suppression');
    } finally {
      setIsDeleting(null);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tags ({tags.length})</CardTitle>
        {!isCreating && !isEditing && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Ajouter un tag
          </button>
        )}
      </CardHeader>
      <CardContent>
        {/* Tag form */}
        {(isCreating || isEditing) && (
          <form ref={formRef} onSubmit={handleSubmit} className="mb-8 space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-medium">
              {isEditing ? 'Modifier le tag' : 'Nouveau tag'}
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!isEditing || !slug) {
                      setSlug(generateSlug(e.target.value));
                    }
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="slug" className="block text-sm font-medium">
                  Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Laissez vide pour générer automatiquement
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
              >
                {isEditing ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        )}
        
        {/* Tags list */}
        {tags.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun tag disponible</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Nom</th>
                  <th className="text-left py-3 px-4 hidden md:table-cell">Slug</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tags.map((tag) => (
                  <tr key={tag.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <span className="font-medium">#{tag.name}</span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-sm hidden md:table-cell">
                      {tag.slug}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(tag)}
                          className="text-sm text-primary hover:text-primary/80"
                          disabled={isEditing === tag.id || isDeleting === tag.id}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(tag.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                          disabled={isDeleting === tag.id}
                        >
                          {isDeleting === tag.id ? 'Suppression...' : 'Supprimer'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
