/**
 * Ce fichier contient des fonctions pour gérer la sécurité dans Supabase
 * et notamment les règles de Row Level Security (RLS)
 * 
 * Ces fonctions sont à exécuter manuellement sur la console Supabase SQL
 */

/**
 * Règles de sécurité RLS pour la table users
 * 
 * Politiques:
 * - Seuls les utilisateurs authentifiés peuvent lire leurs propres données
 * - Lecture des champs de base pour tous (nom, rôle) - utile pour l'affichage des créateurs d'agents
 * - Seul l'utilisateur concerné peut modifier ses propres données
 * - Possibilité d'insérer lors de l'inscription (pour auth hooks)
 */
export const usersSecurityRules = `
-- Activer RLS sur la table users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes (si elles existent)
DROP POLICY IF EXISTS "Les utilisateurs peuvent lire leurs propres données" ON users;
DROP POLICY IF EXISTS "Lecture de base pour tous" ON users;
DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leurs propres données" ON users;
DROP POLICY IF EXISTS "Insertion possible lors de l'inscription" ON users;

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

-- 4. Insertion possible lors de l'inscription
CREATE POLICY "Insertion possible lors de l'inscription"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);
`;

/**
 * Règles de sécurité RLS pour la table favorites
 * 
 * Politiques:
 * - Lecture des favoris uniquement par leur propriétaire
 * - Modification/suppression uniquement par le propriétaire
 * - Insertion uniquement pour ses propres favoris
 */
export const favoritesSecurityRules = `
-- Activer RLS sur la table favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes (si elles existent)
DROP POLICY IF EXISTS "Les utilisateurs peuvent lire leurs propres favoris" ON favorites;
DROP POLICY IF EXISTS "Les utilisateurs peuvent modifier leurs propres favoris" ON favorites;
DROP POLICY IF EXISTS "Les utilisateurs peuvent supprimer leurs propres favoris" ON favorites;
DROP POLICY IF EXISTS "Les utilisateurs peuvent ajouter des favoris" ON favorites;

-- Créer les politiques
-- 1. Lecture de ses propres favoris
CREATE POLICY "Les utilisateurs peuvent lire leurs propres favoris"
ON favorites FOR SELECT
USING (auth.uid() = user_id);

-- 2. Modification de ses propres favoris
CREATE POLICY "Les utilisateurs peuvent modifier leurs propres favoris"
ON favorites FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Suppression de ses propres favoris
CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres favoris"
ON favorites FOR DELETE
USING (auth.uid() = user_id);

-- 4. Ajout de favoris (uniquement pour soi-même)
CREATE POLICY "Les utilisateurs peuvent ajouter des favoris"
ON favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);
`;
