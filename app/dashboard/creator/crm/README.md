# Module CRM et Tableau de Prospection

Ce module permet aux créateurs d'agents IA de gérer leurs prospects et de générer des emails personnalisés via n8n.

## Fonctionnalités

- Affichage des prospects dans un tableau dynamique
- Filtrage par secteur, budget et statut d'email
- Génération d'emails personnalisés basés sur les caractéristiques des prospects
- Intégration avec n8n pour la génération de contenu d'email
- Suivi des emails envoyés

## Base de données Supabase

La table CRM est configurée dans Supabase selon le schéma suivant :

```sql
CREATE TABLE crm (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prospect_name TEXT NOT NULL,
  secteur TEXT NOT NULL,
  budget_estime TEXT NOT NULL,
  taille_entreprise TEXT NOT NULL,
  besoins TEXT,
  compatibilite INTEGER NOT NULL DEFAULT 0, -- Pourcentage de compatibilité avec l'agent IA
  statut_email TEXT NOT NULL DEFAULT 'non_envoye', -- non_envoye, en_attente, envoye, ouvert, repondu
  email_envoye BOOLEAN NOT NULL DEFAULT FALSE,
  email_contenu TEXT, -- Contenu de l'email généré
  email_date TIMESTAMP WITH TIME ZONE, -- Date d'envoi de l'email
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Pour configurer cette table dans votre base de données, exécutez le script SQL dans `docs/crm-database-schema.sql`.

## Intégration avec n8n

### Prérequis

- Installer n8n : `npm install -g n8n`
- Lancer n8n : `n8n start`

### Configuration du workflow n8n

1. Créer un nouveau workflow dans n8n
2. Ajouter un nœud Webhook comme déclencheur
3. Configurer le webhook pour accepter des requêtes POST avec les paramètres du prospect et de l'agent
4. Ajouter un nœud Code avec la logique de génération d'email basée sur les paramètres reçus
5. Configurer le nœud de réponse pour renvoyer l'email généré

### Variables d'environnement

Pour l'intégration avec n8n, ajoutez ces variables d'environnement à votre projet :

```
NEXT_PUBLIC_N8N_BASE_URL=http://localhost:5678
NEXT_PUBLIC_N8N_EMAIL_WORKFLOW_ID=email-generation
```

## Structure des fichiers

- `CrmClient.tsx` : Composant principal avec la logique et l'interface
- `CrmFilters.tsx` : Filtres de recherche et tri
- `CrmProspectRow.tsx` : Composant pour afficher une ligne de prospect dans le tableau
- `EmailModal.tsx` : Modal pour générer un email pour un prospect
- `EmailListModal.tsx` : Modal pour afficher la liste des emails envoyés
- `test-data.js` : Script pour générer des données de test

## Données de test

Pour ajouter des données de test à votre base de données, utilisez le script `test-data.js` :

```bash
node app/dashboard/creator/crm/test-data.js USER_ID
```

Si vous n'indiquez pas d'ID utilisateur, un ID aléatoire sera généré.

## Services et utilitaires

- `lib/services/n8n-service.ts` : Service pour l'intégration avec n8n
- `types/crm.ts` : Types TypeScript pour le module CRM

## Utilisation

1. Accédez au tableau de bord créateur via le dashboard
2. Dans la section Prospection, consultez la liste des prospects
3. Utilisez les filtres pour trouver des prospects spécifiques
4. Cliquez sur "Générer l'email" pour créer un email personnalisé pour un prospect
5. Sélectionnez un agent IA adapté aux besoins du prospect
6. Vérifiez l'email généré et modifiez-le si nécessaire
7. Marquez l'email comme envoyé lorsque vous l'avez envoyé manuellement
8. Consultez la liste des emails envoyés pour suivre vos communications

## Fonctionnalités futures

- Intégration de l'envoi d'email automatique
- Suivi des taux d'ouverture et de réponse
- Rappels automatiques pour les prospects sans réponse
- Analytics avancés sur les performances de prospection
- Importation/exportation CSV des prospects
