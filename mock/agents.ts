import { Agent, AgentCategory, IntegrationType } from '../types';

/**
 * Données mockées pour les agents IA
 * Ces données seront utilisées en attendant l'intégration d'un backend réel
 */

export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'SalesGenius',
    slug: 'sales-genius',
    description: `SalesGenius est un agent IA spécialisé dans l'automatisation des processus de vente. 
    
    Il analyse les données clients, prédit les besoins, et suggère des stratégies de vente personnalisées. Grâce à son apprentissage continu, il s'améliore avec chaque interaction client.
    
    ## Fonctionnalités principales
    
    - Analyse prédictive des opportunités de vente
    - Suivi automatisé des prospects
    - Génération de rapports détaillés
    - Intégration avec les CRM populaires
    
    ## Bénéfices
    
    - Augmentation du taux de conversion de 35% en moyenne
    - Réduction du temps de cycle de vente de 28%
    - Amélioration de la satisfaction client grâce à une approche personnalisée
    `,
    shortDescription: "L'IA qui révolutionne vos processus de vente avec analyse prédictive et automatisation.",
    category: 'sales',
    creatorId: 'creator1',
    pricing: {
      model: 'subscription',
      startingPrice: 199,
      currency: 'EUR',
      details: 'À partir de 199€/mois. Essai gratuit de 14 jours.'
    },
    featured: true,
    logoUrl: '/images/agents/sales-genius.png',
    integrations: ['api', 'widget', 'webapp'],
    demoUrl: 'https://demo.salesgenius.ai',
    demoVideoUrl: '/videos/sales-genius-demo.mp4',
    screenshots: [
      '/images/agents/sales-genius-1.png',
      '/images/agents/sales-genius-2.png',
    ],
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-03-28'),
  },
  {
    id: '2',
    name: 'CustomerCare AI',
    slug: 'customer-care-ai',
    description: `CustomerCare AI est un agent conversationnel avancé qui gère le support client 24/7 avec une touche humaine.
    
    Entraîné sur des millions d'interactions client, il peut résoudre les problèmes courants, escalader les cas complexes, et maintenir une communication fluide et naturelle.
    
    ## Fonctionnalités principales
    
    - Réponses instantanées 24/7
    - Support multilingue (15 langues)
    - Transfert intelligent vers des agents humains
    - Apprentissage continu basé sur les interactions
    
    ## Bénéfices
    
    - Réduction des coûts de support de 60%
    - Temps de réponse moyen de 5 secondes
    - Taux de résolution au premier contact de 78%
    `,
    shortDescription: "Agent conversationnel 24/7 qui transforme votre support client avec réponses instantanées et personnalisées.",
    category: 'customer-service',
    creatorId: 'creator2',
    pricing: {
      model: 'usage-based',
      startingPrice: 0.05,
      currency: 'EUR',
      details: '0,05€ par conversation. Volume dégressif disponible.'
    },
    featured: true,
    logoUrl: '/images/agents/customer-care.png',
    integrations: ['chatbot', 'api', 'widget', 'mobile'],
    demoUrl: 'https://demo.customercare.ai',
    demoVideoUrl: '/videos/customer-care-demo.mp4',
    createdAt: new Date('2025-02-05'),
    updatedAt: new Date('2025-03-15'),
  },
  {
    id: '3',
    name: 'LegalDoc Assistant',
    slug: 'legal-doc-assistant',
    description: `LegalDoc Assistant est un agent IA spécialisé dans la génération et l'analyse de documents juridiques.
    
    Formé sur des millions de contrats et documents légaux, il peut rédiger, réviser et analyser tout type de document juridique tout en respectant les législations locales.
    
    ## Fonctionnalités principales
    
    - Génération de contrats et documents légaux
    - Analyse et révision de documents existants
    - Détection des clauses à risque
    - Mise à jour automatique selon les changements législatifs
    
    ## Bénéfices
    
    - Réduction du temps de rédaction juridique de 85%
    - Diminution des risques légaux
    - Conformité assurée avec les législations actuelles
    `,
    shortDescription: "Expert juridique IA qui génère, analyse et révise vos documents légaux avec précision et conformité.",
    category: 'legal',
    creatorId: 'creator3',
    pricing: {
      model: 'subscription',
      startingPrice: 299,
      currency: 'EUR',
      details: '299€/mois pour accès illimité. Option par document disponible.'
    },
    logoUrl: '/images/agents/legal-doc.png',
    integrations: ['api', 'webapp', 'standalone'],
    createdAt: new Date('2025-01-23'),
    updatedAt: new Date('2025-03-10'),
  },
  {
    id: '4',
    name: 'MarketingMind',
    slug: 'marketing-mind',
    description: `MarketingMind est un agent IA qui révolutionne la création et l'optimisation de campagnes marketing.
    
    Analysant les tendances du marché et le comportement des consommateurs, il génère des stratégies marketing ciblées avec contenu, planification et prévisions de performance.
    
    ## Fonctionnalités principales
    
    - Création de stratégies marketing multicanal
    - Génération de contenu optimisé SEO
    - Analyse prédictive des performances
    - Segmentation automatisée des audiences
    
    ## Bénéfices
    
    - Augmentation du ROI marketing de 45%
    - Réduction du temps de création de campagne de 75%
    - Optimisation continue basée sur les performances réelles
    `,
    shortDescription: "Stratège marketing IA qui crée et optimise vos campagnes avec analyse prédictive et génération de contenu.",
    category: 'marketing',
    creatorId: 'creator4',
    pricing: {
      model: 'subscription',
      startingPrice: 249,
      currency: 'EUR',
      details: 'À partir de 249€/mois. Plans personnalisables selon vos besoins.'
    },
    featured: true,
    logoUrl: '/images/agents/marketing-mind.png',
    integrations: ['api', 'webapp', 'standalone'],
    demoUrl: 'https://demo.marketingmind.ai',
    createdAt: new Date('2025-02-18'),
    updatedAt: new Date('2025-03-25'),
  },
  {
    id: '5',
    name: 'HR Assistant Pro',
    slug: 'hr-assistant-pro',
    description: `HR Assistant Pro est un agent IA complet pour la gestion des ressources humaines.
    
    De la présélection des CV à l'onboarding, en passant par la gestion des congés et la satisfaction des employés, il automatise et optimise tous les processus RH.
    
    ## Fonctionnalités principales
    
    - Présélection automatisée des candidats
    - Gestion des processus d'onboarding et d'offboarding
    - Analyse de l'engagement et de la satisfaction des employés
    - Assistance pour les requêtes RH quotidiennes
    
    ## Bénéfices
    
    - Réduction du temps de recrutement de 65%
    - Amélioration de la rétention des talents
    - Économie moyenne de 30% sur les coûts RH
    `,
    shortDescription: "Solution RH complète qui automatise recrutement, onboarding et gestion quotidienne des ressources humaines.",
    category: 'hr',
    creatorId: 'creator5',
    pricing: {
      model: 'subscription',
      startingPrice: 179,
      currency: 'EUR',
      details: 'À partir de 179€/mois. Prix par utilisateur disponible.'
    },
    logoUrl: '/images/agents/hr-assistant.png',
    integrations: ['api', 'webapp', 'standalone'],
    createdAt: new Date('2025-01-30'),
    updatedAt: new Date('2025-03-12'),
  },
  {
    id: '6',
    name: 'FinancialAdvisor AI',
    slug: 'financial-advisor-ai',
    description: `FinancialAdvisor AI est un agent spécialisé dans l'analyse financière et la planification budgétaire.
    
    Utilisant des modèles prédictifs sophistiqués, il offre des conseils financiers personnalisés, des prévisions budgétaires précises et des stratégies d'optimisation fiscale.
    
    ## Fonctionnalités principales
    
    - Analyse complète de la santé financière
    - Prévisions budgétaires et scénarios
    - Recommandations d'investissement
    - Optimisation fiscale
    
    ## Bénéfices
    
    - Économies moyennes de 15% sur les dépenses annuelles
    - Rendement amélioré des investissements
    - Décisions financières basées sur des données précises
    `,
    shortDescription: "Conseiller financier IA qui analyse, prévoit et optimise votre situation financière avec précision.",
    category: 'finance',
    creatorId: 'creator6',
    pricing: {
      model: 'subscription',
      startingPrice: 149,
      currency: 'EUR',
      details: '149€/mois pour particuliers. Offres entreprises disponibles.'
    },
    logoUrl: '/images/agents/financial-advisor.png',
    integrations: ['api', 'webapp', 'mobile'],
    createdAt: new Date('2025-02-10'),
    updatedAt: new Date('2025-03-20'),
  }
];

/**
 * Récupère tous les agents
 */
export const getAllAgents = () => {
  return mockAgents;
};

/**
 * Récupère les agents en vedette
 */
export const getFeaturedAgents = () => {
  return mockAgents.filter(agent => agent.featured);
};

/**
 * Récupère un agent par son ID
 */
export const getAgentById = (id: string) => {
  return mockAgents.find(agent => agent.id === id);
};

/**
 * Récupère un agent par son slug
 */
export const getAgentBySlug = (slug: string) => {
  return mockAgents.find(agent => agent.slug === slug);
};

/**
 * Filtre les agents selon des critères
 */
export const filterAgents = (category?: AgentCategory | 'all', integrations?: IntegrationType[], searchQuery?: string) => {
  return mockAgents.filter(agent => {
    // Filtre par catégorie
    if (category && category !== 'all' && agent.category !== category) {
      return false;
    }
    
    // Filtre par intégrations
    if (integrations && integrations.length > 0) {
      const hasAllIntegrations = integrations.every(integration => 
        agent.integrations.includes(integration)
      );
      if (!hasAllIntegrations) return false;
    }
    
    // Filtre par recherche
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        agent.name.toLowerCase().includes(searchLower) ||
        agent.description.toLowerCase().includes(searchLower) ||
        agent.shortDescription.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
};
