'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost, getAllCategories, getAllTags } from '@/lib/blog/actions';
import { PostWithRelations, Category, Tag } from '@/types/blog';
import { generateSlug } from '@/lib/blog/utils';
import { Editor } from './editor';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';

interface PostFormProps {
  post?: PostWithRelations;
  isEditing?: boolean;
}

export function PostForm({ post, isEditing = false }: PostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || '');
  const [status, setStatus] = useState(post?.status || 'draft');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories?.map(cat => cat.id) || []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    post?.tags?.map(tag => tag.id) || []
  );
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Fetch categories and tags
  useEffect(() => {
    async function fetchData() {
      try {
        const categoriesData = await getAllCategories();
        const tagsData = await getAllTags();
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    }
    
    fetchData();
  }, []);
  
  // Auto-generate slug when title changes (only if not editing or slug is empty)
  useEffect(() => {
    if ((!isEditing || !post?.slug) && title) {
      setSlug(generateSlug(title));
    }
  }, [title, isEditing, post?.slug]);
  
  // Handle form submission
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    // Validate form
    const validationErrors: Record<string, string> = {};
    if (!title.trim()) validationErrors.title = 'Le titre est requis';
    if (!slug.trim()) validationErrors.slug = 'Le slug est requis';
    if (!content.trim()) validationErrors.content = 'Le contenu est requis';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('content', content);
      formData.append('excerpt', excerpt);
      formData.append('status', status);
      
      if (featuredImage) {
        formData.append('featured_image', featuredImage);
      }
      
      selectedCategories.forEach(categoryId => {
        formData.append('category_ids', categoryId);
      });
      
      selectedTags.forEach(tagId => {
        formData.append('tag_ids', tagId);
      });
      
      let result;
      
      if (isEditing && post) {
        result = await updatePost(post.id, formData);
      } else {
        result = await createPost(formData);
      }
      
      if (!result.success) {
        setErrors(result.errors || { general: 'Une erreur est survenue' });
        return;
      }
      
      // Redirect to post edit page or posts list
      if (!isEditing && result.post) {
        router.push(`/dashboard/blog/${result.post.id}`);
      } else {
        router.push('/dashboard/blog');
      }
      
      router.refresh();
    } catch (error) {
      console.error('Error submitting post:', error);
      setErrors({ general: 'Une erreur est survenue lors de la soumission du formulaire' });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  // Handle category checkbox change
  function handleCategoryChange(categoryId: string, checked: boolean) {
    if (checked) {
      setSelectedCategories(prev => [...prev, categoryId]);
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  }
  
  // Handle tag checkbox change
  function handleTagChange(tagId: string, checked: boolean) {
    if (checked) {
      setSelectedTags(prev => [...prev, tagId]);
    } else {
      setSelectedTags(prev => prev.filter(id => id !== tagId));
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Modifier un article' : 'Nouvel article'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
              {errors.general}
            </div>
          )}
          
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Titre
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          
          {/* Slug */}
          <div className="space-y-2">
            <label htmlFor="slug" className="block text-sm font-medium">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${
                errors.slug ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
            )}
          </div>
          
          {/* Featured Image */}
          <div className="space-y-2">
            <label htmlFor="featured_image" className="block text-sm font-medium">
              Image à la une (URL)
            </label>
            <input
              type="text"
              id="featured_image"
              value={featuredImage}
              onChange={e => setFeaturedImage(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
            <p className="text-sm text-muted-foreground">
              Entrez l'URL de l'image ou utilisez la bibliothèque de médias
            </p>
          </div>
          
          {/* Excerpt */}
          <div className="space-y-2">
            <label htmlFor="excerpt" className="block text-sm font-medium">
              Extrait
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
            <p className="text-sm text-muted-foreground">
              Un court résumé de l'article. Laissez vide pour générer automatiquement.
            </p>
          </div>
          
          {/* Content - TipTap Editor */}
          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium">
              Contenu
            </label>
            <Editor 
              initialContent={content} 
              onChange={setContent} 
              error={!!errors.content}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>
          
          {/* Categories */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Catégories</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map(category => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onChange={e => handleCategoryChange(category.id, e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Tags</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {tags.map(tag => (
                <div key={tag.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    checked={selectedTags.includes(tag.id)}
                    onChange={e => handleTagChange(tag.id, e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`tag-${tag.id}`}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {tag.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Statut</label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="status-draft"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <label
                  htmlFor="status-draft"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Brouillon
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="status-published"
                  name="status"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <label
                  htmlFor="status-published"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Publié
                </label>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isSubmitting 
              ? 'Enregistrement...' 
              : isEditing 
                ? 'Mettre à jour' 
                : 'Créer'
            }
          </button>
        </CardFooter>
      </form>
    </Card>
  );
}
