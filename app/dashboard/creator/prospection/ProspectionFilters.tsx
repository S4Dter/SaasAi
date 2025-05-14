// app/dashboard/creator/prospection/ProspectionFilters.tsx
'use client';
import React from 'react';

export interface ProspectionFilters {
  searchTerm: string;
  industry: string;
  budget: string;
  status: string;
}

interface ProspectionFiltersProps {
  filters: ProspectionFilters;
  onChange: (key: keyof ProspectionFilters, value: string) => void;
  onFilter: () => void;
  totalProspects: number;
}

export default function ProspectionFilters({
  filters,
  onChange,
  onFilter,
  totalProspects
}: ProspectionFiltersProps) {
  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Rechercher par nom d'entreprise, secteur..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.searchTerm}
            onChange={(e) => onChange('searchTerm', e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filters.industry}
          onChange={(e) => onChange('industry', e.target.value)}
        >
          <option value="all">Tous les secteurs</option>
          <option value="tech">Technologie</option>
          <option value="finance">Finance</option>
          <option value="retail">Commerce</option>
          <option value="healthcare">Santé</option>
          <option value="manufacturing">Industrie</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filters.budget}
          onChange={(e) => onChange('budget', e.target.value)}
        >
          <option value="all">Tous les budgets</option>
          <option value="low">Moins de 200€/mois</option>
          <option value="medium">200€-500€/mois</option>
          <option value="high">Plus de 500€/mois</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filters.status}
          onChange={(e) => onChange('status', e.target.value)}
        >
          <option value="all">Tout statut</option>
          <option value="notContacted">Non contactés</option>
          <option value="contacted">Déjà contactés</option>
        </select>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={onFilter}
        >
          Filtrer
        </button>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {totalProspects} prospects trouvés
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">Trier par:</span>
          <select className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="match">Score de correspondance</option>
            <option value="activity">Activité récente</option>
            <option value="alphabetical">Ordre alphabétique</option>
            <option value="budget">Budget estimé</option>
          </select>
        </div>
      </div>
    </div>
  );
}