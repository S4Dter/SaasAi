import { createClient } from '@supabase/supabase-js';

// Vérifier si on est côté client
const isBrowser = typeof window !== 'undefined';

// Créez un client null/mock pour SSR initial
let supabase: ReturnType<typeof createClient> | null = null;

// Initialiser Supabase uniquement côté client
if (isBrowser) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
}

// Export une version sécurisée qui ne sera jamais null côté client
export { supabase };
