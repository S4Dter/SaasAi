import { User, UserRole } from '../types';

/**
 * Données mockées pour les utilisateurs
 * Ces données seront utilisées en attendant l'intégration d'un backend réel
 */

export const mockUsers: User[] = [
  {
    id: 'creator1',
    name: 'Sophie Martin',
    email: 'sophie@salesgenius.ai',
    role: 'creator',
    avatar: '/images/users/creator1.jpg',
    company: 'SalesGenius AI',
    bio: 'Spécialiste en IA pour les solutions de vente, avec plus de 8 ans d\'expérience en machine learning et automatisation.',
    createdAt: new Date('2024-11-15'),
  },
  {
    id: 'creator2',
    name: 'Thomas Dubois',
    email: 'thomas@customercare.ai',
    role: 'creator',
    avatar: '/images/users/creator2.jpg',
    company: 'CustomerCare AI Solutions',
    bio: 'Expert en chatbots et systèmes conversationnels, passionné par l\'amélioration de l\'expérience client.',
    createdAt: new Date('2024-12-05'),
  },
  {
    id: 'creator3',
    name: 'Marie Leclerc',
    email: 'marie@legaldoc.ai',
    role: 'creator',
    avatar: '/images/users/creator3.jpg',
    company: 'LegalDoc Intelligence',
    bio: 'Avocate et développeuse, spécialisée dans les solutions d\'IA juridique et la génération automatisée de documents.',
    createdAt: new Date('2024-10-23'),
  },
  {
    id: 'creator4',
    name: 'Nicolas Bernard',
    email: 'nicolas@marketingmind.ai',
    role: 'creator',
    avatar: '/images/users/creator4.jpg',
    company: 'MarketingMind Technologies',
    bio: 'Ancien directeur marketing reconverti dans l\'IA, créateur de solutions innovantes pour l\'automatisation marketing.',
    createdAt: new Date('2024-11-18'),
  },
  {
    id: 'creator5',
    name: 'Camille Fournier',
    email: 'camille@hrassistant.ai',
    role: 'creator',
    avatar: '/images/users/creator5.jpg',
    company: 'HR Assistant Pro',
    bio: 'Ancienne DRH passionnée par la technologie, développant des solutions IA pour révolutionner les RH.',
    createdAt: new Date('2024-10-30'),
  },
  {
    id: 'creator6',
    name: 'Laurent Mercier',
    email: 'laurent@financialadvisor.ai',
    role: 'creator',
    avatar: '/images/users/creator6.jpg',
    company: 'FinancialAdvisor AI',
    bio: 'Expert en finance et data science, créateur d\'outils d\'analyse financière basés sur l\'IA.',
    createdAt: new Date('2024-11-10'),
  },
  {
    id: 'enterprise1',
    name: 'Émilie Dupont',
    email: 'emilie@techcorp.fr',
    role: 'enterprise',
    avatar: '/images/users/enterprise1.jpg',
    company: 'TechCorp France',
    bio: 'Directrice de l\'innovation, à la recherche de solutions IA pour optimiser nos processus commerciaux.',
    createdAt: new Date('2025-01-10'),
  },
  {
    id: 'enterprise2',
    name: 'Jean Moreau',
    email: 'jean@globalretail.com',
    role: 'enterprise',
    avatar: '/images/users/enterprise2.jpg',
    company: 'Global Retail Inc.',
    bio: 'Responsable expérience client, intéressé par les solutions d\'automatisation du support client.',
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 'enterprise3',
    name: 'Claire Rousseau',
    email: 'claire@legalconsult.fr',
    role: 'enterprise',
    avatar: '/images/users/enterprise3.jpg',
    company: 'LegalConsult France',
    bio: 'Directrice juridique cherchant à optimiser la rédaction et l\'analyse de documents légaux.',
    createdAt: new Date('2025-01-20'),
  },
  {
    id: 'admin1',
    name: 'Admin Système',
    email: 'admin@agentmarket.com',
    role: 'admin',
    avatar: '/images/users/admin.jpg',
    createdAt: new Date('2024-10-01'),
  }
];

/**
 * Récupère tous les utilisateurs
 */
export const getAllUsers = () => {
  return mockUsers;
};

/**
 * Récupère un utilisateur par son ID
 */
export const getUserById = (id: string) => {
  return mockUsers.find(user => user.id === id);
};

/**
 * Récupère un utilisateur par son email
 */
export const getUserByEmail = (email: string) => {
  return mockUsers.find(user => user.email === email);
};

/**
 * Récupère tous les créateurs
 */
export const getAllCreators = () => {
  return mockUsers.filter(user => user.role === 'creator');
};

/**
 * Récupère tous les utilisateurs entreprise
 */
export const getAllEnterprises = () => {
  return mockUsers.filter(user => user.role === 'enterprise');
};

/**
 * Récupère le créateur d'un agent par l'ID de l'agent
 */
export const getCreatorByAgentId = (agentId: string) => {
  // Import dynamique pour éviter les erreurs de dépendance circulaire
  const { getAgentById } = require('./agents');
  const agent = getAgentById(agentId);
  if (!agent) return null;
  
  return mockUsers.find(user => user.id === agent.creatorId);
};

/**
 * Authentifie un utilisateur (simulation)
 */
export const authenticateUser = (email: string, password: string) => {
  // Simulation d'authentification (dans un système réel, vérifiez le mot de passe)
  const user = getUserByEmail(email);
  
  if (user && password.length > 0) {
    // Simule un utilisateur authentifié avec succès
    return {
      success: true,
      user: { ...user, password: undefined }
    };
  }
  
  return {
    success: false,
    error: 'Email ou mot de passe incorrect'
  };
};
