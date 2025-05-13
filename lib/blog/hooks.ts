"use client";

import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { Category, Tag, PaginatedPosts } from "@/types/blog";
import { getAllCategories, getAllTags, getPosts } from "./actions";

/**
 * Custom hook to fetch and manage categories for blog
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getAllCategories();
        setCategories(data);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("Failed to fetch categories"));
        console.error("Error fetching categories:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

/**
 * Custom hook to fetch and manage tags for blog
 */
export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const data = await getAllTags();
        setTags(data);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("Failed to fetch tags"));
        console.error("Error fetching tags:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tags, loading, error };
}

/**
 * Custom hook to fetch and manage posts with filters and pagination
 */
export function useBlogPosts(options: {
  status?: "published" | "draft";
  categoryId?: string;
  tagId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}) {
  const [postsData, setPostsData] = useState<PaginatedPosts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    status = "published",
    categoryId,
    tagId,
    search,
    page = 1,
    pageSize = 10,
    orderBy = "published_at",
    orderDirection = "desc",
  } = options;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts({
          status,
          categoryId,
          tagId,
          search,
          page,
          pageSize,
          orderBy,
          orderDirection,
        });
        setPostsData(data);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("Failed to fetch posts"));
        console.error("Error fetching posts:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [status, categoryId, tagId, search, page, pageSize, orderBy, orderDirection]);

  return {
    posts: postsData?.data || [],
    count: postsData?.count || 0,
    totalPages: postsData?.totalPages || 0,
    currentPage: postsData?.page || page,
    loading,
    error,
  };
}

/**
 * Custom hook to check if the current user is admin
 */
export function useBlogAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          setIsAdmin(false);
          return;
        }
        
        // Check if user has admin role
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
          
        setIsAdmin(userData?.role === 'admin' || userData?.role === 'content_creator');
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdmin();
  }, []);

  return { isAdmin, loading };
}
