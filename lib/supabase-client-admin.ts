import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * Client Supabase avec accès administrateur
 * À utiliser uniquement pour les opérations admin qui nécessitent des droits élevés
 * Version compatible avec les composants client (n'utilise pas cookies de next/headers)
 */
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);
