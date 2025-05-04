-- Schema complet pour AgentMarket - Configuration Supabase

-- ===============================
-- Tables et structure
-- ===============================

-- 1. Table `users` (liée à auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('creator', 'enterprise', 'admin')),
  avatar TEXT,
  company TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Trigger pour mettre à jour le timestamp
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION set_updated_timestamp();

-- 2. Table `agents`
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('customer-service', 'marketing', 'sales', 'hr', 'finance', 'legal', 'IT', 'other')),
  creator_id UUID NOT NULL REFERENCES public.users(id),
  pricing JSONB NOT NULL,
  featured BOOLEAN DEFAULT false,
  logo_url TEXT,
  integrations TEXT[] DEFAULT '{}',
  demo_url TEXT,
  demo_video_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index pour les recherches
CREATE INDEX agents_name_idx ON public.agents USING GIN (name gin_trgm_ops);
CREATE INDEX agents_description_idx ON public.agents USING GIN (description gin_trgm_ops);
CREATE INDEX agents_category_idx ON public.agents(category);
CREATE INDEX agents_creator_idx ON public.agents(creator_id);

-- 3. Table `favorites`
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  agent_id UUID NOT NULL REFERENCES public.agents(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, agent_id)
);

-- 4. Table `agent_views`
CREATE TABLE public.agent_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id),
  creator_id UUID NOT NULL REFERENCES public.users(id),
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX agent_views_agent_idx ON public.agent_views(agent_id);
CREATE INDEX agent_views_creator_idx ON public.agent_views(creator_id);

-- 5. Table `agent_conversions`
CREATE TABLE public.agent_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id),
  creator_id UUID NOT NULL REFERENCES public.users(id),
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX agent_conversions_agent_idx ON public.agent_conversions(agent_id);
CREATE INDEX agent_conversions_creator_idx ON public.agent_conversions(creator_id);

-- 6. Table `agent_revenue`
CREATE TABLE public.agent_revenue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id),
  creator_id UUID NOT NULL REFERENCES public.users(id),
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX agent_revenue_agent_idx ON public.agent_revenue(agent_id);
CREATE INDEX agent_revenue_creator_idx ON public.agent_revenue(creator_id);

-- 7. Table `contacts`
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id),
  enterprise_id UUID NOT NULL REFERENCES public.users(id),
  creator_id UUID NOT NULL REFERENCES public.users(id),
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'contacted', 'meeting-scheduled', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX contacts_agent_idx ON public.contacts(agent_id);
CREATE INDEX contacts_enterprise_idx ON public.contacts(enterprise_id);
CREATE INDEX contacts_creator_idx ON public.contacts(creator_id);

-- 8. Table `agent_recommendations`
CREATE TABLE public.agent_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id),
  enterprise_id UUID NOT NULL REFERENCES public.users(id),
  creator_id UUID NOT NULL REFERENCES public.users(id),
  reason TEXT,
  match_score INTEGER DEFAULT 0 CHECK (match_score BETWEEN 0 AND 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX agent_recommendations_agent_idx ON public.agent_recommendations(agent_id);
CREATE INDEX agent_recommendations_enterprise_idx ON public.agent_recommendations(enterprise_id);

-- ===============================
-- Fonctions SQL utilitaires
-- ===============================

-- Fonction pour mettre à jour le timestamp automatiquement
CREATE OR REPLACE FUNCTION set_updated_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===============================
-- Politiques de sécurité RLS
-- ===============================

-- Pour la table `users`
-- Activer RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes (si nécessaire)
DROP POLICY IF EXISTS "Les utilisateurs peuvent lire leurs propres données" ON users;
DROP POLICY IF EXISTS "Lecture de base pour tous" ON users;
DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leurs propres données" ON users;
DROP POLICY IF EXISTS "Permettre insertion si ID correspond à auth.uid" ON users;
DROP POLICY IF EXISTS "Autoriser insertion pour utilisateurs authentifiés" ON users;

-- Créer les politiques
-- 1. Lecture complète de ses propres données
CREATE POLICY "Les utilisateurs peuvent lire leurs propres données"
ON users FOR SELECT
USING (auth.uid() = id);

-- 2. Lecture limitée des données pour tous
CREATE POLICY "Lecture de base pour tous"
ON users FOR SELECT
USING (true)
WITH CHECK (false);

-- 3. Modification de ses propres données uniquement
CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs propres données"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Insertion si ID correspond
CREATE POLICY "Permettre insertion si ID correspond à auth.uid"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- 5. Insertion pour utilisateurs authentifiés
CREATE POLICY "Autoriser insertion pour utilisateurs authentifiés"
ON users FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Pour la table `agents`
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture
CREATE POLICY "Tout le monde peut lire les agents"
ON agents FOR SELECT
USING (true);

-- Politique pour la création/mise à jour/suppression
CREATE POLICY "Les créateurs peuvent gérer leurs agents"
ON agents FOR ALL
USING (auth.uid() = creator_id)
WITH CHECK (auth.uid() = creator_id);

-- Pour la table `favorites`
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Politique pour lecture/modification/suppression des favoris
CREATE POLICY "Les utilisateurs peuvent gérer leurs favoris"
ON favorites FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Politiques suggérées pour les autres tables (à adapter selon vos besoins)

-- Pour la table `agent_views`
ALTER TABLE agent_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les créateurs peuvent voir les statistiques de leurs agents"
ON agent_views FOR SELECT
USING (auth.uid() = creator_id);

-- Pour la table `agent_conversions`
ALTER TABLE agent_conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les créateurs peuvent voir les conversions de leurs agents"
ON agent_conversions FOR SELECT
USING (auth.uid() = creator_id);

-- Pour la table `agent_revenue`
ALTER TABLE agent_revenue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les créateurs peuvent voir les revenus de leurs agents"
ON agent_revenue FOR SELECT
USING (auth.uid() = creator_id);

-- Pour la table `contacts`
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les créateurs peuvent voir les contacts liés à leurs agents"
ON contacts FOR SELECT
USING (auth.uid() = creator_id);

CREATE POLICY "Les entreprises peuvent voir leurs propres contacts"
ON contacts FOR SELECT
USING (auth.uid() = enterprise_id);

CREATE POLICY "Les entreprises peuvent créer des contacts"
ON contacts FOR INSERT
WITH CHECK (auth.uid() = enterprise_id);

-- Pour la table `agent_recommendations`
ALTER TABLE agent_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les entreprises peuvent voir leurs recommandations"
ON agent_recommendations FOR SELECT
USING (auth.uid() = enterprise_id);

CREATE POLICY "Les créateurs peuvent voir les recommandations de leurs agents"
ON agent_recommendations FOR SELECT
USING (auth.uid() = creator_id);

-- ===============================
-- Extensions PostgreSQL recommandées
-- ===============================
-- Assurez-vous d'activer ces extensions dans votre projet Supabase

-- Pour la recherche de texte avec similarité
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Pour la génération d'UUID
CREATE EXTENSION IF NOT EXISTS uuid-ossp;

-- Pour le support avancé des JWT
CREATE EXTENSION IF NOT EXISTS pgjwt;
