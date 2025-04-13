import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

/**
 * Composant Button réutilisable
 * 
 * @param {React.ReactNode} children - Contenu du bouton
 * @param {ButtonVariant} variant - Style du bouton (primary, secondary, outline, ghost, link, danger)
 * @param {ButtonSize} size - Taille du bouton (sm, md, lg)
 * @param {boolean} fullWidth - Si le bouton doit prendre toute la largeur disponible
 * @param {React.ReactNode} icon - Icône à afficher dans le bouton
 * @param {boolean} isLoading - Si le bouton est en état de chargement
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} ...props - Props HTML du bouton
 */
const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  icon,
  isLoading = false,
  className = '',
  disabled,
  ...props 
}) => {
  // Classes de base
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none';
  
  // Classes spécifiques de variant
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-900',
    link: 'bg-transparent underline-offset-4 hover:underline text-blue-600 hover:text-blue-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  };
  
  // Classes spécifiques de taille
  const sizeClasses = {
    sm: 'text-sm h-8 px-3',
    md: 'text-base h-10 px-4',
    lg: 'text-lg h-12 px-6',
  };
  
  // Classe pour fullWidth
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Construire la chaîne de classes finale
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;
  
  return (
    <button 
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {icon && !isLoading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
