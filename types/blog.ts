/**
 * Blog System Type Definitions
 */

// Post status type
export type PostStatus = 'draft' | 'published';

// Base Post type
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  status: PostStatus;
  view_count: number;
  author_id: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

// Author information
export interface Author {
  id: string;
  email?: string;
  full_name?: string;
}

// Category type
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

// Tag type
export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

// Media type
export interface Media {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  url: string;
  uploaded_by: string;
  created_at: string;
}

// Post with its relations (categories, tags)
export interface PostWithRelations extends Post {
  author?: Author;
  categories?: Category[];
  tags?: Tag[];
}

// Filters for querying posts
export interface BlogFilters {
  status?: PostStatus;
  categoryId?: string;
  tagId?: string;
  search?: string;
  authorId?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// Pagination information for posts
export interface PaginatedPosts {
  data: PostWithRelations[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Post form submission data
export interface PostFormData {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: PostStatus;
  slug?: string;
  category_ids: string[];
  tag_ids: string[];
}

// Category form submission data
export interface CategoryFormData {
  name: string;
  description?: string;
  slug?: string;
}

// Tag form submission data
export interface TagFormData {
  name: string;
  slug?: string;
}
