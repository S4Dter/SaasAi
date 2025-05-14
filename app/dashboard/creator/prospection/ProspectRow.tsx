// app/dashboard/creator/prospection/ProspectRow.tsx
'use client';
import React from 'react';

export interface Prospect {
  id: string;
  name: string;
  company: string;
  avatar?: string;
  location?: string;
  industryInterest: string;
  budget: string;
  matchScore: number;
  lastActivity: string;
  contacted: boolean;
  notes?: string;
}

interface ProspectRowProps {
  prospect: Prospect;
  onViewProfile: (id: string) => void;
  onContact: (id: string) => void;
}

export default function ProspectRow({ prospect, onViewProfile, onContact }: ProspectRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-bold">
            {prospect.avatar ? (
              <img src={prospect.avatar} alt={prospect.name} className="h-10 w-10 rounded-full" />
            ) : (
              prospect.company.charAt(0)
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {prospect.company}
            </div>
            <div className="text-sm text-gray-500">
              {prospect.name} • {prospect.location}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          {prospect.industryInterest}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {prospect.budget}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className="text-sm text-gray-900 mr-2">{prospect.matchScore}%</span>
          <div className="w-24 bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                prospect.matchScore > 80 ? 'bg-green-500' : 
                prospect.matchScore > 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`} 
              style={{ width: `${prospect.matchScore}%` }}
            ></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        Il y a {prospect.lastActivity}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span 
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            prospect.contacted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {prospect.contacted ? 'Contacté' : 'Non contacté'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          className="text-blue-600 hover:text-blue-900 mr-4"
          onClick={() => onViewProfile(prospect.id)}
        >
          Voir profil
        </button>
        {!prospect.contacted && (
          <button 
            className="text-green-600 hover:text-green-900"
            onClick={() => onContact(prospect.id)}
          >
            Contacter
          </button>
        )}
      </td>
    </tr>
  );
}