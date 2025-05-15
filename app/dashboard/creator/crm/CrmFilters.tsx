'use client';
import React from 'react';
import Button from '@/components/ui/Button';

interface FiltersType {
  searchTerm: string;
  secteur: string;
  budget: string;
  statut: string;
}

interface CrmFiltersProps {
  filters: FiltersType;
  onChange: (key: keyof FiltersType, value: string) => void;
  onFilter: () => void;
  totalProspects: number;
}

export default function CrmFilters({ filters, onChange, onFilter, totalProspects }: CrmFiltersProps) {
  return (
    <div>
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-full md:w-64">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Recherche
          </label>
          <input
            type="text"
            id="search"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Nom, secteur, besoins..."
            value={filters.searchTerm}
            onChange={(e) => onChange('searchTerm', e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-auto">
          <label htmlFor="secteur" className="block text-sm font-medium text-gray-700 mb-1">
            Secteur
          </label>
          <select
            id="secteur"
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={filters.secteur}
            onChange={(e) => onChange('secteur', e.target.value)}
          >
            <option value="all">Tous les secteurs</option>
            <option value="finance">Finance</option>
            <option value="sante">Santé</option>
            <option value="education">Education</option>
            <option value="commerce">Commerce</option>
            <option value="technologie">Technologie</option>
            <option value="industrie">Industrie</option>
            <option value="services">Services</option>
            <option value="immobilier">Immobilier</option>
            <option value="autres">Autres</option>
          </select>
        </div>
        
        <div className="w-full md:w-auto">
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
            Budget
          </label>
          <select
            id="budget"
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={filters.budget}
            onChange={(e) => onChange('budget', e.target.value)}
          >
            <option value="all">Tous les budgets</option>
            <option value="low">Moins de 200€</option>
            <option value="medium">Entre 200€ et 500€</option>
            <option value="high">Plus de 500€</option>
          </select>
        </div>
        
        <div className="w-full md:w-auto">
          <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-1">
            Statut Email
          </label>
          <select
            id="statut"
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={filters.statut}
            onChange={(e) => onChange('statut', e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="non_envoye">Non envoyé</option>
            <option value="envoye">Envoyé</option>
          </select>
        </div>
        
        <div className="w-full md:w-auto md:ml-auto">
          <Button 
            onClick={onFilter}
            size="sm"
          >
            Filtrer ({totalProspects})
          </Button>
        </div>
      </div>
    </div>
  );
}
