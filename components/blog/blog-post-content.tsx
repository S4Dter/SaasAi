'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDate, calculateReadingTime } from '@/lib/blog/utils';
import { PostWithRelations } from '@/types/blog';
import { Badge } from '@/components/ui/Badge';

interface BlogPostContentProps {
  post: PostWithRelations;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const readingTime = calculateReadingTime(post.content);
  
  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories?.map((category) => (
            <Link 
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className="no-underline"
            >
              <Badge variant="secondary" className="font-normal">
                {category.name}
              </Badge>
            </Link>
          ))}
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {post.author?.full_name && (
            <div>Par {post.author.full_name}</div>
          )}
          <div>
            {formatDate(post.published_at || post.created_at)}
          </div>
          <div>
            {readingTime} min de lecture
          </div>
        </div>
      </header>
      
      {/* Featured Image */}
      {post.featured_image && (
        <div className="relative aspect-video w-full mb-10 overflow-hidden rounded-lg">
          <Image 
            src={post.featured_image}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
      )}
      
      {/* Content */}
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
      
      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-10 pt-6 border-t">
          <h2 className="text-lg font-bold mb-3">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
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
        </div>
      )}
    </article>
  );
}
