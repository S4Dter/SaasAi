import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  bordered?: boolean;
}

/**
 * Composant Card réutilisable
 * 
 * Peut être utilisé pour afficher des informations dans un conteneur élégant.
 * 
 * @param {React.ReactNode} children - Contenu de la carte
 * @param {string} className - Classes CSS additionnelles
 * @param {boolean} hoverable - Si la carte doit avoir un effet au survol
 * @param {boolean} bordered - Si la carte doit avoir une bordure
 */
const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  hoverable = false,
  bordered = true
}) => {
  const baseClasses = 'bg-white rounded-lg overflow-hidden shadow-sm';
  const hoverClasses = hoverable ? 'transition-all duration-200 hover:shadow-md hover:-translate-y-1' : '';
  const borderClasses = bordered ? 'border border-gray-200' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${borderClasses} ${className}`}>
      {children}
    </div>
  );
};

/**
 * En-tête de la carte
 */
export const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  children,
  className = '' 
}) => {
  return (
    <div className={`px-4 py-3 border-b border-gray-200 font-medium ${className}`}>
      {children}
    </div>
  );
};

/**
 * Corps de la carte
 */
export const CardBody: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  children,
  className = '' 
}) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

/**
 * Pied de la carte
 */
export const CardFooter: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  children,
  className = '' 
}) => {
  return (
    <div className={`px-4 py-3 bg-gray-50 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
