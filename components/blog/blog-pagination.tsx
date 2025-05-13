'use client';

import Link from 'next/link';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function BlogPagination({ currentPage, totalPages, baseUrl }: BlogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Always include first page
    pages.push(1);
    
    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    const rangeEnd = Math.min(totalPages - 1, rangeStart + maxVisiblePages - 2);
    
    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push('...');
    }
    
    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }
    
    // Always include last page if not already included
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const pages = getPageNumbers();
  
  return (
    <nav className="flex justify-center mt-8" aria-label="Pagination">
      <ul className="flex space-x-2">
        {/* Previous page */}
        {currentPage > 1 && (
          <li>
            <Link
              href={`${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${currentPage - 1}`}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
            >
              &laquo;
            </Link>
          </li>
        )}
        
        {/* Page numbers */}
        {pages.map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
            ) : (
              <Link
                href={`${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${page}`}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                  currentPage === page
                    ? 'z-10 bg-primary border-primary text-white'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </Link>
            )}
          </li>
        ))}
        
        {/* Next page */}
        {currentPage < totalPages && (
          <li>
            <Link
              href={`${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${currentPage + 1}`}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
            >
              &raquo;
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
