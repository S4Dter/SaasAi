/**
 * Script pour insérer des données de test dans la table CRM
 * 
 * Utilisation: node app/dashboard/creator/crm/test-data.js USER_ID
 * 
 * Si aucun USER_ID n'est fourni, un UUID aléatoire sera généré.
 */

const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Récupérer les variables d'environnement de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Vérifier que les variables d'environnement sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Les variables d\'environnement Supabase ne sont pas configurées.');
  console.error('NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies.');
  process.exit(1);
}

// Créer un client Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Récupérer l'ID utilisateur depuis les arguments de ligne de commande ou générer un UUID aléatoire
const userId = process.argv[2] || uuidv4();

console.log(`Utilisation de l'ID utilisateur: ${userId}`);

// Données de test pour la table CRM
const crmData = [
  {
    prospect_name: 'Technologie Innovante SAS',
    secteur: 'technologie',
    budget_estime: '500€-1000€',
    taille_entreprise: 'Moyenne',
    besoins: 'Recherche d\'un agent IA pour l\'automatisation du service client et la gestion des requêtes fréquentes.',
    compatibilite: 92,
    statut_email: 'non_envoye',
    email_envoye: false
  },
  {
    prospect_name: 'Santé Plus',
    secteur: 'sante',
    budget_estime: '200€-500€',
    taille_entreprise: 'Petite',
    besoins: 'Besoin d\'un assistant IA pour aider à la gestion des rendez-vous et au suivi des patients.',
    compatibilite: 87,
    statut_email: 'non_envoye',
    email_envoye: false
  },
  {
    prospect_name: 'Finance Conseil',
    secteur: 'finance',
    budget_estime: '> 1000€',
    taille_entreprise: 'Grande',
    besoins: 'Agent IA pour l\'analyse des données financières et la génération de rapports automatisés.',
    compatibilite: 95,
    statut_email: 'non_envoye',
    email_envoye: false
  },
  {
    prospect_name: 'Éducation Future',
    secteur: 'education',
    budget_estime: '< 200€',
    taille_entreprise: 'Petite',
    besoins: 'Recherche un assistant IA pour créer des quizz personnalisés et suivre la progression des élèves.',
    compatibilite: 75,
    statut_email: 'non_envoye',
    email_envoye: false
  },
  {
    prospect_name: 'Boutique Élégance',
    secteur: 'commerce',
    budget_estime: '200€-500€',
    taille_entreprise: 'Petite',
    besoins: 'Agent IA pour la recommandation de produits et l\'analyse des comportements d\'achat.',
    compatibilite: 83,
    statut_email: 'non_envoye',
    email_envoye: false
  },
  {
    prospect_name: 'Manufacture Industrielle',
    secteur: 'industrie',
    budget_estime: '500€-1000€',
    taille_entreprise: 'Grande',
    besoins: 'Agent IA pour prédire les maintenances nécessaires et optimiser la production.',
    compatibilite: 79,
    statut_email: 'non_envoye',
    email_envoye: false
  },
  {
    prospect_name: 'Immobilier Prestige',
    secteur: 'immobilier',
    budget_estime: '> 1000€',
    taille_entreprise: 'Moyenne',
    besoins: 'Agent IA pour l\'analyse des tendances du marché et l\'estimation automatique des biens.',
    compatibilite: 88,
    statut_email: 'non_envoye',
    email_envoye: false
  },
  {
    prospect_name: 'Services Juridiques Pro',
    secteur: 'services',
    budget_estime: '500€-1000€',
    taille_entreprise: 'Moyenne',
    besoins: 'Assistant IA pour la recherche juridique et l\'analyse de documents.',
    compatibilite: 84,
    statut_email: 'non_envoye',
    email_envoye: false
  },
  {
    prospect_name: 'Restaurant Gastronomique',
    secteur: 'restauration',
    budget_estime: '< 200€',
    taille_entreprise: 'Petite',
    besoins: 'Agent IA pour la gestion des réservations et l\'analyse des avis clients.',
    compatibilite: 70,
    statut_email: 'non_envoye',
    email_envoye: false
  },
  {
    prospect_name: 'Transport Express',
    secteur: 'transport',
    budget_estime: '200€-500€',
    taille_entreprise: 'Moyenne',
    besoins: 'Agent IA pour l\'optimisation des itinéraires et la gestion de la logistique.',
    compatibilite: 82,
    statut_email: 'non_envoye',
    email_envoye: false
  }
];

// Fonction pour insérer les données de test dans la table CRM
async function insertTestData() {
  try {
    // Ajouter l'ID utilisateur à chaque enregistrement
    const dataWithUserId = crmData.map(item => ({
      ...item,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    // Insérer les données dans la table CRM
    const { data, error } = await supabase
      .from('crm')
      .insert(dataWithUserId);
      
    if (error) {
      console.error('Erreur lors de l\'insertion des données:', error);
      process.exit(1);
    }
    
    console.log('Données de test insérées avec succès !');
    console.log(`${dataWithUserId.length} prospects ont été créés pour l'utilisateur ${userId}`);
    
  } catch (error) {
    console.error('Une erreur est survenue:', error);
    process.exit(1);
  }
}

// Exécuter la fonction d'insertion des données
insertTestData();
