// @ts-nocheck
'use client';

import { createClient } from '@supabase/supabase-js';
// Utilisation de any pour éviter les erreurs TypeScript temporairement
// import { Database } from '../types/supabase';
type Database = any;

// URL et clé d'API de Supabase (stockées dans les variables d'environnement)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://votre-projet.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Vérifier si les clés sont présentes (debugging)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(`
    ⚠️ Configuration Supabase manquante:
    - URL: ${supabaseUrl ? '✅' : '❌'}
    - Clé: ${supabaseAnonKey ? '✅' : '❌ (masquée)'}
  `);
}

// Logs en mode développement
if (process.env.NODE_ENV === 'development') {
  console.log('Initialisation du client Supabase avec URL:', supabaseUrl);
}

// Création du client Supabase
import { SupabaseClient } from '@supabase/supabase-js';
let supabase: SupabaseClient<Database> | null = null;

// Wrapper dans un try/catch pour éviter les erreurs fatales
try {
  // En environnement client uniquement
  if (typeof window !== 'undefined') {
    console.log('Création du client Supabase (côté client)');
    
    // Vérifier si les clés sont présentes avant de créer le client
    if (supabaseUrl && supabaseAnonKey) {
      // Options de persistance renforcées pour éviter les problèmes de session
      const options = {
        auth: {
          persistSession: true,
          storageKey: 'sb-auth-token',
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: {
            getItem: (key) => {
              try {
                const item = localStorage.getItem(key);
                console.log(`Lecture depuis localStorage (${key}):`, item ? '✅ Trouvé' : '❌ Non trouvé');
                return item;
              } catch (e) {
                console.error(`Erreur lors de la lecture depuis localStorage (${key}):`, e);
                return null;
              }
            },
            setItem: (key, value) => {
              try {
                localStorage.setItem(key, value);
                console.log(`Écriture dans localStorage (${key}): ✅`);
              } catch (e) {
                console.error(`Erreur lors de l'écriture dans localStorage (${key}):`, e);
              }
            },
            removeItem: (key) => {
              try {
                localStorage.removeItem(key);
                console.log(`Suppression depuis localStorage (${key}): ✅`);
              } catch (e) {
                console.error(`Erreur lors de la suppression depuis localStorage (${key}):`, e);
              }
            }
          }
        },
        global: {
          // Augmenter le timeout pour éviter les problèmes de réseau
          fetch: (url, options) => {
            return fetch(url, {
              ...options,
              signal: AbortSignal.timeout(30000), // 30 secondes
            });
          }
        }
      };
      
      supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, options);
      console.log('Client Supabase créé avec succès');
      
      // Vérifier si une session active est présente
      supabase.auth.getSession().then(({ data, error }) => {
        if (error) {
          console.error('Erreur lors de la récupération de la session:', error.message);
        } else {
          console.log('Session Supabase:', data.session ? '✅ Présente' : '❌ Absente');
        }
      });
    } else {
      console.error('❌ Impossible de créer le client Supabase: variables d\'environnement manquantes');
      supabase = null;
    }
  } else {
    console.log('Environnement serveur détecté, pas de création du client Supabase');
    supabase = null;
  }
} catch (error) {
  console.error('❌ Erreur lors de la création du client Supabase:', error);
  supabase = null;
}

// Exporter le client
export { supabase };
