// lib/blog/supabase-server-utils.ts
import { Database } from '@/types/supabase';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '../supabase-server';

// Server-side Supabase client with cookies
// Only call this function within a Request context (Server Action or Server Component)
export function getServerSupabaseClient() {
  try {
    return createServerComponentClient<Database>({ 
      cookies 
    });
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    // In static generation contexts, use the admin client instead as a fallback
    return supabaseAdmin;
  }
}

// Admin Supabase client (server version)
export { supabaseAdmin };

// Interface pour les utilisateurs
export interface ServerUser {
  id: string;
  email: string;
  role?: string;
  name?: string;
  avatar?: string;
  company?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

// Versions serveur des fonctions helpers (pour les Server Components)
export async function isUserBlogAdminServer(): Promise<boolean> {
  const supabase = getServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }
  
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  return data?.role === 'admin' || data?.role === 'content_creator';
}

export async function getCurrentUserServer(): Promise<ServerUser | null> {
  const supabase = getServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }
  
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return data as ServerUser | null;
}
