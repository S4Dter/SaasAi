// lib/blog/supabase.ts - VERSION CLIENT UNIQUEMENT
'use client';

import { Database } from '@/types/supabase';
import { supabase as browserClient, createBrowserSupabaseClient } from '../supabase-browser';
import { supabaseAdmin as clientAdmin } from '../supabase-client-admin';

// Client-side Supabase client
export const supabase = browserClient;

// Admin Supabase client (client version only)
export const supabaseAdmin = clientAdmin;

// Helper function to check if user has admin permission for the blog
export async function isUserBlogAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }
  
  // Fetch user's role from the database
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  // Check if the user has admin or content_creator role
  return data?.role === 'admin' || data?.role === 'content_creator';
}

// Helper function to get current user profile
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }
  
  // Fetch user profile
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return data;
}
