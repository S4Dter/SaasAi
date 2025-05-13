import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

/**
 * Crée un client Supabase côté serveur pour les fonctions d'authentification
 * À utiliser UNIQUEMENT dans les Server Components ou Server Actions
 */
export function createServerSupabaseClient() {
  return createServerComponentClient<Database>({ cookies });
}

/**
 * Récupère la session Supabase côté serveur
 */
export async function getServerSession() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return null;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return null;

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
}

/**
 * Redirige si l'utilisateur n'est pas authentifié
 */
export async function requireAuthentication(redirectTo = '/signin') {
  const session = await getServerSession();
  if (!session) {
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
 * Redirige si le rôle de l'utilisateur ne correspond pas
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
