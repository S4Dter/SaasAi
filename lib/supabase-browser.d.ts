declare module '@/lib/supabase-browser' {
  import { SupabaseClient } from '@supabase/supabase-js';
  import type { Database } from '@/types/supabase';
  
  export const supabase: SupabaseClient<Database>;
  
  export function createBrowserSupabaseClient(): SupabaseClient<Database>;
}
