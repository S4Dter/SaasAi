'use client';

import React from 'react';
import PostList from '@/components/community/PostList';
import PostForm from '@/components/community/PostForm';
import useCommunity from '@/lib/hooks/useCommunity';

const CommunityClient: React.FC = () => {
  const {
    posts,
    loading,
    error,
    isAuthenticated,
    addPost,
    toggleLike
  } = useCommunity();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Communauté</h1>
      
      <div className="mb-8">
        <PostForm 
          isAuthenticated={isAuthenticated} 
          onSubmit={addPost} 
        />
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Erreur !</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <PostList
        posts={posts}
        isLoading={loading}
        isError={!!error}
        isAuthenticated={isAuthenticated}
        onLike={toggleLike}
      />
    </div>
  );
};

export default CommunityClient;
