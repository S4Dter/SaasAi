'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDate, calculateReadingTime } from '@/lib/blog/utils';
import { PostWithRelations } from '@/types/blog';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';

interface BlogPostCardProps {
  post: PostWithRelations;
  variant?: 'default' | 'compact';
}

export function BlogPostCard({ post, variant = 'default' }: BlogPostCardProps) {
  const readingTime = calculateReadingTime(post.content);
  
  if (variant === 'compact') {
    return (
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <Link href={`/blog/${post.slug}`} className="block h-full">
          <CardHeader className="p-4 pb-2">
            <h3 className="text-base font-bold leading-tight line-clamp-2">
              {post.title}
            </h3>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {post.excerpt && (
              <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
            )}
          </CardContent>
          <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between">
            <span>{formatDate(post.published_at || post.created_at)}</span>
            <span>{readingTime} min</span>
          </CardFooter>
        </Link>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          {post.featured_image ? (
            <Image 
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
        
        <CardHeader className="p-6 pb-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {post.categories?.slice(0, 2).map((category) => (
              <Badge key={category.id} variant="secondary" className="font-normal">
                {category.name}
              </Badge>
            ))}
          </div>
          <h2 className="text-xl md:text-2xl font-bold line-clamp-2">
            {post.title}
          </h2>
        </CardHeader>
        
        <CardContent className="p-6 pt-0">
          {post.excerpt && (
            <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
          )}
        </CardContent>
        
        <CardFooter className="p-6 pt-0 text-sm text-muted-foreground flex justify-between">
          <div className="flex items-center gap-2">
            {post.author?.full_name && (
              <span>Par {post.author.full_name}</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>{formatDate(post.published_at || post.created_at)}</span>
            <span>{readingTime} min</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
