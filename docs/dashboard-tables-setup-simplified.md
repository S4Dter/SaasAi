# Mise à jour de la configuration pour le tableau de bord créateur

Ce document contient le SQL nécessaire pour compléter votre configuration Supabase existante afin de garantir le bon fonctionnement du tableau de bord créateur. Puisque vous avez déjà la plupart des tables nécessaires, ce guide se concentre uniquement sur les éléments manquants.

## Tables existantes identifiées

Vous avez confirmé avoir les tables suivantes :
- agent_conversions
- agent_recommendations
- agent_revenue
- agent_views
- agents
- community_post_likes
- community_posts
- contacts
- debug_logs
- enterprise_contacts
- enterprises
- favorites
- purchased_agents
- users

## Configuration additionnelle nécessaire

Voici le SQL à exécuter pour ajouter les politiques de sécurité RLS manquantes, les triggers et les index nécessaires pour optimiser les performances :

```sql
-- Activer RLS (Row Level Security) pour toutes les tables s'il n'est pas déjà activé
DO $$
DECLARE
  tables_to_check TEXT[] := ARRAY['agents', 'agent_views', 'agent_conversions', 'agent_revenue', 'contacts', 'agent_recommendations'];
  curr_table TEXT;
BEGIN
  FOREACH curr_table IN ARRAY tables_to_check
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', curr_table);
    RAISE NOTICE 'RLS activé pour %', curr_table;
  END LOOP;
END $$;

-- Créer des politiques pour agents (en vérifiant si elles n'existent pas déjà)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agents' AND policyname = 'Les utilisateurs peuvent voir tous les agents') THEN
    CREATE POLICY "Les utilisateurs peuvent voir tous les agents" 
      ON public.agents FOR SELECT USING (true);
    RAISE NOTICE 'Politique créée: Les utilisateurs peuvent voir tous les agents';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agents' AND policyname = 'Les créateurs peuvent modifier leurs propres agents') THEN
    CREATE POLICY "Les créateurs peuvent modifier leurs propres agents" 
      ON public.agents FOR ALL USING (auth.uid() = creator_id);
    RAISE NOTICE 'Politique créée: Les créateurs peuvent modifier leurs propres agents';
  END IF;
END $$;

-- Créer des politiques pour agent_views
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_views' AND policyname = 'Les créateurs peuvent voir les vues de leurs agents') THEN
    CREATE POLICY "Les créateurs peuvent voir les vues de leurs agents" 
      ON public.agent_views FOR SELECT USING (auth.uid() = creator_id);
    RAISE NOTICE 'Politique créée: Les créateurs peuvent voir les vues de leurs agents';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_views' AND policyname = 'Le système peut mettre à jour les vues') THEN
    CREATE POLICY "Le système peut mettre à jour les vues" 
      ON public.agent_views FOR ALL USING (true);
    RAISE NOTICE 'Politique créée: Le système peut mettre à jour les vues';
  END IF;
END $$;

-- Créer des politiques pour agent_conversions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_conversions' AND policyname = 'Les créateurs peuvent voir les conversions de leurs agents') THEN
    CREATE POLICY "Les créateurs peuvent voir les conversions de leurs agents" 
      ON public.agent_conversions FOR SELECT USING (auth.uid() = creator_id);
    RAISE NOTICE 'Politique créée: Les créateurs peuvent voir les conversions de leurs agents';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_conversions' AND policyname = 'Le système peut mettre à jour les conversions') THEN
    CREATE POLICY "Le système peut mettre à jour les conversions" 
      ON public.agent_conversions FOR ALL USING (true);
    RAISE NOTICE 'Politique créée: Le système peut mettre à jour les conversions';
  END IF;
END $$;

-- Créer des politiques pour agent_revenue
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_revenue' AND policyname = 'Les créateurs peuvent voir les revenus de leurs agents') THEN
    CREATE POLICY "Les créateurs peuvent voir les revenus de leurs agents" 
      ON public.agent_revenue FOR SELECT USING (auth.uid() = creator_id);
    RAISE NOTICE 'Politique créée: Les créateurs peuvent voir les revenus de leurs agents';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_revenue' AND policyname = 'Le système peut mettre à jour les revenus') THEN
    CREATE POLICY "Le système peut mettre à jour les revenus" 
      ON public.agent_revenue FOR ALL USING (true);
    RAISE NOTICE 'Politique créée: Le système peut mettre à jour les revenus';
  END IF;
END $$;

-- Créer des politiques pour contacts
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contacts' AND policyname = 'Les créateurs peuvent voir les contacts pour leurs agents') THEN
    CREATE POLICY "Les créateurs peuvent voir les contacts pour leurs agents" 
      ON public.contacts FOR SELECT USING (auth.uid() = creator_id);
    RAISE NOTICE 'Politique créée: Les créateurs peuvent voir les contacts pour leurs agents';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contacts' AND policyname = 'Les entreprises peuvent voir leurs propres contacts') THEN
    CREATE POLICY "Les entreprises peuvent voir leurs propres contacts" 
      ON public.contacts FOR SELECT USING (auth.uid() = enterprise_id);
    RAISE NOTICE 'Politique créée: Les entreprises peuvent voir leurs propres contacts';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contacts' AND policyname = 'Les entreprises peuvent créer des contacts') THEN
    CREATE POLICY "Les entreprises peuvent créer des contacts" 
      ON public.contacts FOR INSERT WITH CHECK (auth.uid() = enterprise_id);
    RAISE NOTICE 'Politique créée: Les entreprises peuvent créer des contacts';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contacts' AND policyname = 'Les créateurs peuvent mettre à jour le statut des contacts') THEN
    CREATE POLICY "Les créateurs peuvent mettre à jour le statut des contacts" 
      ON public.contacts FOR UPDATE USING (auth.uid() = creator_id);
    RAISE NOTICE 'Politique créée: Les créateurs peuvent mettre à jour le statut des contacts';
  END IF;
END $$;

-- Créer des politiques pour agent_recommendations
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_recommendations' AND policyname = 'Les créateurs peuvent voir les recommandations de leurs agents') THEN
    CREATE POLICY "Les créateurs peuvent voir les recommandations de leurs agents" 
      ON public.agent_recommendations FOR SELECT USING (auth.uid() = creator_id);
    RAISE NOTICE 'Politique créée: Les créateurs peuvent voir les recommandations de leurs agents';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_recommendations' AND policyname = 'Les entreprises peuvent voir leurs propres recommandations') THEN
    CREATE POLICY "Les entreprises peuvent voir leurs propres recommandations" 
      ON public.agent_recommendations FOR SELECT USING (auth.uid() = enterprise_id);
    RAISE NOTICE 'Politique créée: Les entreprises peuvent voir leurs propres recommandations';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_recommendations' AND policyname = 'Le système peut créer des recommandations') THEN
    CREATE POLICY "Le système peut créer des recommandations" 
      ON public.agent_recommendations FOR INSERT WITH CHECK (true);
    RAISE NOTICE 'Politique créée: Le système peut créer des recommandations';
  END IF;
END $$;

-- Vérifier si la fonction updated_at existe déjà et la créer si nécessaire
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_updated_at') THEN
    CREATE OR REPLACE FUNCTION public.handle_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    RAISE NOTICE 'Fonction handle_updated_at créée';
  END IF;
END $$;

-- Vérifier et créer les triggers manquants
DO $$
DECLARE
  trigger_exists boolean;
BEGIN
  -- Trigger pour agents
  SELECT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at' AND tgrelid = 'public.agents'::regclass) INTO trigger_exists;
  IF NOT trigger_exists THEN
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.agents
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
    RAISE NOTICE 'Trigger set_updated_at créé pour agents';
  END IF;
  
  -- Trigger pour contacts
  SELECT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at' AND tgrelid = 'public.contacts'::regclass) INTO trigger_exists;
  IF NOT trigger_exists THEN
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.contacts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
    RAISE NOTICE 'Trigger set_updated_at créé pour contacts';
  END IF;
END $$;

-- Vérifier et créer les index manquants
DO $$
DECLARE
  index_exists boolean;
BEGIN
  -- Index pour agents
  SELECT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'agents_creator_id_idx') INTO index_exists;
  IF NOT index_exists THEN
    CREATE INDEX IF NOT EXISTS agents_creator_id_idx ON public.agents(creator_id);
    RAISE NOTICE 'Index agents_creator_id_idx créé';
  END IF;
  
  -- Index pour agent_views
  SELECT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'agent_views_creator_id_idx') INTO index_exists;
  IF NOT index_exists THEN
    CREATE INDEX IF NOT EXISTS agent_views_creator_id_idx ON public.agent_views(creator_id);
    RAISE NOTICE 'Index agent_views_creator_id_idx créé';
  END IF;
  
  -- Index pour agent_conversions
  SELECT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'agent_conversions_creator_id_idx') INTO index_exists;
  IF NOT index_exists THEN
    CREATE INDEX IF NOT EXISTS agent_conversions_creator_id_idx ON public.agent_conversions(creator_id);
    RAISE NOTICE 'Index agent_conversions_creator_id_idx créé';
  END IF;
  
  -- Index pour agent_revenue
  SELECT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'agent_revenue_creator_id_idx') INTO index_exists;
  IF NOT index_exists THEN
    CREATE INDEX IF NOT EXISTS agent_revenue_creator_id_idx ON public.agent_revenue(creator_id);
    RAISE NOTICE 'Index agent_revenue_creator_id_idx créé';
  END IF;
  
  -- Index pour contacts
  SELECT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'contacts_creator_id_idx') INTO index_exists;
  IF NOT index_exists THEN
    CREATE INDEX IF NOT EXISTS contacts_creator_id_idx ON public.contacts(creator_id);
    RAISE NOTICE 'Index contacts_creator_id_idx créé';
  END IF;
  
  SELECT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'contacts_enterprise_id_idx') INTO index_exists;
  IF NOT index_exists THEN
    CREATE INDEX IF NOT EXISTS contacts_enterprise_id_idx ON public.contacts(enterprise_id);
    RAISE NOTICE 'Index contacts_enterprise_id_idx créé';
  END IF;
  
  -- Index pour agent_recommendations
  SELECT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'agent_recommendations_creator_id_idx') INTO index_exists;
  IF NOT index_exists THEN
    CREATE INDEX IF NOT EXISTS agent_recommendations_creator_id_idx ON public.agent_recommendations(creator_id);
    RAISE NOTICE 'Index agent_recommendations_creator_id_idx créé';
  END IF;
END $$;
```

## Exemple d'insertion de données de test

Pour tester le tableau de bord avec des données, vous pouvez utiliser ce script pour ajouter un agent de test et ses statistiques associées :

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
    'agent-test-' || (floor(random() * 1000))::text, -- Suffixe aléatoire pour éviter les doublons de slug
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
    
    RAISE NOTICE 'Données de test créées pour l''agent %', new_agent_id;
END $$;
```

## Notes importantes

1. **Exécution du script** : Ce script est conçu pour fonctionner même si certaines politiques, déclencheurs ou index existent déjà, grâce aux vérifications préalables.

2. **Données des utilisateurs** : Assurez-vous que vos utilisateurs ont un rôle "creator" défini dans leurs métadonnées ou dans la table users. Cette information est utilisée par les politiques RLS pour contrôler l'accès aux données.

3. **Vérification des tables** : Nous partons du principe que les structures de tables que vous avez mentionnées sont compatibles avec le code de l'application. Si vous rencontrez des erreurs concernant des colonnes manquantes, veuillez vérifier que vos tables contiennent tous les champs nécessaires.
