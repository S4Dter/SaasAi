-- Schéma de la base de données pour le CRM
-- Table crm : Contient les prospects
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

-- Index pour améliorer les performances de recherche
CREATE INDEX crm_user_id_idx ON crm (user_id);
CREATE INDEX crm_secteur_idx ON crm (secteur);
CREATE INDEX crm_compatibilite_idx ON crm (compatibilite);
CREATE INDEX crm_email_envoye_idx ON crm (email_envoye);

-- Fonction pour mettre à jour le champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour le champ updated_at automatiquement
CREATE TRIGGER update_crm_updated_at
BEFORE UPDATE ON crm
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Vue pour joindre les prospects CRM avec les infos utilisateurs
CREATE VIEW crm_prospects_view AS
SELECT 
  c.*,
  u.email as user_email,
  u.user_metadata->'full_name' as user_name
FROM crm c
JOIN auth.users u ON c.user_id = u.id;

-- Politique de sécurité RLS pour la table crm
-- Seul l'utilisateur propriétaire des données peut les voir et les modifier
CREATE POLICY "Les utilisateurs peuvent voir leurs propres prospects"
  ON crm FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer leurs propres prospects"
  ON crm FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs propres prospects"
  ON crm FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres prospects"
  ON crm FOR DELETE
  USING (auth.uid() = user_id);

-- Activer la sécurité niveau ligne (RLS)
ALTER TABLE crm ENABLE ROW LEVEL SECURITY;
