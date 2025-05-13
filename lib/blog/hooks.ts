'use client';

import { useCallback, useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Post, PostWithRelations, Category, Tag, Media, BlogFilters, PaginatedPosts } from '@/types/blog';
import { generateSlug } from './utils';

// ---------- POSTS HOOKS ----------

/**
 * Hook for fetching blog posts with pagination and filtering
 */
export function usePosts(initialFilters: BlogFilters = {}) {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BlogFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    count: 0,
    page: initialFilters.page || 1,
    pageSize: initialFilters.pageSize || 10,
    totalPages: 0
  });

  const fetchPosts = useCallback(async (newFilters?: BlogFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentFilters = newFilters || filters;
      
      // Start building query
      let query = supabase
        .from('posts')
        .select('*, author:author_id(id, email, full_name)');
      
      // Apply filters
      if (currentFilters.status) {
        query = query.eq('status', currentFilters.status);
      }
      
      if (currentFilters.authorId) {
        query = query.eq('author_id', currentFilters.authorId);
      }
      
      if (currentFilters.search) {
        query = query.or(`title.ilike.%${currentFilters.search}%,content.ilike.%${currentFilters.search}%`);
      }
      
      
      // Méthode correcte pour obtenir le count dans les versions récentes de Supabase
      // Solution de contournement pour les anciennes versions de Supabase
      const { data: countData, error: countError } = await query.select('id');
      const count = countData?.length || 0;

      if (countError) {
        throw new Error(countError.message);
      }
      
      // Apply pagination and ordering
      const page = currentFilters.page || 1;
      const pageSize = currentFilters.pageSize || 10;
      const orderBy = currentFilters.orderBy || 'created_at';
      const orderDirection = currentFilters.orderDirection || 'desc';
      
      query = query
        .order(orderBy, { ascending: orderDirection === 'asc' })
        .range((page - 1) * pageSize, page * pageSize - 1);
      
      // Execute query
      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data) {
        setPosts([]);
        setPagination({
          count: 0,
          page,
          pageSize,
          totalPages: 0
        });
        setLoading(false);
        return;
      }
      
      // Fetch categories and tags for each post
      const postsWithRelations: PostWithRelations[] = await Promise.all(
        data.map(async (post) => {
          // Get categories
          const { data: postCategories } = await supabase
            .from('post_categories')
            .select('category_id')
            .eq('post_id', post.id);
          
          const categoryIds = postCategories?.map(pc => pc.category_id) || [];
          
          let categories: Category[] = [];
          if (categoryIds.length > 0) {
            const { data: categoriesData } = await supabase
              .from('categories')
              .select('*')
              .in('id', categoryIds);
            categories = categoriesData || [];
          }
          
          // Get tags
          const { data: postTags } = await supabase
            .from('post_tags')
            .select('tag_id')
            .eq('post_id', post.id);
          
          const tagIds = postTags?.map(pt => pt.tag_id) || [];
          
          let tags: Tag[] = [];
          if (tagIds.length > 0) {
            const { data: tagsData } = await supabase
              .from('tags')
              .select('*')
              .in('id', tagIds);
            tags = tagsData || [];
          }
          
          return {
            ...post,
            categories,
            tags
          };
        })
      );
      
      // Apply category and tag filtering on the client
      let filteredPosts = postsWithRelations;
      
      if (currentFilters.categoryId) {
        filteredPosts = filteredPosts.filter(post => 
          post.categories?.some(cat => cat.id === currentFilters.categoryId)
        );
      }
      
      if (currentFilters.tagId) {
        filteredPosts = filteredPosts.filter(post => 
          post.tags?.some(tag => tag.id === currentFilters.tagId)
        );
      }
      
      setPosts(filteredPosts);
      setPagination({
        count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize)
      });
      
      if (newFilters) {
        setFilters(newFilters);
      }
    } catch (err: any) {
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePageChange = useCallback((newPage: number) => {
    fetchPosts({ ...filters, page: newPage });
  }, [fetchPosts, filters]);

  const handleFilterChange = useCallback((newFilters: BlogFilters) => {
    // Reset to page 1 when filters change
    fetchPosts({ ...newFilters, page: 1 });
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    filters,
    pagination,
    handlePageChange,
    handleFilterChange,
    refreshPosts: fetchPosts
  };
}

/**
 * Hook for fetching a single post
 */
export function usePost(postIdOrSlug: string, isSlug = false) {
  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('posts')
        .select('*, author:author_id(id, email, full_name)');
      
      if (isSlug) {
        query = query.eq('slug', postIdOrSlug);
      } else {
        query = query.eq('id', postIdOrSlug);
      }
      
      const { data, error } = await query.single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data) {
        setPost(null);
        return;
      }
      
      // Get categories
      const { data: postCategories } = await supabase
        .from('post_categories')
        .select('category_id')
        .eq('post_id', data.id);
      
      const categoryIds = postCategories?.map(pc => pc.category_id) || [];
      
      let categories: Category[] = [];
      if (categoryIds.length > 0) {
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .in('id', categoryIds);
        categories = categoriesData || [];
      }
      
      // Get tags
      const { data: postTags } = await supabase
        .from('post_tags')
        .select('tag_id')
        .eq('post_id', data.id);
      
      const tagIds = postTags?.map(pt => pt.tag_id) || [];
      
      let tags: Tag[] = [];
      if (tagIds.length > 0) {
        const { data: tagsData } = await supabase
          .from('tags')
          .select('*')
          .in('id', tagIds);
        tags = tagsData || [];
      }
      
      setPost({
        ...data,
        categories,
        tags
      });
    } catch (err: any) {
      setError(err.message);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [postIdOrSlug, isSlug]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return {
    post,
    loading,
    error,
    refreshPost: fetchPost
  };
}

/**
 * Hook for creating a new post
 */
export function useCreatePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newPost, setNewPost] = useState<Post | null>(null);

  const createPost = async (postData: Partial<Post>, categoryIds: string[] = [], tagIds: string[] = []) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Ensure we have the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Authentication required');
      }
      
      // Generate slug if not provided
      if (!postData.slug && postData.title) {
        postData.slug = generateSlug(postData.title);
      }
      
      // Set current timestamp
      const now = new Date().toISOString();
      
      // Prepare post data
      const post = {
        title: postData.title || '',
        slug: postData.slug || '',
        content: postData.content || '',
        excerpt: postData.excerpt || null,
        featured_image: postData.featured_image || null,
        status: postData.status || 'draft',
        author_id: user.id,
        created_at: now,
        updated_at: now,
        published_at: postData.status === 'published' ? now : null,
        view_count: 0
      };
      
      // Create post
      const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Add categories
      if (categoryIds.length > 0) {
        const categoryRelations = categoryIds.map(categoryId => ({
          post_id: data.id,
          category_id: categoryId
        }));
        
        const { error: categoryError } = await supabase
          .from('post_categories')
          .insert(categoryRelations);
        
        if (categoryError) {
          console.error('Error adding categories:', categoryError);
        }
      }
      
      // Add tags
      if (tagIds.length > 0) {
        const tagRelations = tagIds.map(tagId => ({
          post_id: data.id,
          tag_id: tagId
        }));
        
        const { error: tagError } = await supabase
          .from('post_tags')
          .insert(tagRelations);
        
        if (tagError) {
          console.error('Error adding tags:', tagError);
        }
      }
      
      setNewPost(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    createPost,
    loading,
    error,
    success,
    newPost
  };
}

/**
 * Hook for updating an existing post
 */
export function useUpdatePost(postId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [updatedPost, setUpdatedPost] = useState<Post | null>(null);

  const updatePost = async (postData: Partial<Post>, categoryIds: string[] = [], tagIds: string[] = []) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Generate slug if not provided but title is changed
      if (!postData.slug && postData.title) {
        postData.slug = generateSlug(postData.title);
      }
      
      // Set updated timestamp
      postData.updated_at = new Date().toISOString();
      
      // Check if status is changing to published
      if (postData.status === 'published') {
        // Get current post
        const { data: currentPost } = await supabase
          .from('posts')
          .select('status, published_at')
          .eq('id', postId)
          .single();
        
        // If transitioning from draft to published, set published_at
        if (currentPost && currentPost.status !== 'published') {
          postData.published_at = new Date().toISOString();
        }
      }
      
      // Update post
      const { data, error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', postId)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update categories - first delete existing
      await supabase
        .from('post_categories')
        .delete()
        .eq('post_id', postId);
      
      // Then add new categories
      if (categoryIds.length > 0) {
        const categoryRelations = categoryIds.map(categoryId => ({
          post_id: postId,
          category_id: categoryId
        }));
        
        await supabase
          .from('post_categories')
          .insert(categoryRelations);
      }
      
      // Update tags - first delete existing
      await supabase
        .from('post_tags')
        .delete()
        .eq('post_id', postId);
      
      // Then add new tags
      if (tagIds.length > 0) {
        const tagRelations = tagIds.map(tagId => ({
          post_id: postId,
          tag_id: tagId
        }));
        
        await supabase
          .from('post_tags')
          .insert(tagRelations);
      }
      
      setUpdatedPost(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    updatePost,
    loading,
    error,
    success,
    updatedPost
  };
}

/**
 * Hook for deleting a post
 */
export function useDeletePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deletePost = async (postId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Delete categories and tags relations first
      await supabase
        .from('post_categories')
        .delete()
        .eq('post_id', postId);
      
      await supabase
        .from('post_tags')
        .delete()
        .eq('post_id', postId);
      
      // Delete the post
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    deletePost,
    loading,
    error,
    success
  };
}

/**
 * Hook for changing post status (publish/unpublish)
 */
export function usePostStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateStatus = async (postId: string, status: 'draft' | 'published') => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };
      
      // If publishing
      if (status === 'published') {
        // Check if already has a published date
        const { data: currentPost } = await supabase
          .from('posts')
          .select('published_at')
          .eq('id', postId)
          .single();
        
        // Only set published_at if it's not already set
        if (!currentPost?.published_at) {
          updateData.published_at = new Date().toISOString();
        }
      }
      
      const { error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', postId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateStatus,
    loading,
    error,
    success
  };
}

// ---------- CATEGORIES HOOKS ----------

/**
 * Hook for fetching all categories
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        throw new Error(error.message);
      }
      
      setCategories(data || []);
    } catch (err: any) {
      setError(err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refreshCategories: fetchCategories
  };
}

/**
 * Hook for managing categories (create, update, delete)
 */
export function useCategoryManager() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createCategory = async (name: string, description: string = '', slug?: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Generate slug if not provided
      if (!slug) {
        slug = generateSlug(name);
      }
      
      const { error } = await supabase
        .from('categories')
        .insert({
          name,
          description,
          slug,
          created_at: new Date().toISOString()
        });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (categoryId: string, name: string, description: string = '', slug?: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Generate slug if not provided
      if (!slug) {
        slug = generateSlug(name);
      }
      
      const { error } = await supabase
        .from('categories')
        .update({
          name,
          description,
          slug
        })
        .eq('id', categoryId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Remove all post relations first
      await supabase
        .from('post_categories')
        .delete()
        .eq('category_id', categoryId);
      
      // Delete the category
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    loading,
    error,
    success
  };
}

// ---------- TAGS HOOKS ----------

/**
 * Hook for fetching all tags
 */
export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');
      
      if (error) {
        throw new Error(error.message);
      }
      
      setTags(data || []);
    } catch (err: any) {
      setError(err.message);
      setTags([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    loading,
    error,
    refreshTags: fetchTags
  };
}

/**
 * Hook for managing tags (create, update, delete)
 */
export function useTagManager() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createTag = async (name: string, slug?: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Generate slug if not provided
      if (!slug) {
        slug = generateSlug(name);
      }
      
      const { error } = await supabase
        .from('tags')
        .insert({
          name,
          slug,
          created_at: new Date().toISOString()
        });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTag = async (tagId: string, name: string, slug?: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Generate slug if not provided
      if (!slug) {
        slug = generateSlug(name);
      }
      
      const { error } = await supabase
        .from('tags')
        .update({
          name,
          slug
        })
        .eq('id', tagId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTag = async (tagId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Remove all post relations first
      await supabase
        .from('post_tags')
        .delete()
        .eq('tag_id', tagId);
      
      // Delete the tag
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    createTag,
    updateTag,
    deleteTag,
    loading,
    error,
    success
  };
}

// ---------- MEDIA HOOKS ----------

/**
 * Hook for fetching all media files
 */
export function useMedia() {
  const [mediaFiles, setMediaFiles] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setMediaFiles(data || []);
    } catch (err: any) {
      setError(err.message);
      setMediaFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return {
    mediaFiles,
    loading,
    error,
    refreshMedia: fetchMedia
  };
}

/**
 * Hook for uploading media files
 */
export function useMediaUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaId, setMediaId] = useState<string | null>(null);

  const uploadMedia = async (file: File) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setMediaUrl(null);
    setMediaId(null);
    
    try {
      // Ensure we have the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Authentication required');
      }
      
      // Generate a unique file name
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '-')}`;
      
      // Upload to storage
      // Version corrigée pour l'upload de fichiers
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('blog_media')
        .upload(fileName, file, {
          // L'option onUploadProgress n'est pas disponible directement dans l'API de Supabase Storage
          // Nous utilisons uniquement les options standards supportées
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('blog_media')
        .getPublicUrl(fileName);
      
      // Save media metadata to database
      const { data: media, error: mediaError } = await supabase
        .from('media')
        .insert({
          file_name: fileName,
          file_type: file.type,
          file_size: file.size,
          url: publicUrl,
          uploaded_by: user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (mediaError) {
        throw new Error(mediaError.message);
      }
      
      setMediaUrl(publicUrl);
      setMediaId(media.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadMedia,
    loading,
    error,
    progress,
    mediaUrl,
    mediaId
  };
}

/**
 * Hook for deleting media files
 */
export function useDeleteMedia() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteMedia = async (mediaId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Get media info
      const { data: media, error: fetchError } = await supabase
        .from('media')
        .select('file_name')
        .eq('id', mediaId)
        .single();
      
      if (fetchError || !media) {
        throw new Error(fetchError?.message || 'Media not found');
      }
      
      // Delete from storage
      const { error: storageError } = await supabase
        .storage
        .from('blog_media')
        .remove([media.file_name]);
      
      if (storageError) {
        console.error('Error deleting from storage:', storageError);
        // Continue to delete from database even if storage delete fails
      }
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', mediaId);
      
      if (dbError) {
        throw new Error(dbError.message);
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteMedia,
    loading,
    error,
    success
  };
}

// ---------- SEARCH HOOKS ----------

/**
 * Hook for searching posts
 */
export function useSearchPosts() {
  const [results, setResults] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  });

  const searchPosts = async (query: string, page = 1, pageSize = 10) => {
    if (!query.trim()) {
      setResults([]);
      setPagination({
        count: 0,
        page,
        pageSize,
        totalPages: 0
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Search in titles and content
      const searchQuery = `%${query}%`;
      
      // Get count first
      const countResult = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')
        .or(`title.ilike.${searchQuery},content.ilike.${searchQuery}`);

      
      
      const totalCount = countResult.count || 0;
      
      // Then get paginated results
      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*, author:author_id(id, email, full_name)')
        .eq('status', 'published')
        .or(`title.ilike.${searchQuery},content.ilike.${searchQuery}`)
        .order('published_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!postsData || postsData.length === 0) {
        setResults([]);
        setPagination({
          count: 0,
          page,
          pageSize,
          totalPages: 0
        });
        return;
      }
      
      // Fetch categories and tags for each post
      const postsWithRelations = await Promise.all(
        postsData.map(async (post) => {
          // Get categories
          const { data: postCategories } = await supabase
            .from('post_categories')
            .select('category_id')
            .eq('post_id', post.id);
          
          const categoryIds = postCategories?.map(pc => pc.category_id) || [];
          
          let categories: Category[] = [];
          if (categoryIds.length > 0) {
            const { data: categoriesData } = await supabase
              .from('categories')
              .select('*')
              .in('id', categoryIds);
            categories = categoriesData || [];
          }
          
          // Get tags
          const { data: postTags } = await supabase
            .from('post_tags')
            .select('tag_id')
            .eq('post_id', post.id);
          
          const tagIds = postTags?.map(pt => pt.tag_id) || [];
          
          let tags: Tag[] = [];
          if (tagIds.length > 0) {
            const { data: tagsData } = await supabase
              .from('tags')
              .select('*')
              .in('id', tagIds);
            tags = tagsData || [];
          }
          
          return {
            ...post,
            categories,
            tags
          };
        })
      );
      
      setResults(postsWithRelations);
      setPagination({
        count: totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize)
      });
    } catch (err: any) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    pagination,
    searchPosts
  };
}

/**
 * Hook for tracking post views
 */
export function useTrackPostView() {
  const incrementViewCount = async (postId: string) => {
    try {
      // Get current view count
      const { data } = await supabase
        .from('posts')
        .select('view_count')
        .eq('id', postId)
        .single();
      
      if (!data) return;
      
      // Increment view count
      const newCount = (data.view_count || 0) + 1;
      
      await supabase
        .from('posts')
        .update({ view_count: newCount })
        .eq('id', postId);
    } catch (error) {
      console.error('Error tracking post view:', error);
    }
  };

  return { incrementViewCount };
}

/**
 * Hook for fetching popular posts
 */
export function usePopularPosts(limit = 5) {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPopularPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, author:author_id(id, email, full_name)')
        .eq('status', 'published')
        .order('view_count', { ascending: false })
        .limit(limit);
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data || data.length === 0) {
        setPosts([]);
        return;
      }
      
      // Fetch categories for each post
      const postsWithCategories = await Promise.all(
        data.map(async (post) => {
          const { data: postCategories } = await supabase
            .from('post_categories')
            .select('category_id')
            .eq('post_id', post.id);
          
          const categoryIds = postCategories?.map(pc => pc.category_id) || [];
          
          let categories: Category[] = [];
          if (categoryIds.length > 0) {
            const { data: categoriesData } = await supabase
              .from('categories')
              .select('*')
              .in('id', categoryIds);
            categories = categoriesData || [];
          }
          
          return {
            ...post,
            categories,
            tags: [] // We don't need tags for popular posts sidebar
          };
        })
      );
      
      setPosts(postsWithCategories);
    } catch (err: any) {
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchPopularPosts();
  }, [fetchPopularPosts]);

  return {
    posts,
    loading,
    error,
    refreshPopularPosts: fetchPopularPosts
  };
}

export default {
  usePosts,
  usePost,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  usePostStatus,
  useCategories,
  useCategoryManager,
  useTags,
  useTagManager,
  useMedia,
  useMediaUpload,
  useDeleteMedia,
  useSearchPosts,
  useTrackPostView,
  usePopularPosts
};
