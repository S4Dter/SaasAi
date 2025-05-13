'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSupabaseClient, supabaseAdmin } from './supabase-server-utils';
import { generateSlug, createExcerpt, validatePostFields } from './utils';
import { Post, Category, Tag, Media, BlogFilters, PaginatedPosts, PostWithRelations } from '@/types/blog';

// ----------- POST ACTIONS -----------

/**
 * Creates a new blog post
 */
export async function createPost(formData: FormData) {
  const supabase = await getServerSupabaseClient();
  
  // Get the authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  
  // Get form values
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string || createExcerpt(content);
  const featuredImage = formData.get('featured_image') as string;
  const status = formData.get('status') as string || 'draft';
  const slug = formData.get('slug') as string || generateSlug(title);
  
  // Get categories and tags
  const categoryIds = formData.getAll('category_ids') as string[];
  const tagIds = formData.getAll('tag_ids') as string[];
  
  // Validate
  const validation = validatePostFields({ title, content, slug });
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }
  
  // Current date
  const now = new Date().toISOString();
  
  // Create post
  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      title,
      slug,
      content,
      excerpt,
      featured_image: featuredImage,
      status,
      author_id: user.id,
      created_at: now,
      updated_at: now,
      published_at: status === 'published' ? now : null,
      view_count: 0
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating post:', error);
    return { success: false, errors: { server: error.message } };
  }
  
  // Add categories
  if (categoryIds.length > 0) {
    const categoryRelations = categoryIds.map(categoryId => ({
      post_id: post.id,
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
      post_id: post.id,
      tag_id: tagId
    }));
    
    const { error: tagError } = await supabase
      .from('post_tags')
      .insert(tagRelations);
    
    if (tagError) {
      console.error('Error adding tags:', tagError);
    }
  }
  
  revalidatePath('/blog');
  revalidatePath('/dashboard/blog');
  
  return { success: true, post };
}

/**
 * Updates an existing blog post
 */
export async function updatePost(postId: string, formData: FormData) {
  const supabase = await getServerSupabaseClient();
  
  // Get the authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  
  // Get form values
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string || createExcerpt(content);
  const featuredImage = formData.get('featured_image') as string;
  const status = formData.get('status') as string;
  const slug = formData.get('slug') as string || generateSlug(title);
  
  // Get categories and tags
  const categoryIds = formData.getAll('category_ids') as string[];
  const tagIds = formData.getAll('tag_ids') as string[];
  
  // Validate
  const validation = validatePostFields({ title, content, slug });
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }
  
  // Get current post to check if status changed
  const { data: currentPost } = await supabase
    .from('posts')
    .select('status')
    .eq('id', postId)
    .single();
  
  // Prepare updated data
  type UpdateData = {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featured_image: string | null;
    status: string;
    updated_at: string;
    published_at?: string | null;
  };
  
  const updateData: UpdateData = {
    title,
    slug,
    content,
    excerpt,
    featured_image: featuredImage,
    status,
    updated_at: new Date().toISOString(),
  };
  
  // If publishing for the first time
  if (currentPost && currentPost.status !== 'published' && status === 'published') {
    updateData.published_at = new Date().toISOString();
  }
  
  // Update post
  const { data: post, error } = await supabase
    .from('posts')
    .update(updateData)
    .eq('id', postId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating post:', error);
    return { success: false, errors: { server: error.message } };
  }
  
  // Update categories - first delete all existing
  await supabase
    .from('post_categories')
    .delete()
    .eq('post_id', postId);
  
  // Then add new categories
  if (categoryIds.length > 0) {
    const categoryRelations = categoryIds.map(categoryId => ({
      post_id: post.id,
      category_id: categoryId
    }));
    
    await supabase
      .from('post_categories')
      .insert(categoryRelations);
  }
  
  // Update tags - first delete all existing
  await supabase
    .from('post_tags')
    .delete()
    .eq('post_id', postId);
  
  // Then add new tags
  if (tagIds.length > 0) {
    const tagRelations = tagIds.map(tagId => ({
      post_id: post.id,
      tag_id: tagId
    }));
    
    await supabase
      .from('post_tags')
      .insert(tagRelations);
  }
  
  revalidatePath('/blog');
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath('/dashboard/blog');
  revalidatePath(`/dashboard/blog/${post.id}`);
  
  return { success: true, post };
}

/**
 * Deletes a blog post
 */
export async function deletePost(postId: string) {
  const supabase = await getServerSupabaseClient();
  
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
    console.error('Error deleting post:', error);
    return { success: false, error: error.message };
  }
  
  revalidatePath('/blog');
  revalidatePath('/dashboard/blog');
  
  return { success: true };
}

/**
 * Updates post status (publish/unpublish)
 */
export async function updatePostStatus(postId: string, status: 'draft' | 'published') {
  const supabase = await getServerSupabaseClient();
  
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
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
  
  const { data, error } = await supabase
    .from('posts')
    .update(updateData)
    .eq('id', postId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating post status:', error);
    return { success: false, error: error.message };
  }
  
  revalidatePath('/blog');
  revalidatePath(`/blog/${data.slug}`);
  revalidatePath('/dashboard/blog');
  
  return { success: true, post: data };
}

/**
 * Fetches posts with pagination, filtering and sorting
 */
export async function getPosts(filters: BlogFilters = {}): Promise<PaginatedPosts> {
  const supabase = await getServerSupabaseClient();
  
  // Default values
  const {
    status,
    categoryId,
    tagId,
    search,
    authorId,
    page = 1,
    pageSize = 10,
    orderBy = 'created_at',
    orderDirection = 'desc'
  } = filters;
  
  // Start building query
  let query = supabase
    .from('posts')
    .select('*, author:author_id(id, email, full_name)');
  
  // Apply filters
  if (status) {
    query = query.eq('status', status);
  }
  
  if (authorId) {
    query = query.eq('author_id', authorId);
  }
  
  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }
  
  // Get count before pagination
  let count = 0;
  let countError = null;
  
  try {
    // @ts-ignore - Supabase types are not up to date
    const { count: countResult, error } = await query.count();
    count = countResult || 0;
    countError = error;
  } catch (error) {
    console.error('Error counting posts:', error);
    throw new Error('Failed to fetch posts');
  }
  
  if (countError) {
    console.error('Error counting posts:', countError);
    throw new Error('Failed to fetch posts');
  }
  
  
  // Apply pagination and ordering
  query = query
    .order(orderBy, { ascending: orderDirection === 'asc' })
    .range((page - 1) * pageSize, page * pageSize - 1);
  
  // Execute query
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
  
  // Fetch categories and tags for each post
  const postsWithRelations: PostWithRelations[] = await Promise.all(
    data.map(async (post: Post) => {
      // Get categories for this post
      const { data: postCategories } = await supabase
        .from('post_categories')
        .select('category_id')
        .eq('post_id', post.id);
      
      const categoryIds = postCategories?.map((pc: {category_id: string}) => pc.category_id) || [];
      
      let categories: Category[] = [];
      if (categoryIds.length > 0) {
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .in('id', categoryIds);
        categories = categoriesData || [];
      }
      
      // Get tags for this post
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
        categories: categories,
        tags: tags
      };
    })
  );
  
  // Filter by category if specified
  const filteredPosts = categoryId 
    ? postsWithRelations.filter(post => 
        post.categories?.some(cat => cat.id === categoryId)
      )
    : postsWithRelations;
  
  // Filter by tag if specified
  const finalFilteredPosts = tagId
    ? filteredPosts.filter(post => 
        post.tags?.some(tag => tag.id === tagId)
      )
    : filteredPosts;
  
  // Calculate total pages
  const totalPages = Math.ceil(count / pageSize);
  
  return {
    data: finalFilteredPosts,
    count,
    page,
    pageSize,
    totalPages
  };
}

/**
 * Fetches a single post by ID with related data
 */
export async function getPostById(id: string): Promise<PostWithRelations | null> {
  const supabase = await getServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:author_id(id, email, full_name)')
    .eq('id', id)
    .single();
  
  if (error || !data) {
    console.error('Error fetching post:', error);
    return null;
  }
  
  // Get categories for this post
  const { data: postCategories } = await supabase
    .from('post_categories')
    .select('category_id')
    .eq('post_id', data.id);
  
  const categoryIds = postCategories?.map((pc: {category_id: string}) => pc.category_id) || [];
  
  let categories: Category[] = [];
  if (categoryIds.length > 0) {
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .in('id', categoryIds);
    categories = categoriesData || [];
  }
  
  // Get tags for this post
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
  
  return {
    ...data,
    categories: categories || [],
    tags: tags || []
  };
}

/**
 * Fetches a single post by slug with related data
 */
export async function getPostBySlug(slug: string): Promise<PostWithRelations | null> {
  const supabase = await getServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:author_id(id, email, full_name)')
    .eq('slug', slug)
    .single();
  
  if (error || !data) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
  
  // Increment view count
  await supabase
    .from('posts')
    .update({ view_count: data.view_count + 1 })
    .eq('id', data.id);
  
  // Get categories for this post
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
  
  // Get tags for this post
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
  
  return {
    ...data,
    view_count: data.view_count + 1, // Update the view count in the returned data
    categories: categories || [],
    tags: tags || []
  };
}

// ----------- CATEGORY ACTIONS -----------

/**
 * Creates a new category
 */
export async function createCategory(formData: FormData) {
  const supabase = await getServerSupabaseClient();
  
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const slug = formData.get('slug') as string || generateSlug(name);
  
  if (!name) {
    return { success: false, error: 'Name is required' };
  }
  
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name,
      description,
      slug,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating category:', error);
    return { success: false, error: error.message };
  }
  
  revalidatePath('/dashboard/blog/categories');
  
  return { success: true, category: data };
}

/**
 * Updates a category
 */
export async function updateCategory(categoryId: string, formData: FormData) {
  const supabase = await getServerSupabaseClient();
  
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const slug = formData.get('slug') as string || generateSlug(name);
  
  if (!name) {
    return { success: false, error: 'Name is required' };
  }
  
  const { data, error } = await supabase
    .from('categories')
    .update({
      name,
      description,
      slug
    })
    .eq('id', categoryId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating category:', error);
    return { success: false, error: error.message };
  }
  
  revalidatePath('/dashboard/blog/categories');
  revalidatePath('/blog/category');
  
  return { success: true, category: data };
}

/**
 * Deletes a category
 */
export async function deleteCategory(categoryId: string) {
  const supabase = await getServerSupabaseClient();
  
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
    console.error('Error deleting category:', error);
    return { success: false, error: error.message };
  }
  
  revalidatePath('/dashboard/blog/categories');
  revalidatePath('/blog/category');
  
  return { success: true };
}

/**
 * Gets all categories
 */
export async function getAllCategories() {
  const supabase = await getServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
  
  return data || [];
}

/**
 * Gets a category by slug
 */
export async function getCategoryBySlug(slug: string) {
  const supabase = await getServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error || !data) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
  
  return data;
}

// ----------- TAG ACTIONS -----------

/**
 * Creates a new tag
 */
export async function createTag(formData: FormData) {
  const supabase = await getServerSupabaseClient();
  
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string || generateSlug(name);
  
  if (!name) {
    return { success: false, error: 'Name is required' };
  }
  
  const { data, error } = await supabase
    .from('tags')
    .insert({
      name,
      slug,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating tag:', error);
    return { success: false, error: error.message };
  }
  
  revalidatePath('/dashboard/blog/tags');
  
  return { success: true, tag: data };
}

/**
 * Updates a tag
 */
export async function updateTag(tagId: string, formData: FormData) {
  const supabase = await getServerSupabaseClient();
  
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string || generateSlug(name);
  
  if (!name) {
    return { success: false, error: 'Name is required' };
  }
  
  const { data, error } = await supabase
    .from('tags')
    .update({
      name,
      slug
    })
    .eq('id', tagId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating tag:', error);
    return { success: false, error: error.message };
  }
  
  revalidatePath('/dashboard/blog/tags');
  revalidatePath('/blog/tag');
  
  return { success: true, tag: data };
}

/**
 * Deletes a tag
 */
export async function deleteTag(tagId: string) {
  const supabase = await getServerSupabaseClient();
  
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
    console.error('Error deleting tag:', error);
    return { success: false, error: error.message };
  }
  
  revalidatePath('/dashboard/blog/tags');
  revalidatePath('/blog/tag');
  
  return { success: true };
}

/**
 * Gets all tags
 */
export async function getAllTags() {
  const supabase = await getServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching tags:', error);
    throw new Error('Failed to fetch tags');
  }
  
  return data || [];
}

/**
 * Gets a tag by slug
 */
export async function getTagBySlug(slug: string) {
  const supabase = await getServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error || !data) {
    console.error('Error fetching tag by slug:', error);
    return null;
  }
  
  return data;
}

// ----------- MEDIA ACTIONS -----------

/**
 * Uploads a media file to Supabase storage
 */
export async function uploadMedia(formData: FormData) {
  const supabase = await getServerSupabaseClient();
  
  // Get the authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  
  const file = formData.get('file') as File;
  
  if (!file) {
    return { success: false, error: 'No file provided' };
  }
  
  // Generate a unique file name
  const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '-')}`;
  
  // Upload to storage
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('blog_media')
    .upload(fileName, file);
  
  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    return { success: false, error: uploadError.message };
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
    console.error('Error saving media metadata:', mediaError);
    return { success: false, error: mediaError.message };
  }
  
  revalidatePath('/dashboard/blog/media');
  
  return { success: true, media };
}

/**
 * Deletes a media file
 */
export async function deleteMedia(mediaId: string) {
  const supabase = await getServerSupabaseClient();
  
  // Get media info
  const { data: media, error: fetchError } = await supabase
    .from('media')
    .select('file_name')
    .eq('id', mediaId)
    .single();
  
  if (fetchError || !media) {
    console.error('Error fetching media:', fetchError);
    return { success: false, error: fetchError?.message || 'Media not found' };
  }
  
  // Delete from storage
  const { error: storageError } = await supabase
    .storage
    .from('blog_media')
    .remove([media.file_name]);
  
  if (storageError) {
    console.error('Error deleting from storage:', storageError);
  }
  
  // Delete from database
  const { error: dbError } = await supabase
    .from('media')
    .delete()
    .eq('id', mediaId);
  
  if (dbError) {
    console.error('Error deleting media from database:', dbError);
    return { success: false, error: dbError.message };
  }
  
  revalidatePath('/dashboard/blog/media');
  
  return { success: true };
}

/**
 * Gets all media files
 */
export async function getAllMedia() {
  const supabase = await getServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching media:', error);
    throw new Error('Failed to fetch media');
  }
  
  return data || [];
}

/**
 * Searches for posts (used by public blog search)
 */
export async function searchPosts(query: string, page = 1, pageSize = 10) {
  const supabase = await getServerSupabaseClient();
  
  // Search only in published posts
  let searchQuery = supabase
    .from('posts')
    .select('*, author:author_id(id, email, full_name)')
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`);
  
  // Get count
  let totalCount = 0;
  let countError = null;
  
  try {
    // @ts-ignore - Supabase types are not up to date
    const { count: countResult, error } = await searchQuery.count();
    totalCount = countResult || 0;
    countError = error;
  } catch (error) {
    console.error('Error counting search results:', error);
    throw new Error('Failed to search posts');
  }
  
  if (countError) {
    console.error('Error counting search results:', countError);
    throw new Error('Failed to search posts');
  }
  
  // Apply pagination
  searchQuery = searchQuery
    .order('published_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  
  // Execute query
  const { data, error } = await searchQuery;
  
  if (error) {
    console.error('Error searching posts:', error);
    throw new Error('Failed to search posts');
  }
  
  // Fetch categories and tags for each post
  const postsWithRelations = await Promise.all(
    data.map(async (post: Post) => {
      // Get categories for this post
      const { data: postCategories } = await supabase
        .from('post_categories')
        .select('category_id')
        .eq('post_id', post.id);
      
      const categoryIds = postCategories?.map((pc: {category_id: string}) => pc.category_id) || [];
      
      let categories: Category[] = [];
      if (categoryIds.length > 0) {
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .in('id', categoryIds);
        categories = categoriesData || [];
      }
      
      // Get tags for this post
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
        categories: categories || [],
        tags: tags || []
      };
    })
  );
  
  return {
    data: postsWithRelations,
    count: totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize)
  };
}
