/**
 * Fonctions d'authentification côté serveur pour Next.js 15
 * Compatible avec les Server Components et les Server Actions
 */

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Crée un client Supabase côté serveur pour les fonctions d'authentification
 * À utiliser dans les Server Components ou Server Actions
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();
  
  // Récupérer les variables d'environnement
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Variables d\'environnement Supabase manquantes');
  }
  
  // Créer un client Supabase avec les cookies actuels
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false, // Ne pas persister la session en mémoire
      autoRefreshToken: false, // Ne pas rafraîchir automatiquement le token
    },
    global: {
      headers: {
        // Utiliser les cookies actuels pour l'authentification
        'Cookie': cookieStore.toString(),
      },
    },
  });
}

/**
 * Vérifie si l'utilisateur est authentifié côté serveur
 * @returns L'utilisateur authentifié ou null
 */
export async function getServerSession() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      return null;
    }
    
    // Récupérer l'utilisateur avec ses données
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return null;
    }
    
    // Récupérer les données utilisateur supplémentaires depuis la base
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userData.user.id)
      .single();
    
    return {
      user: userData.user,
      dbData: dbError ? null : dbUser,
      session: data.session,
    };
  } catch (err) {
    console.error('Erreur lors de la récupération de la session serveur:', err);
    return null;
  }
}

/**
 * Protège les routes côté serveur
 * À utiliser dans les layouts ou pages pour rediriger si non authentifié
 * @param redirectTo - La route vers laquelle rediriger si non authentifié
 */
export async function requireAuthentication(redirectTo = '/signin') {
  const session = await getServerSession();
  
  if (!session) {
    // Dans un composant serveur, on peut utiliser redirection côté serveur
    return {
      redirect: {
        destination: redirectTo,
        permanent: false,
      },
    };
  }
  
  return {
    props: {
      user: session.user,
      userData: session.dbData,
    },
  };
}

/**
 * Vérifie le rôle de l'utilisateur côté serveur
 * @param allowedRoles - Les rôles autorisés
 * @param redirectTo - La route vers laquelle rediriger si le rôle n'est pas autorisé
 */
export async function requireRole(allowedRoles: string[], redirectTo = '/dashboard') {
  const session = await getServerSession();
  
  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }
  
  // Vérifier si l'utilisateur a un rôle autorisé
  const userRole = session.dbData?.role || session.user.user_metadata?.role;
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    return {
      redirect: {
        destination: redirectTo,
        permanent: false,
      },
    };
  }
  
  return {
    props: {
      user: session.user,
      userData: session.dbData,
    },
  };
}
