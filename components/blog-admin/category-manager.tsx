'use client';

import { useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/blog';
import { createCategory, updateCategory, deleteCategory } from '@/lib/blog/actions';
import { generateSlug } from '@/lib/blog/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface CategoryManagerProps {
  categories: Category[];
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  
  const formRef = useRef<HTMLFormElement>(null);
  
  // Reset form
  const resetForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setIsCreating(false);
    setIsEditing(null);
  };
  
  // Start editing a category
  const handleEdit = (category: Category) => {
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || '');
    setIsEditing(category.id);
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
    formData.append('description', description);
    
    try {
      if (isEditing) {
        // Update existing category
        setIsEditing(null);
        await updateCategory(isEditing, formData);
      } else {
        // Create new category
        setIsCreating(false);
        await createCategory(formData);
      }
      
      // Reset form and refresh data
      resetForm();
      router.refresh();
    } catch (error) {
      console.error('Error submitting category:', error);
      alert('Une erreur est survenue');
    }
  };
  
  // Handle category deletion
  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return;
    }
    
    try {
      setIsDeleting(categoryId);
      await deleteCategory(categoryId);
      router.refresh();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Une erreur est survenue lors de la suppression');
    } finally {
      setIsDeleting(null);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Catégories ({categories.length})</CardTitle>
        {!isCreating && !isEditing && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Ajouter une catégorie
          </button>
        )}
      </CardHeader>
      <CardContent>
        {/* Category form */}
        {(isCreating || isEditing) && (
          <form ref={formRef} onSubmit={handleSubmit} className="mb-8 space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-medium">
              {isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
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
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              />
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
        
        {/* Categories list */}
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune catégorie disponible</p>
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
                {categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <span className="font-medium">{category.name}</span>
                      {category.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {category.description}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-sm hidden md:table-cell">
                      {category.slug}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-sm text-primary hover:text-primary/80"
                          disabled={isEditing === category.id || isDeleting === category.id}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                          disabled={isDeleting === category.id}
                        >
                          {isDeleting === category.id ? 'Suppression...' : 'Supprimer'}
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
