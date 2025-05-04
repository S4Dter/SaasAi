# Configuration des tables nécessaires pour le tableau de bord créateur

Ce document contient le schéma SQL pour créer toutes les tables nécessaires au bon fonctionnement du tableau de bord créateur.

## Tables Requises

D'après l'analyse du code dans `lib/hooks/useCreatorDashboard.ts`, les tables suivantes sont requises pour le tableau de bord créateur :

1. `agents` - Les agents créés par l'utilisateur
2. `agent_views` - Les vues de chaque agent
3. `agent_conversions` - Les conversions réalisées par agent
4. `agent_revenue` - Les revenus générés par agent
5. `contacts` - Les contacts établis via les agents
6. `agent_recommendations` - Les recommandations d'agents

## Schéma SQL

```sql
-- Table pour stocker les agents
CREATE TABLE public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(280),
    category VARCHAR NOT NULL,
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pricing JSONB NOT NULL DEFAULT '{"model": "subscription", "startingPrice": 0, "currency": "EUR"}',
    featured BOOLEAN NOT NULL DEFAULT false,
    logo_url VARCHAR,
    integrations TEXT[] DEFAULT '{}',
    demo_url VARCHAR,
    demo_video_url VARCHAR,
    screenshots TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS (Row Level Security) pour protéger les données
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Créer des politiques pour agents
CREATE POLICY "Les utilisateurs peuvent voir tous les agents" 
    ON public.agents FOR SELECT USING (true);
CREATE POLICY "Les créateurs peuvent modifier leurs propres agents" 
    ON public.agents FOR ALL USING (auth.uid() = creator_id);

-- Table pour les vues d'agents
CREATE TABLE public.agent_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    count INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS pour agent_views
ALTER TABLE public.agent_views ENABLE ROW LEVEL SECURITY;

-- Créer des politiques pour agent_views
CREATE POLICY "Les créateurs peuvent voir les vues de leurs agents" 
    ON public.agent_views FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Le système peut mettre à jour les vues" 
    ON public.agent_views FOR ALL USING (true);

-- Table pour les conversions d'agents
CREATE TABLE public.agent_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    count INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS pour agent_conversions
ALTER TABLE public.agent_conversions ENABLE ROW LEVEL SECURITY;

-- Créer des politiques pour agent_conversions
CREATE POLICY "Les créateurs peuvent voir les conversions de leurs agents" 
    ON public.agent_conversions FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Le système peut mettre à jour les conversions" 
    ON public.agent_conversions FOR ALL USING (true);

-- Table pour les revenus d'agents
CREATE TABLE public.agent_revenue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS pour agent_revenue
ALTER TABLE public.agent_revenue ENABLE ROW LEVEL SECURITY;

-- Créer des politiques pour agent_revenue
CREATE POLICY "Les créateurs peuvent voir les revenus de leurs agents" 
    ON public.agent_revenue FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Le système peut mettre à jour les revenus" 
    ON public.agent_revenue FOR ALL USING (true);

-- Table pour stocker les contacts des entreprises vers les créateurs
CREATE TABLE public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES auth.users(id),
    enterprise_id UUID NOT NULL REFERENCES auth.users(id),
    message TEXT NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS pour contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Créer des politiques pour contacts
CREATE POLICY "Les créateurs peuvent voir les contacts pour leurs agents" 
    ON public.contacts FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Les entreprises peuvent voir leurs propres contacts" 
    ON public.contacts FOR SELECT USING (auth.uid() = enterprise_id);
CREATE POLICY "Les entreprises peuvent créer des contacts" 
    ON public.contacts FOR INSERT WITH CHECK (auth.uid() = enterprise_id);
CREATE POLICY "Les créateurs peuvent mettre à jour le statut des contacts" 
    ON public.contacts FOR UPDATE USING (auth.uid() = creator_id);

-- Table pour les recommandations d'agents
CREATE TABLE public.agent_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES auth.users(id),
    enterprise_id UUID NOT NULL REFERENCES auth.users(id),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS pour agent_recommendations
ALTER TABLE public.agent_recommendations ENABLE ROW LEVEL SECURITY;

-- Créer des politiques pour agent_recommendations
CREATE POLICY "Les créateurs peuvent voir les recommandations de leurs agents" 
    ON public.agent_recommendations FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Les entreprises peuvent voir leurs propres recommandations" 
    ON public.agent_recommendations FOR SELECT USING (auth.uid() = enterprise_id);
CREATE POLICY "Le système peut créer des recommandations" 
    ON public.agent_recommendations FOR INSERT WITH CHECK (true);

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour la table agents
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.agents
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Trigger pour la table contacts
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.contacts
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Index pour améliorer les performances
CREATE INDEX agents_creator_id_idx ON public.agents(creator_id);
CREATE INDEX agent_views_creator_id_idx ON public.agent_views(creator_id);
CREATE INDEX agent_conversions_creator_id_idx ON public.agent_conversions(creator_id);
CREATE INDEX agent_revenue_creator_id_idx ON public.agent_revenue(creator_id);
CREATE INDEX contacts_creator_id_idx ON public.contacts(creator_id);
CREATE INDEX contacts_enterprise_id_idx ON public.contacts(enterprise_id);
CREATE INDEX agent_recommendations_creator_id_idx ON public.agent_recommendations(creator_id);
```

## Insertion de données de test

Pour tester le tableau de bord avec des données, vous pouvez exécuter le script SQL suivant après avoir créé les tables :

```sql
-- Insérer un agent de test pour votre utilisateur
-- Remplacez 'VOTRE_USER_ID' par votre ID utilisateur réel
INSERT INTO public.agents (
    name, 
    slug, 
    description, 
    short_description, 
    category, 
    creator_id, 
    pricing, 
    featured, 
    logo_url, 
    integrations
) VALUES (
    'Agent de test', 
    'agent-test', 
    'Ceci est un agent de test pour vérifier le fonctionnement du tableau de bord.', 
    'Agent de test pour le tableau de bord', 
    'marketing', 
    'VOTRE_USER_ID', 
    '{"model": "subscription", "startingPrice": 99, "currency": "EUR"}', 
    true, 
    '/images/agents/default.png', 
    ARRAY['api', 'widget']
);

-- Récupérer l'ID du nouvel agent
DO $$
DECLARE
    new_agent_id UUID;
BEGIN
    SELECT id INTO new_agent_id FROM public.agents 
    WHERE creator_id = 'VOTRE_USER_ID' ORDER BY created_at DESC LIMIT 1;
    
    -- Insérer des vues pour cet agent
    INSERT INTO public.agent_views (agent_id, creator_id, count)
    VALUES (new_agent_id, 'VOTRE_USER_ID', 120);
    
    -- Insérer des conversions pour cet agent
    INSERT INTO public.agent_conversions (agent_id, creator_id, count)
    VALUES (new_agent_id, 'VOTRE_USER_ID', 5);
    
    -- Insérer des revenus pour cet agent
    INSERT INTO public.agent_revenue (agent_id, creator_id, amount)
    VALUES (new_agent_id, 'VOTRE_USER_ID', 495);
END $$;
```

## Exécution du schéma SQL

Pour exécuter ce schéma SQL dans Supabase :

1. Connectez-vous à votre tableau de bord Supabase
2. Allez dans la section "SQL Editor"
3. Créez un nouveau script
4. Copiez et collez le schéma SQL ci-dessus
5. Exécutez le script

## Notes importantes

- Assurez-vous que votre base de données Supabase a correctement configuré l'authentification
- L'utilisateur doit avoir un rôle "creator" défini dans les métadonnées ou dans la table users
- La sécurité au niveau des lignes (RLS) est activée pour toutes les tables, ce qui signifie que les utilisateurs ne peuvent voir que les données qui leur appartiennent
