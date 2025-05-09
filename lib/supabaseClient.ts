// @ts-nocheck
'use client';

import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// URL et clé d'API de Supabase (stockées dans les variables d'environnement)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Vérifier si les clés sont présentes (debugging)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(`
    ⚠️ Configuration Supabase manquante:
    - URL: ${supabaseUrl ? '✅' : '❌'}
    - Clé: ${supabaseAnonKey ? '✅' : '❌ (masquée)'}
  `);
}

// Création du client Supabase
import { SupabaseClient } from '@supabase/supabase-js';

// Par défaut, on crée un client null pour le côté serveur
let supabase: SupabaseClient<Database> | null = null;

// Création du client uniquement côté client
if (typeof window !== 'undefined') {
  try {
    const options = {
      auth: {
        persistSession: true,
        storageKey: 'sb-auth-token',
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    };
    
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, options);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Client Supabase créé côté client');
      
      // Vérifier si une session active est présente
      supabase.auth.getSession().then(({ data }) => {
        console.log('Session Supabase:', data.session ? '✅ Présente' : '❌ Absente');
      });
    }
  } catch (error) {
    console.error('Erreur lors de la création du client Supabase:', error);
    supabase = null;
  }
}

// Exporter le client
export { supabase };
