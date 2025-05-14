// app/dashboard/creator/prospection/Pagination.tsx
'use client';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex justify-between items-center mt-6">
      <div className="text-sm text-gray-500">
        Affichage de <span className="font-medium">{startItem}</span> à <span className="font-medium">{endItem}</span> sur <span className="font-medium">{totalItems}</span> prospects
      </div>
      <div className="flex space-x-1">
        <button
          className={`px-3 py-1 text-sm border border-gray-300 rounded-md ${
            currentPage <= 1 ? 'bg-white text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Précédent
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNumber = i + 1;
          return (
            <button
              key={pageNumber}
              className={`px-3 py-1 text-sm border border-gray-300 rounded-md ${
                currentPage === pageNumber ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
        <button
          className={`px-3 py-1 text-sm border border-gray-300 rounded-md ${
            currentPage >= totalPages ? 'bg-white text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}