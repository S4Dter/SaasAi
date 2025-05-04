import { createClient } from '@supabase/supabase-js';

// Vérifier si on est côté client
const isBrowser = typeof window !== 'undefined';

// Configuration Supabase
const SUPABASE_TIMEOUT = 5000; // 5 secondes de timeout

// Fonction pour créer le client Supabase
function createSupabaseClient() {
  // En mode SSR/SSG, on retourne un mock du client
  if (!isBrowser) {
    return createMockClient();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Variables d\'environnement Supabase manquantes');
    return createMockClient();
  }
  
  // Créer et retourner le vrai client Supabase avec timeout global
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      fetch: (url, options) => {
        const controller = new AbortController();
        const { signal } = controller;
        
        // Ajout du timeout
        const timeoutId = setTimeout(() => controller.abort(), SUPABASE_TIMEOUT);
        
        return fetch(url, { ...options, signal })
          .finally(() => clearTimeout(timeoutId));
      }
    },
  });
}

// Crée un client mock avec des méthodes no-op pour SSR
function createMockClient() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: new Error('Client SSR mock') }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ 
        data: { subscription: { unsubscribe: () => {} } }, 
        error: null 
      }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: new Error('Client SSR mock') }),
        }),
      }),
    }),
  } as any;
}

// Créer une instance du client
const supabase = createSupabaseClient();

// Exporter l'instance
export { supabase };
