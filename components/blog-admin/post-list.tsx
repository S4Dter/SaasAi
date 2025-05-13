'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/blog/utils';
import { PostWithRelations } from '@/types/blog';
import { updatePostStatus, deletePost } from '@/lib/blog/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface PostListProps {
  posts: PostWithRelations[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  currentStatus?: string;
}

export function PostList({ 
  posts, 
  currentPage, 
  totalPages, 
  totalPosts, 
  currentStatus 
}: PostListProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isStatusChanging, setIsStatusChanging] = useState<string | null>(null);
  
  // Handle status change (publish/unpublish)
  async function handleStatusChange(postId: string, newStatus: 'published' | 'draft') {
    try {
      setIsStatusChanging(postId);
      await updatePostStatus(postId, newStatus);
      router.refresh();
    } catch (error) {
      console.error('Error changing post status:', error);
      alert('Une erreur est survenue lors du changement de statut.');
    } finally {
      setIsStatusChanging(null);
    }
  }
  
  // Handle post deletion
  async function handleDelete(postId: string) {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.')) {
      try {
        setIsDeleting(postId);
        await deletePost(postId);
        router.refresh();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Une erreur est survenue lors de la suppression.');
      } finally {
        setIsDeleting(null);
      }
    }
  }
  
  // Status filter links
  const statusLinks = (
    <div className="flex space-x-4 mb-4">
      <Link
        href="/dashboard/blog"
        className={`text-sm ${!currentStatus ? 'font-bold text-primary' : 'text-muted-foreground hover:text-foreground'}`}
      >
        Tous
      </Link>
      <Link
        href="/dashboard/blog?status=published"
        className={`text-sm ${currentStatus === 'published' ? 'font-bold text-primary' : 'text-muted-foreground hover:text-foreground'}`}
      >
        Publiés
      </Link>
      <Link
        href="/dashboard/blog?status=draft"
        className={`text-sm ${currentStatus === 'draft' ? 'font-bold text-primary' : 'text-muted-foreground hover:text-foreground'}`}
      >
        Brouillons
      </Link>
    </div>
  );
  
  // Pagination component
  const pagination = totalPages > 1 && (
    <div className="flex justify-center space-x-2 mt-6">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={`/dashboard/blog?page=${page}${currentStatus ? `&status=${currentStatus}` : ''}`}
          className={`px-3 py-1 rounded ${
            currentPage === page
              ? 'bg-primary text-white'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {page}
        </Link>
      ))}
    </div>
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles ({totalPosts})</CardTitle>
        {statusLinks}
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Aucun article trouvé</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Titre</th>
                    <th className="text-left py-3 px-4 hidden md:table-cell">Statut</th>
                    <th className="text-left py-3 px-4 hidden lg:table-cell">Date</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <Link
                          href={`/dashboard/blog/${post.id}`}
                          className="font-medium hover:underline"
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {post.status === 'published' ? 'Publié' : 'Brouillon'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-sm hidden lg:table-cell">
                        {formatDate(post.published_at || post.updated_at)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/dashboard/blog/${post.id}`}
                            className="text-sm text-primary hover:text-primary/80"
                          >
                            Modifier
                          </Link>
                          <button
                            onClick={() =>
                              handleStatusChange(
                                post.id,
                                post.status === 'published' ? 'draft' : 'published'
                              )
                            }
                            disabled={isStatusChanging === post.id}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {isStatusChanging === post.id
                              ? 'En cours...'
                              : post.status === 'published'
                              ? 'Dépublier'
                              : 'Publier'}
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={isDeleting === post.id}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            {isDeleting === post.id ? 'En cours...' : 'Supprimer'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination}
          </>
        )}
      </CardContent>
    </Card>
  );
}
