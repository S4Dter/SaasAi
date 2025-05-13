import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { createServerSupabaseClient, supabaseAdmin as serverAdmin } from '../supabase-server';
import { supabaseAdmin as clientAdmin } from '../supabase-client-admin';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with cookies
export function getServerSupabaseClient() {
  return createServerSupabaseClient();
}

// Admin Supabase client (with service role key) - use server version for server components and client version for client components
export const supabaseAdmin = typeof window === 'undefined' ? serverAdmin : clientAdmin;

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
