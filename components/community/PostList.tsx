'use client';

import React from 'react';
import { CommunityPost } from '@/types/community';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Heart } from 'lucide-react';

interface PostListProps {
  posts: CommunityPost[];
  isLoading: boolean;
  isError: boolean;
  isAuthenticated: boolean;
  onLike: (postId: string) => void;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  isLoading,
  isError,
  isAuthenticated,
  onLike
}) => {
  // Afficher un message de chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Afficher un message d'erreur
  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur !</strong>
        <span className="block sm:inline"> Impossible de charger les posts de la communauté.</span>
      </div>
    );
  }

  // Afficher un message si aucun post n'est trouvé
  if (posts.length === 0) {
    return (
      <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded relative">
        <span className="block">Aucun post dans la communauté pour le moment. Soyez le premier à publier !</span>
      </div>
    );
  }

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
          <p className="text-gray-600 mb-4">{post.content}</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              Par {post.author?.name || 'Utilisateur anonyme'} • {formatDate(post.created_at)}
            </div>
            <button
              onClick={() => onLike(post.id)}
              disabled={!isAuthenticated}
              className={`flex items-center space-x-1 ${
                isAuthenticated ? 'hover:text-red-500 cursor-pointer' : 'cursor-not-allowed opacity-50'
              } ${post.user_has_liked ? 'text-red-500' : 'text-gray-400'}`}
              title={isAuthenticated ? 'Aimer ce post' : 'Connectez-vous pour aimer ce post'}
            >
              <Heart size={16} fill={post.user_has_liked ? 'currentColor' : 'none'} />
              <span>{post.likes_count || 0}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
