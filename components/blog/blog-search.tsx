'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface BlogSearchProps {
  defaultValue?: string;
}

export function BlogSearch({ defaultValue = '' }: BlogSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher..."
        className="w-full px-4 py-2 pl-10 border rounded-md shadow-sm focus:ring-primary focus:border-primary"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-muted-foreground"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
      <button 
        type="submit" 
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary"
      >
        <span className="sr-only">Rechercher</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </button>
    </form>
  );
}
