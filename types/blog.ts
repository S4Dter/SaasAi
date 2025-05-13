export type PostStatus = 'draft' | 'published';

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

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface PostWithRelations extends Post {
  categories?: Category[];
  tags?: Tag[];
  author?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export interface Media {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  url: string;
  created_at: string;
  uploaded_by: string;
}

export interface PaginatedPosts {
  data: PostWithRelations[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

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
