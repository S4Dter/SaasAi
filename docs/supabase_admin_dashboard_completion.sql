-- SQL Script to complete Supabase database for Admin Dashboard
-- This script adds missing tables and functions needed for admin dashboard functionality
-- Run this directly in the Supabase SQL Editor

-- Create admin-specific tables if they don't exist

-- Admin activity log table for tracking admin actions
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL, -- "user_update", "agent_approval", "category_create", etc.
  entity_type VARCHAR(50) NOT NULL, -- "user", "agent", "category", etc.
  entity_id UUID NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_activity_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_entity ON admin_activity_log(entity_type, entity_id);

-- Agent categories table
CREATE TABLE IF NOT EXISTS agent_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Agent reports table
CREATE TABLE IF NOT EXISTS agent_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- "pending", "reviewed", "dismissed", "actioned"
  admin_notes TEXT,
  resolution TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_agent_reports_agent_id ON agent_reports(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_reports_reporter_id ON agent_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_agent_reports_status ON agent_reports(status);

-- System settings table for global configurations
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Agent views for analytics
CREATE TABLE IF NOT EXISTS agent_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  count INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agent_views_agent_id ON agent_views(agent_id);

-- Agent revenue for analytics
CREATE TABLE IF NOT EXISTS agent_revenue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
  transaction_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agent_revenue_agent_id ON agent_revenue(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_revenue_creator_id ON agent_revenue(creator_id);

-- Add RLS policies for the new tables
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_revenue ENABLE ROW LEVEL SECURITY;

-- RLS policies - Allow admins full access to all tables
CREATE POLICY admin_activity_log_admin_policy ON admin_activity_log 
  FOR ALL TO authenticated 
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

CREATE POLICY agent_categories_admin_policy ON agent_categories 
  FOR ALL TO authenticated 
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

CREATE POLICY agent_reports_admin_policy ON agent_reports 
  FOR ALL TO authenticated 
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

CREATE POLICY system_settings_admin_policy ON system_settings 
  FOR ALL TO authenticated 
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

CREATE POLICY agent_views_admin_policy ON agent_views 
  FOR ALL TO authenticated 
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

CREATE POLICY agent_revenue_admin_policy ON agent_revenue 
  FOR ALL TO authenticated 
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

-- Add non-admin policies where needed
CREATE POLICY agent_reports_create_policy ON agent_reports 
  FOR INSERT TO authenticated 
  WITH CHECK (true); -- Anyone can report an agent

CREATE POLICY agent_reports_read_policy ON agent_reports 
  FOR SELECT TO authenticated 
  USING (reporter_id = auth.uid() OR auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

CREATE POLICY agent_views_creator_policy ON agent_views 
  FOR SELECT TO authenticated 
  USING (agent_id IN (SELECT id FROM agents WHERE creator_id = auth.uid()));

CREATE POLICY agent_revenue_creator_policy ON agent_revenue 
  FOR SELECT TO authenticated 
  USING (creator_id = auth.uid());

-- Create view for agent statistics
CREATE OR REPLACE VIEW agent_statistics AS
SELECT 
  a.id,
  a.name,
  a.category,
  a.status,
  a.featured,
  a.created_at,
  COALESCE(SUM(av.count), 0) AS total_views,
  COALESCE(SUM(ar.amount), 0) AS total_revenue,
  COUNT(DISTINCT f.id) AS favorite_count,
  u.email AS creator_email,
  u.raw_user_meta_data->>'name' AS creator_name,
  a.creator_id AS creator_id
FROM 
  agents a
LEFT JOIN 
  agent_views av ON a.id = av.agent_id
LEFT JOIN 
  agent_revenue ar ON a.id = ar.agent_id
LEFT JOIN 
  favorites f ON a.id = f.agent_id
JOIN 
  auth.users u ON a.creator_id = u.id
GROUP BY 
  a.id, u.id, u.email, u.raw_user_meta_data->>'name';

-- Create view for user statistics
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'name' AS name,
  u.raw_user_meta_data->>'role' AS role,
  u.raw_user_meta_data->>'status' AS status,
  u.created_at,
  COUNT(DISTINCT a.id) AS agent_count,
  COALESCE(SUM(ar.amount), 0) AS total_revenue,
  COUNT(DISTINCT f.id) AS favorite_count
FROM 
  auth.users u
LEFT JOIN 
  agents a ON u.id = a.creator_id
LEFT JOIN 
  agent_revenue ar ON a.id = ar.agent_id AND ar.creator_id = u.id
LEFT JOIN 
  favorites f ON u.id = f.user_id
GROUP BY 
  u.id, u.email, u.raw_user_meta_data;

-- Create function to get daily stats for the dashboard
CREATE OR REPLACE FUNCTION get_daily_stats(start_date DATE, end_date DATE)
RETURNS TABLE (
  date DATE,
  new_users BIGINT,
  new_agents BIGINT,
  total_views BIGINT,
  total_revenue DECIMAL(12, 2)
) AS $$
BEGIN
  RETURN QUERY
  WITH dates AS (
    SELECT generate_series(start_date, end_date, '1 day'::interval)::date AS date
  ),
  user_stats AS (
    SELECT 
      DATE(created_at) AS date,
      COUNT(*) AS new_users
    FROM 
      auth.users
    WHERE 
      created_at >= start_date AND created_at <= end_date
    GROUP BY 
      DATE(created_at)
  ),
  agent_stats AS (
    SELECT 
      DATE(created_at) AS date,
      COUNT(*) AS new_agents
    FROM 
      agents
    WHERE 
      created_at >= start_date AND created_at <= end_date
    GROUP BY 
      DATE(created_at)
  ),
  view_stats AS (
    SELECT 
      DATE(updated_at) AS date,
      SUM(count) AS total_views
    FROM 
      agent_views
    WHERE 
      updated_at >= start_date AND updated_at <= end_date
    GROUP BY 
      DATE(updated_at)
  ),
  revenue_stats AS (
    SELECT 
      DATE(transaction_date) AS date,
      SUM(amount) AS total_revenue
    FROM 
      agent_revenue
    WHERE 
      transaction_date >= start_date AND transaction_date <= end_date
    GROUP BY 
      DATE(transaction_date)
  )
  SELECT 
    d.date,
    COALESCE(us.new_users, 0) AS new_users,
    COALESCE(as.new_agents, 0) AS new_agents,
    COALESCE(vs.total_views, 0) AS total_views,
    COALESCE(rs.total_revenue, 0) AS total_revenue
  FROM 
    dates d
  LEFT JOIN 
    user_stats us ON d.date = us.date
  LEFT JOIN 
    agent_stats as ON d.date = as.date
  LEFT JOIN 
    view_stats vs ON d.date = vs.date
  LEFT JOIN 
    revenue_stats rs ON d.date = rs.date
  ORDER BY 
    d.date;
END;
$$ LANGUAGE plpgsql;

-- Create function for agent performance report
CREATE OR REPLACE FUNCTION get_agent_performance_report()
RETURNS TABLE (
  agent_id UUID,
  agent_name VARCHAR,
  creator_name VARCHAR,
  total_views BIGINT,
  total_revenue DECIMAL(12, 2),
  favorite_count BIGINT,
  conversion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id AS agent_id,
    a.name AS agent_name,
    u.raw_user_meta_data->>'name' AS creator_name,
    COALESCE(SUM(av.count), 0) AS total_views,
    COALESCE(SUM(ar.amount), 0) AS total_revenue,
    COUNT(DISTINCT f.id) AS favorite_count,
    CASE 
      WHEN COALESCE(SUM(av.count), 0) > 0 THEN 
        (COALESCE(SUM(ar.amount), 0) / COALESCE(SUM(av.count), 1)) * 100
      ELSE 0
    END AS conversion_rate
  FROM 
    agents a
  JOIN 
    auth.users u ON a.creator_id = u.id
  LEFT JOIN 
    agent_views av ON a.id = av.agent_id
  LEFT JOIN 
    agent_revenue ar ON a.id = ar.agent_id
  LEFT JOIN 
    favorites f ON a.id = f.agent_id
  WHERE 
    a.status = 'approved'
  GROUP BY 
    a.id, a.name, u.raw_user_meta_data->>'name'
  ORDER BY 
    total_revenue DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to update admin activity log
CREATE OR REPLACE FUNCTION log_admin_activity(
  admin_id UUID,
  action TEXT,
  entity_type TEXT,
  entity_id UUID,
  details JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO admin_activity_log (admin_id, action, entity_type, entity_id, details)
  VALUES (admin_id, action, entity_type, entity_id, details)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Insert default system settings if not exist
INSERT INTO system_settings (setting_key, setting_value, description)
VALUES 
  ('homepage_featured_limit', '{"value": 6}', 'Maximum number of featured agents on homepage')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO system_settings (setting_key, setting_value, description)
VALUES 
  ('agent_approval_required', '{"value": true}', 'Whether agent approval is required before publishing')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO system_settings (setting_key, setting_value, description)
VALUES 
  ('minimum_agent_price', '{"value": 4.99}', 'Minimum price allowed for agents')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO system_settings (setting_key, setting_value, description)
VALUES 
  ('platform_fee_percentage', '{"value": 15}', 'Platform fee percentage for transactions')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert sample categories if not exist
INSERT INTO agent_categories (name, slug, description, icon)
VALUES 
  ('Productivity', 'productivity', 'Tools to enhance productivity', 'productivity-icon')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO agent_categories (name, slug, description, icon)
VALUES 
  ('Customer Support', 'support', 'Customer service and support agents', 'support-icon')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO agent_categories (name, slug, description, icon)
VALUES 
  ('Marketing', 'marketing', 'Marketing and promotion tools', 'marketing-icon')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO agent_categories (name, slug, description, icon)
VALUES 
  ('Development', 'development', 'Software and application development', 'development-icon')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO agent_categories (name, slug, description, icon)
VALUES 
  ('Data Analysis', 'data-analysis', 'Data processing and analytics', 'data-icon')
ON CONFLICT (slug) DO NOTHING;

-- Make sure existing agents have the featured field
ALTER TABLE agents 
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Make sure existing agents have approval fields
ALTER TABLE agents 
  ADD COLUMN IF NOT EXISTS approval_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by UUID,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Create or update admin role function
CREATE OR REPLACE FUNCTION is_admin(user_id UUID) 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id 
    AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql;

-- Create or update function to get admin dashboard user count
CREATE OR REPLACE FUNCTION get_admin_user_counts() 
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total', (SELECT COUNT(*) FROM auth.users),
    'active', (SELECT COUNT(*) FROM auth.users WHERE raw_user_meta_data->>'status' = 'active' OR raw_user_meta_data->>'status' IS NULL),
    'pending', (SELECT COUNT(*) FROM auth.users WHERE raw_user_meta_data->>'status' = 'pending'),
    'suspended', (SELECT COUNT(*) FROM auth.users WHERE raw_user_meta_data->>'status' = 'suspended'),
    'creators', (SELECT COUNT(*) FROM auth.users WHERE raw_user_meta_data->>'role' = 'creator'),
    'enterprises', (SELECT COUNT(*) FROM auth.users WHERE raw_user_meta_data->>'role' = 'enterprise'),
    'admins', (SELECT COUNT(*) FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin')
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create or update function to get admin dashboard agent count
CREATE OR REPLACE FUNCTION get_admin_agent_counts() 
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total', (SELECT COUNT(*) FROM agents),
    'pending', (SELECT COUNT(*) FROM agents WHERE status = 'pending'),
    'approved', (SELECT COUNT(*) FROM agents WHERE status = 'approved'),
    'rejected', (SELECT COUNT(*) FROM agents WHERE status = 'rejected'),
    'featured', (SELECT COUNT(*) FROM agents WHERE featured = true)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
