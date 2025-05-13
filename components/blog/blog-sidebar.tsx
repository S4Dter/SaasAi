'use client';

import Link from 'next/link';
import { formatDate } from '@/lib/blog/utils';
import { Post, Category, Tag } from '@/types/blog';
import { useCategories, useTags } from '@/lib/blog/hooks';
import { BlogSearch } from './blog-search';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface BlogSidebarProps {
  recentPosts?: Post[];
}

export function BlogSidebar({ recentPosts = [] }: BlogSidebarProps) {
  const { categories, loading: categoriesLoading } = useCategories();
  const { tags, loading: tagsLoading } = useTags();
  
  return (
    <aside className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Rechercher</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogSearch />
        </CardContent>
      </Card>
      
      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Catégories</CardTitle>
        </CardHeader>
        <CardContent>
          {categoriesLoading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune catégorie disponible</p>
          ) : (
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/blog/category/${category.slug}`}
                    className="text-sm hover:underline hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Articles récents</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentPosts.map((post) => (
                <li key={post.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(post.published_at || post.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {/* Tags */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Tags</CardTitle>
        </CardHeader>
        <CardContent>
          {tagsLoading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : tags.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun tag disponible</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link 
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className="no-underline"
                >
                  <Badge variant="outline" className="font-normal">
                    #{tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
