-- Schema pour la fonctionnalité de communauté

-- Table des posts communautaires
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour accélérer les requêtes par utilisateur et date
CREATE INDEX IF NOT EXISTS community_posts_user_id_idx ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS community_posts_created_at_idx ON community_posts(created_at DESC);

-- Table des likes de posts
CREATE TABLE IF NOT EXISTS community_post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id) -- Empêche un utilisateur de liker plusieurs fois le même post
);

-- Index pour accélérer les requêtes de comptage de likes
CREATE INDEX IF NOT EXISTS community_post_likes_post_id_idx ON community_post_likes(post_id);
CREATE INDEX IF NOT EXISTS community_post_likes_user_id_idx ON community_post_likes(user_id);

-- Politique RLS (Row Level Security) pour les posts communautaires
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut voir les posts
CREATE POLICY "Les posts sont visibles par tous" ON community_posts
  FOR SELECT USING (true);

-- Seul l'auteur du post peut le modifier ou le supprimer
CREATE POLICY "Les utilisateurs peuvent modifier leurs propres posts" ON community_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres posts" ON community_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Seuls les utilisateurs authentifiés peuvent créer des posts
CREATE POLICY "Les utilisateurs authentifiés peuvent créer des posts" ON community_posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Politique RLS pour les likes de posts
ALTER TABLE community_post_likes ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut voir les likes
CREATE POLICY "Les likes sont visibles par tous" ON community_post_likes
  FOR SELECT USING (true);

-- Seul l'auteur du like peut le supprimer
CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres likes" ON community_post_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Seuls les utilisateurs authentifiés peuvent créer des likes
CREATE POLICY "Les utilisateurs authentifiés peuvent créer des likes" ON community_post_likes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour le timestamp updated_at
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON community_posts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
