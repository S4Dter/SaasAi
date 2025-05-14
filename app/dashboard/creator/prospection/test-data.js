// Test script to ajouter des données de test à la base de données Supabase
// Exécuter avec: node app/dashboard/creator/prospection/test-data.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialiser le client Supabase avec les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Si les clés sont manquantes, arrêter l'exécution
if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

// Créer le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour générer un ID utilisateur (format UUID)
function generateUserId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Fonction principale pour ajouter des données de test
async function addTestData() {
  // Demander l'ID de l'utilisateur créateur
  const userId = process.argv[2] || generateUserId();
  console.log(`Utilisation de l'ID créateur: ${userId}`);

  try {
    // Liste des industries
    const industries = ['Tech', 'Finance', 'Retail', 'Healthcare', 'Manufacturing', 'Education'];
    const locations = ['Paris, France', 'Lyon, France', 'Bordeaux, France', 'Marseille, France', 'Lille, France'];
    const budgets = ['< 200€/mois', '200€-500€/mois', '500€-1000€/mois', '> 1000€/mois'];
    
    // Ajouter 10 prospects de test
    console.log('Ajout de prospects de test...');
    for (let i = 0; i < 10; i++) {
      const industryIndex = Math.floor(Math.random() * industries.length);
      const industry = industries[industryIndex];
      const budget = budgets[Math.floor(Math.random() * budgets.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const matchScore = Math.floor(Math.random() * 41) + 60; // Score entre 60 et 100
      
      const prospect = {
        name: `Contact Test ${i+1}`,
        company: `Entreprise Test ${i+1}`,
        email: `contact${i+1}@example.com`,
        location,
        industry_interest: industry,
        budget,
        match_score: matchScore,
        last_activity: new Date().toISOString(),
        last_activity_type: 'platform_join',
        contacted: i % 3 === 0, // Un tiers des prospects sont contactés
        notes: i % 2 === 0 ? `Notes sur le prospect test ${i+1}` : null,
        creator_id: userId
      };
      
      const { data, error } = await supabase
        .from('prospects')
        .insert(prospect);
        
      if (error) {
        console.error(`Erreur lors de l'ajout du prospect ${i+1}:`, error);
      } else {
        console.log(`✅ Prospect ${i+1} ajouté avec succès`);
      }
    }
    
    console.log('Terminé! Les prospects ont été ajoutés à la base de données.');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter la fonction principale
addTestData();
