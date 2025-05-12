'use client';

import { useState } from 'react';
import { Pencil, Trash2, Save, X, PlusCircle, Tag } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory } from '@/lib/api/admin';
import { ROUTES } from '@/constants';

// Type pour les catégories
type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  created_at?: string;
  updated_at?: string;
};

interface CategoryManagementClientProps {
  initialCategories: Category[];
}

export default function CategoryManagementClient({
  initialCategories,
}: CategoryManagementClientProps) {
  // État local
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    slug: '',
    description: '',
    icon: '',
  });
  const [editedCategories, setEditedCategories] = useState<{ [key: string]: Category }>({});
  const [error, setError] = useState<string | null>(null);

  // Formatter les dates pour l'affichage
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Formatage du slug
  const formatSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Gestionnaire pour commencer à éditer une catégorie
  const handleStartEdit = (category: Category) => {
    setEditMode(prev => ({ ...prev, [category.id]: true }));
    setEditedCategories(prev => ({ ...prev, [category.id]: { ...category } }));
  };

  // Gestionnaire pour annuler l'édition
  const handleCancelEdit = (categoryId: string) => {
    setEditMode(prev => {
      const newState = { ...prev };
      delete newState[categoryId];
      return newState;
    });
    setEditedCategories(prev => {
      const newState = { ...prev };
      delete newState[categoryId];
      return newState;
    });
  };

  // Gestionnaire pour mettre à jour les valeurs d'édition
  const handleEditChange = (categoryId: string, field: keyof Category, value: string) => {
    setEditedCategories(prev => {
      const updated = { ...prev };
      updated[categoryId] = { ...updated[categoryId], [field]: value };
      
      // Mettre à jour automatiquement le slug si on modifie le nom
      if (field === 'name') {
        updated[categoryId].slug = formatSlug(value);
      }
      
      return updated;
    });
  };

  // Gestionnaire pour les changements dans le formulaire de nouvelle catégorie
  const handleNewCategoryChange = (field: keyof Omit<Category, 'id' | 'created_at' | 'updated_at'>, value: string) => {
    setNewCategory(prev => {
      const updated = { ...prev, [field]: value };
      
      // Mettre à jour automatiquement le slug si on modifie le nom
      if (field === 'name') {
        updated.slug = formatSlug(value);
      }
      
      return updated;
    });
  };

  // Gestionnaire pour sauvegarder les modifications
  const handleSaveEdit = async (categoryId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const editedCategory = editedCategories[categoryId];
      const result = await updateCategory(categoryId, {
        name: editedCategory.name,
        slug: editedCategory.slug,
        description: editedCategory.description,
        icon: editedCategory.icon,
      });
      
      // Mettre à jour l'état local
      setCategories(prev => 
        prev.map(cat => cat.id === categoryId ? result : cat)
      );
      
      // Sortir du mode édition
      handleCancelEdit(categoryId);
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de la catégorie:', err);
      setError(`Erreur lors de la mise à jour: ${err.message || 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestionnaire pour la suppression d'une catégorie
  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.')) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      await deleteCategory(categoryId);
      
      // Mettre à jour l'état local
      setCategories(prev => 
        prev.filter(cat => cat.id !== categoryId)
      );
    } catch (err: any) {
      console.error('Erreur lors de la suppression de la catégorie:', err);
      setError(`Erreur lors de la suppression: ${err.message || 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestionnaire pour la création d'une nouvelle catégorie
  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      setError('Le nom de la catégorie est obligatoire');
      return;
    }
    
    if (!newCategory.slug.trim()) {
      setError('L\'identifiant (slug) de la catégorie est obligatoire');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await createCategory({
        name: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description,
        icon: newCategory.icon,
      });
      
      // Ajouter la nouvelle catégorie à l'état local
      setCategories(prev => [...prev, result]);
      
      // Réinitialiser le formulaire
      setNewCategory({
        name: '',
        slug: '',
        description: '',
        icon: '',
      });
      setShowNewCategoryForm(false);
    } catch (err: any) {
      console.error('Erreur lors de la création de la catégorie:', err);
      setError(`Erreur lors de la création: ${err.message || 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Erreur : </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      
      {/* Bouton pour ajouter une nouvelle catégorie */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={isLoading}
        >
          {showNewCategoryForm ? (
            <>
              <X className="h-5 w-5 mr-2" />
              Annuler
            </>
          ) : (
            <>
              <PlusCircle className="h-5 w-5 mr-2" />
              Nouvelle catégorie
            </>
          )}
        </button>
      </div>
      
      {/* Formulaire pour une nouvelle catégorie */}
      {showNewCategoryForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium mb-4">Ajouter une nouvelle catégorie</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom *
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => handleNewCategoryChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
                placeholder="Ex: Marketing"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Identifiant (slug) *
              </label>
              <input
                type="text"
                value={newCategory.slug}
                onChange={(e) => handleNewCategoryChange('slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
                placeholder="Ex: marketing"
              />
              <p className="text-xs text-gray-500 mt-1">
                Utilisé dans les URLs. Uniquement des lettres minuscules, chiffres et tirets.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Icône
              </label>
              <input
                type="text"
                value={newCategory.icon || ''}
                onChange={(e) => handleNewCategoryChange('icon', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
                placeholder="URL ou nom d'icône"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newCategory.description || ''}
                onChange={(e) => handleNewCategoryChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
                rows={3}
                placeholder="Brève description de la catégorie"
              ></textarea>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setShowNewCategoryForm(false);
                setNewCategory({
                  name: '',
                  slug: '',
                  description: '',
                  icon: '',
                });
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={isLoading}
            >
              Annuler
            </button>
            
            <button
              onClick={handleCreateCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={isLoading || !newCategory.name.trim() || !newCategory.slug.trim()}
            >
              {isLoading ? 'Création...' : 'Créer la catégorie'}
            </button>
          </div>
        </div>
      )}
      
      {/* Tableau des catégories */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nom
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Identifiant (slug)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date de création
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {/* Mode édition ou affichage selon l'état */}
                  {editMode[category.id] ? (
                    // Mode édition
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={editedCategories[category.id]?.name || ''}
                          onChange={(e) => handleEditChange(category.id, 'name', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          disabled={isLoading}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={editedCategories[category.id]?.slug || ''}
                          onChange={(e) => handleEditChange(category.id, 'slug', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          disabled={isLoading}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <textarea
                          value={editedCategories[category.id]?.description || ''}
                          onChange={(e) => handleEditChange(category.id, 'description', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          disabled={isLoading}
                          rows={2}
                        ></textarea>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {formatDate(category.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleSaveEdit(category.id)}
                          className="text-green-600 hover:text-green-900 inline-flex items-center"
                          disabled={isLoading}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Enregistrer
                        </button>
                        <button
                          onClick={() => handleCancelEdit(category.id)}
                          className="text-gray-600 hover:text-gray-900 inline-flex items-center ml-2"
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Annuler
                        </button>
                      </td>
                    </>
                  ) : (
                    // Mode affichage
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {category.icon ? (
                            <span className="mr-2">{category.icon}</span>
                          ) : (
                            <Tag className="h-5 w-5 text-gray-400 mr-2" />
                          )}
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {category.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {category.slug}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {category.description || <em className="text-gray-400">Pas de description</em>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {formatDate(category.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleStartEdit(category)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          disabled={isLoading}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center ml-2"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Aucune catégorie trouvée. Créez votre première catégorie!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
