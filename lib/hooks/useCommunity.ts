'use client';

import { useState, useEffect, useCallback } from 'react';
import { CommunityPost, CreatePostPayload } from '@/types/community';
import { 
  getCommunityPosts, 
  createCommunityPost, 
  getPostLikeInfo, 
  togglePostLike 
} from '@/lib/api/community';
import { supabase } from '../supabaseClient';

/**
 * Hook pour gérer les fonctionnalités de la communauté
 * @returns Données et fonctions pour interagir avec la communauté
 */
export function useCommunity() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) return;
      
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
    };
    
    checkAuth();
    
    // S'abonner aux changements d'état d'authentification
    const { data: { subscription } } = supabase?.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session?.user);
      }
    ) || { data: { subscription: null } };
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Récupérer les posts
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getCommunityPosts();
      
      if (error) {
        throw error;
      }
      
      setPosts(data || []);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des posts:', err);
      setError('Impossible de charger les posts. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les posts au montage du composant
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Créer un nouveau post
  const addPost = async (postData: CreatePostPayload) => {
    if (!isAuthenticated) {
      setError('Vous devez être connecté pour publier un message.');
      return false;
    }
    
    setError(null);
    
    try {
      const { data, error } = await createCommunityPost(postData);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Ajouter le nouveau post au début du tableau
        setPosts(prevPosts => [data, ...prevPosts]);
        return true;
      }
      
      return false;
    } catch (err: any) {
      console.error('Erreur lors de la création du post:', err);
      setError('Impossible de publier votre message. Veuillez réessayer.');
      return false;
    }
  };

  // Gérer les likes
  const toggleLike = async (postId: string) => {
    if (!isAuthenticated) {
      setError('Vous devez être connecté pour aimer un message.');
      return;
    }
    
    try {
      // Vérifier si l'utilisateur a déjà aimé ce post
      const { likes_count, user_has_liked, error: likeInfoError } = await getPostLikeInfo(postId);
      
      if (likeInfoError) {
        throw likeInfoError;
      }
      
      // Appliquer l'action opposée
      const action = user_has_liked ? 'remove' : 'add';
      const { success, error } = await togglePostLike(postId, action);
      
      if (error) {
        throw error;
      }
      
      if (success) {
        // Mettre à jour localement le nombre de likes et l'état du like
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                likes_count: user_has_liked ? (post.likes_count || 1) - 1 : (post.likes_count || 0) + 1,
                user_has_liked: !user_has_liked
              };
            }
            return post;
          })
        );
      }
    } catch (err: any) {
      console.error('Erreur lors de la gestion du like:', err);
      setError('Impossible de gérer le like. Veuillez réessayer.');
    }
  };

  return {
    posts,
    loading,
    error,
    isAuthenticated,
    fetchPosts,
    addPost,
    toggleLike
  };
}

export default useCommunity;
