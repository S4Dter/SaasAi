import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * Client Supabase avec accès administrateur pour les opérations privilégiées.
 * Ce client utilise la clé de service (service_role) qui contourne les politiques RLS.
 * À utiliser uniquement pour:
 * - Les fonctions de génération statique (generateStaticParams)
 * - Les opérations administratives qui nécessitent des droits élevés
 * - Les accès aux tables protégées pendant le build
 */
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * Récupère tous les posts publiés - Version admin
 * Cette fonction doit être utilisée spécifiquement lors de la génération statique
 */
export async function getPublishedPostSlugs() {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('slug')
    .eq('status', 'published');
    
  if (error) {
    console.error('Error fetching published posts:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Récupère toutes les catégories - Version admin
 * Cette fonction doit être utilisée spécifiquement lors de la génération statique
 */
export async function getCategorySlugs() {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('slug');
    
  if (error) {
    console.error('Error fetching category slugs:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Récupère tous les tags - Version admin
 * Cette fonction doit être utilisée spécifiquement lors de la génération statique
 */
export async function getTagSlugs() {
  const { data, error } = await supabaseAdmin
    .from('tags')
    .select('slug');
    
  if (error) {
    console.error('Error fetching tag slugs:', error);
    return [];
  }
  
  return data || [];
}
