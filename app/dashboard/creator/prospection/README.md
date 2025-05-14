# Module de Prospection pour Créateurs

Ce module permet aux créateurs d'agents IA de prospecter de nouveaux clients potentiels qui correspondent à leurs agents.

## Fonctionnalités

- Affichage des prospects avec leur niveau de correspondance
- Filtrage par secteur d'activité, budget et statut
- Recommandations de ciblage par catégorie 
- Gestion des interactions (consultation de profil, envoi de messages)
- Suivi des activités des prospects

## Configuration de la base de données Supabase

Les tables Supabase nécessaires au fonctionnement de ce module ont déjà été créées selon le schéma suivant :

```sql
-- Table des prospects
CREATE TABLE prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT,
  avatar TEXT,
  location TEXT,
  industry_interest TEXT NOT NULL,
  budget TEXT NOT NULL,
  match_score INTEGER NOT NULL,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_type TEXT,
  contacted BOOLEAN DEFAULT FALSE,
  notes TEXT,
  creator_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des activités des prospects
CREATE TABLE prospect_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES users(id),
  activity_type TEXT NOT NULL, -- 'profile_view', 'agent_view', 'contact_creator', 'platform_join'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des recommandations par catégorie
CREATE TABLE category_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  prospect_count INTEGER NOT NULL,
  match_score INTEGER NOT NULL,
  avg_budget TEXT,
  creator_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Données de test

Pour ajouter des données de test à votre base de données, utilisez le script `test-data.js` :

1. Assurez-vous d'avoir les variables d'environnement Supabase configurées
2. Exécutez la commande suivante en remplaçant `USER_ID` par l'ID de l'utilisateur créateur :

```bash
node app/dashboard/creator/prospection/test-data.js USER_ID
```

Si vous n'indiquez pas d'ID utilisateur, un ID aléatoire sera généré.

## Structure du code

- `page.tsx` : Page serveur qui utilise le composant client
- `ProspectionClient.tsx` : Composant principal avec la logique et l'interface
- `ProspectRow.tsx` : Composant pour afficher une ligne de prospect dans le tableau
- `ProspectionFilters.tsx` : Filtres de recherche et tri
- `RecommendationCard.tsx` : Carte de recommandation par catégorie
- `ContactModal.tsx` : Modal pour contacter un prospect
- `Pagination.tsx` : Composant de pagination

## Comment ça marche

1. Les données sont chargées depuis Supabase au chargement de la page
2. Les prospects sont filtrés selon les critères sélectionnés
3. Les actions (consultation de profil, contact) sont enregistrées dans la base de données
4. Les recommandations de ciblage sont générées automatiquement grâce aux triggers Supabase

## Développement futur

Fonctionnalités qui pourraient être ajoutées :

- Intégration avec un système de CRM
- Export des prospects en CSV
- Formulaire d'ajout manuel de prospects
- Graphiques d'analyse des taux de conversion
- Intégration avec des sources de données externes
