'use client';

import { supabase } from '../supabaseClient';
import { CommunityPost, CreatePostPayload } from '@/types/community';

/**
 * Récupérer tous les posts communautaires avec les données d'auteur
 * @returns Une promesse contenant la liste des posts communautaires
 */
export async function getCommunityPosts(): Promise<{ data: CommunityPost[] | null; error: any }> {
  try {
    if (!supabase) {
      console.error('Client Supabase non disponible');
      return { data: null, error: new Error('Client Supabase non disponible') };
    }

    const { data, error } = await supabase
      .from('community_posts')
      .select()
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des posts:', error);
      return { data: null, error };
    }

    // Pour chaque post, récupérer les informations de l'auteur
    const formattedData = await Promise.all(
      data.map(async (post: any) => {
        // Vérifier à nouveau que supabase existe
        if (!supabase) {
          return {
            ...post,
            author: undefined
          } as CommunityPost;
        }

        const { data: userData } = await supabase
          .from('users')
          .select('name, email')
          .eq('id', post.user_id)
          .single();
        
        return {
          ...post,
          author: userData || undefined
        } as CommunityPost;
      })
    );

    return { data: formattedData, error: null };
  } catch (error) {
    console.error('Exception lors de la récupération des posts:', error);
    return { data: null, error };
  }
}

/**
 * Créer un nouveau post communautaire
 * @param postData - Les données du post à créer
 * @returns Une promesse contenant le post créé
 */
export async function createCommunityPost(postData: CreatePostPayload): Promise<{ data: CommunityPost | null; error: any }> {
  try {
    if (!supabase) {
      console.error('Client Supabase non disponible');
      return { data: null, error: new Error('Client Supabase non disponible') };
    }

    // Vérifier si l'utilisateur est connecté en utilisant localStorage pour éviter les conflits
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user-id') : null;
    
    if (!userId) {
      console.error('Utilisateur non connecté: pas d\'ID utilisateur dans localStorage');
      return { data: null, error: new Error('Vous devez être connecté pour publier un message') };
    }

    // Créer le post avec l'ID de l'utilisateur connecté à partir de localStorage
    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        title: postData.title,
        content: postData.content,
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du post:', error);
      return { data: null, error };
    }

    // Récupérer les informations de l'auteur
    const { data: userData } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', userId)
      .single();

    const formattedPost = {
      ...data,
      author: userData || undefined
    } as CommunityPost;

    return { data: formattedPost, error: null };
  } catch (error) {
    console.error('Exception lors de la création du post:', error);
    return { data: null, error };
  }
}

/**
 * Ajouter ou supprimer un like sur un post
 * @param postId - L'identifiant du post
 * @param action - L'action à effectuer (add pour ajouter, remove pour supprimer)
 * @returns Une promesse indiquant le succès ou l'échec de l'opération
 */
export async function togglePostLike(postId: string, action: 'add' | 'remove'): Promise<{ success: boolean; error: any }> {
  try {
    if (!supabase) {
      console.error('Client Supabase non disponible');
      return { success: false, error: new Error('Client Supabase non disponible') };
    }

    // Vérifier si l'utilisateur est connecté en utilisant localStorage pour éviter les conflits
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user-id') : null;
    
    if (!userId) {
      console.error('Utilisateur non connecté: pas d\'ID utilisateur dans localStorage');
      return { success: false, error: new Error('Vous devez être connecté pour aimer un message') };
    }

    if (action === 'add') {
      // Ajouter un like
      const { error } = await supabase
        .from('community_post_likes')
        .insert({
          post_id: postId,
          user_id: userId
        });

      if (error) {
        console.error('Erreur lors de l\'ajout du like:', error);
        return { success: false, error };
      }
    } else {
      // Supprimer un like
      const { error } = await supabase
        .from('community_post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (error) {
        console.error('Erreur lors de la suppression du like:', error);
        return { success: false, error };
      }
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Exception lors de la gestion du like:', error);
    return { success: false, error };
  }
}

/**
 * Vérifier si l'utilisateur a aimé un post et récupérer le nombre total de likes
 * @param postId - L'identifiant du post
 * @returns Une promesse contenant les informations de like
 */
export async function getPostLikeInfo(postId: string): Promise<{ 
  likes_count: number; 
  user_has_liked: boolean; 
  error: any 
}> {
  try {
    if (!supabase) {
      console.error('Client Supabase non disponible');
      return { likes_count: 0, user_has_liked: false, error: new Error('Client Supabase non disponible') };
    }

    // Vérifier si l'utilisateur est connecté en utilisant localStorage pour éviter les conflits
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user-id') : null;
    const userError = !userId ? new Error('Utilisateur non connecté') : null;
    
    // Récupérer le nombre total de likes
    const { count, error: countError } = await supabase
      .from('community_post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (countError) {
      console.error('Erreur lors du comptage des likes:', countError);
      return { likes_count: 0, user_has_liked: false, error: countError };
    }

    // Si l'utilisateur n'est pas connecté, retourner uniquement le nombre de likes
    if (userError || !userId) {
      return { likes_count: count || 0, user_has_liked: false, error: null };
    }

    // Vérifier si l'utilisateur a aimé ce post
    const { data: likeData, error: likeError } = await supabase
      .from('community_post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (likeError) {
      console.error('Erreur lors de la vérification du like utilisateur:', likeError);
      return { likes_count: count || 0, user_has_liked: false, error: likeError };
    }

    return { 
      likes_count: count || 0, 
      user_has_liked: !!likeData, 
      error: null 
    };
  } catch (error) {
    console.error('Exception lors de la récupération des infos de like:', error);
    return { likes_count: 0, user_has_liked: false, error };
  }
}
