// app/dashboard/creator/prospection/RecommendationCard.tsx (complet)
'use client';
import React from 'react';

interface RecommendationCardProps {
  category: {
    label: string;
    value: string;
  };
  prospectCount: number;
  matchScore: number;
  averageBudget: string;
  onExplore: (category: string) => void;
}

export default function RecommendationCard({
  category,
  prospectCount,
  matchScore,
  averageBudget,
  onExplore
}: RecommendationCardProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h3 className="text-lg font-medium">{category.label}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        {prospectCount} prospects potentiels dans ce secteur avec un score de correspondance moyen de {matchScore}%.
      </p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Budget moyen estimé: {averageBudget}
        </span>
        <button 
          onClick={() => onExplore(category.value)} 
          className="text-sm text-blue-600 hover:underline"
        >
          Explorer
        </button>
      </div>
    </div>
  );
}