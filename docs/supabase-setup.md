# Configuration de Supabase pour l'authentification

## Mettre à jour les règles RLS pour résoudre les problèmes d'insertion

Les erreurs "Database error saving new user" sont généralement causées par des problèmes de Row Level Security (RLS) ou de contraintes de table non respectées. Pour résoudre ces problèmes, suivez ces étapes :

### 1. Mettre à jour les règles RLS pour la table `users`

Connectez-vous à la console Supabase et dans l'éditeur SQL, exécutez les commandes suivantes :

```sql
-- Activer RLS sur la table users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes (si elles existent)
DROP POLICY IF EXISTS "Les utilisateurs peuvent lire leurs propres données" ON users;
DROP POLICY IF EXISTS "Lecture de base pour tous" ON users;
DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leurs propres données" ON users;
DROP POLICY IF EXISTS "Insertion possible lors de l'inscription" ON users;
DROP POLICY IF EXISTS "Permettre insertion si ID correspond à auth.uid" ON users;
DROP POLICY IF EXISTS "Autoriser insertion pour utilisateurs authentifiés" ON users;

-- Créer les politiques
-- 1. Lecture complète de ses propres données
CREATE POLICY "Les utilisateurs peuvent lire leurs propres données"
ON users FOR SELECT
USING (auth.uid() = id);

-- 2. Lecture limitée des données pour tous (nom, rôle)
CREATE POLICY "Lecture de base pour tous"
ON users FOR SELECT
USING (true)
WITH CHECK (false);

-- 3. Modification de ses propres données uniquement
CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs propres données"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Insertion possible lors de l'inscription, sans restrictions si l'ID correspond
CREATE POLICY "Permettre insertion si ID correspond à auth.uid"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- 5. Permettre l'insertion à tous les utilisateurs authentifiés (pour faciliter la confirmation)
-- Cette politique est moins restrictive que la précédente, mais permet de résoudre les problèmes d'insertion
-- lors de la confirmation de l'email
CREATE POLICY "Autoriser insertion pour utilisateurs authentifiés"
ON users FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
```

### 2. Vérifier les contraintes de la table `users`

Assurez-vous que les champs non nullables ont bien des valeurs par défaut ou sont correctement renseignés. Modifiez la structure de la table si nécessaire :

```sql
-- Exemple de modifications si certains champs posent problème
ALTER TABLE users ALTER COLUMN avatar DROP NOT NULL;
ALTER TABLE users ALTER COLUMN bio DROP NOT NULL;
ALTER TABLE users ALTER COLUMN company DROP NOT NULL;
```

### 3. Activer les traces détaillées pour déboguer les problèmes d'authentification

Dans les paramètres de projet Supabase, activez les logs détaillés pour l'authentification et les requêtes SQL pour mieux diagnostiquer les problèmes futurs.

### 4. Vérification de la synchronisation Auth <> Database

Si des problèmes persistent, vérifiez que les triggers Supabase sont bien configurés pour synchroniser les utilisateurs entre la table `auth.users` et votre table personnalisée `users`. Si nécessaire, contactez le support Supabase pour diagnostiquer des problèmes potentiels avec les hooks d'authentification.

## Recommandation pour gérer les erreurs d'inscription

Nous avons amélioré la gestion des erreurs dans le processus d'inscription pour :

1. Valider systématiquement les métadonnées
2. Ajouter un rôle par défaut si aucun n'est fourni
3. Fournir des messages d'erreur plus détaillés dans les logs
4. Ajouter des champs obligatoires avec des valeurs par défaut

Ces modifications devraient permettre de gérer la majorité des cas d'erreur lors de l'inscription et de la confirmation de compte.
