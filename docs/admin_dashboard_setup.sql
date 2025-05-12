-- PostgreSQL Script for Admin Dashboard Setup
-- This script initializes the database schema and adds sample data for the admin dashboard

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS debug_logs CASCADE;
DROP TABLE IF EXISTS notification_templates CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS admin_activity_log CASCADE;
DROP TABLE IF EXISTS agent_reports CASCADE;
DROP TABLE IF EXISTS agent_categories CASCADE;
DROP TABLE IF EXISTS purchased_agents CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS enterprise_contacts CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS community_post_likes CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;
DROP TABLE IF EXISTS agent_views CASCADE;
DROP TABLE IF EXISTS agent_revenue CASCADE;
DROP TABLE IF EXISTS agent_recommendations CASCADE;
DROP TABLE IF EXISTS agent_conversions CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS enterprises CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'enterprise', -- "enterprise", "creator", "admin"
  avatar VARCHAR(255),
  company VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active' -- "active", "suspended", "pending"
);

-- Create GIN indexes for faster text search
CREATE INDEX idx_users_company_trgm ON users USING gin (company gin_trgm_ops);
CREATE INDEX idx_users_name_trgm ON users USING gin (name gin_trgm_ops);
CREATE INDEX idx_users_role ON users (role);

-- Create Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category VARCHAR(100),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pricing JSONB NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  logo_url VARCHAR(255),
  integrations VARCHAR(255)[],
  demo_url VARCHAR(255),
  demo_video_url VARCHAR(255),
  screenshots VARCHAR(255)[],
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending', -- "pending", "approved", "rejected", "archived"
  approval_date TIMESTAMPTZ,
  approved_by UUID,
  rejection_reason TEXT
);

-- Create indexes for Agents
CREATE INDEX idx_agents_category ON agents(category);
CREATE INDEX idx_agents_creator_id ON agents(creator_id);
CREATE INDEX idx_agents_description_trgm ON agents USING gin (description gin_trgm_ops);
CREATE INDEX idx_agents_featured ON agents(featured);
CREATE INDEX idx_agents_name_trgm ON agents USING gin (name gin_trgm_ops);
CREATE INDEX idx_agents_status ON agents(status);

-- Create Agent Categories table
CREATE TABLE agent_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create Agent Reports table
CREATE TABLE agent_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- "pending", "reviewed", "dismissed", "actioned"
  admin_notes TEXT,
  resolution TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ
);

-- Create indexes for Agent Reports
CREATE INDEX idx_agent_reports_agent_id ON agent_reports(agent_id);
CREATE INDEX idx_agent_reports_reporter_id ON agent_reports(reporter_id);
CREATE INDEX idx_agent_reports_status ON agent_reports(status);

-- Create Admin Activity Log table
CREATE TABLE admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL, -- "user_update", "agent_approval", "category_create", etc.
  entity_type VARCHAR(50) NOT NULL, -- "user", "agent", "category", etc.
  entity_id UUID NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for Admin Activity Log
CREATE INDEX idx_admin_activity_admin_id ON admin_activity_log(admin_id);
CREATE INDEX idx_admin_activity_entity ON admin_activity_log(entity_type, entity_id);

-- Create System Settings table
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create Notification Templates table
CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(100) UNIQUE NOT NULL, -- "agent_approved", "user_suspended", etc.
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  variables VARCHAR(100)[],
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create Debug Logs table
CREATE TABLE debug_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create Agent Views table
CREATE TABLE agent_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  count INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create Agent Revenue table
CREATE TABLE agent_revenue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create Favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, agent_id)
);

-- Create indexes for Favorites
CREATE INDEX idx_favorites_agent_id ON favorites(agent_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- Create Purchased Agents table
CREATE TABLE purchased_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  purchase_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, agent_id)
);

-- Create indexes for Purchased Agents
CREATE INDEX idx_purchased_agents_agent_id ON purchased_agents(agent_id);
CREATE INDEX idx_purchased_agents_user_id ON purchased_agents(user_id);

-- Insert Sample Data

-- Insert Sample Users (including admin user)
INSERT INTO users (id, email, name, role, company, status)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'admin@example.com', 'Admin User', 'admin', 'System Admin', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'creator1@example.com', 'Creator One', 'creator', 'Creator Company', 'active'),
  ('33333333-3333-3333-3333-333333333333', 'creator2@example.com', 'Creator Two', 'creator', 'Creator Agency', 'active'),
  ('44444444-4444-4444-4444-444444444444', 'enterprise1@example.com', 'Enterprise User', 'enterprise', 'Big Corp', 'active'),
  ('55555555-5555-5555-5555-555555555555', 'suspended@example.com', 'Suspended User', 'enterprise', 'Suspended Corp', 'suspended'),
  ('66666666-6666-6666-6666-666666666666', 'pending@example.com', 'Pending User', 'creator', 'Pending LLC', 'pending');

-- Insert Sample Categories
INSERT INTO agent_categories (id, name, slug, description, icon)
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Productivity', 'productivity', 'Tools to enhance productivity', 'productivity-icon'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Customer Support', 'support', 'Customer service and support agents', 'support-icon'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Marketing', 'marketing', 'Marketing and promotion tools', 'marketing-icon'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Development', 'development', 'Software and application development', 'development-icon'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Data Analysis', 'data-analysis', 'Data processing and analytics', 'data-icon');

-- Insert Sample Agents
INSERT INTO agents (id, name, slug, description, short_description, category, creator_id, pricing, featured, logo_url, status)
VALUES 
  ('aaaabbbb-aaaa-bbbb-aaaa-bbbbaaaabbbb', 'Super Assistant', 'super-assistant', 'A versatile AI assistant for various tasks', 'All-in-one assistant', 'productivity', '22222222-2222-2222-2222-222222222222', '{"monthly": 9.99, "yearly": 99.99}', true, 'logo1.png', 'approved'),
  ('bbbbcccc-bbbb-cccc-bbbb-ccccbbbbcccc', 'Support Bot', 'support-bot', 'AI customer support agent', 'Handles customer queries', 'support', '22222222-2222-2222-2222-222222222222', '{"monthly": 19.99, "yearly": 199.99}', true, 'logo2.png', 'approved'),
  ('ccccdddd-cccc-dddd-cccc-ddddccccdddd', 'Marketing Genius', 'marketing-genius', 'Marketing campaign assistant', 'Helps with marketing', 'marketing', '33333333-3333-3333-3333-333333333333', '{"monthly": 29.99, "yearly": 299.99}', false, 'logo3.png', 'approved'),
  ('ddddeeeee-dddd-eeee-dddd-eeeeddddeee', 'Code Helper', 'code-helper', 'Programming assistant', 'Helps with coding', 'development', '33333333-3333-3333-3333-333333333333', '{"monthly": 14.99, "yearly": 149.99}', false, 'approved'),
  ('eeeeffff-eeee-ffff-eeee-ffffeeeeffff', 'Data Wizard', 'data-wizard', 'Data analysis assistant', 'Analyzes data', 'data-analysis', '22222222-2222-2222-2222-222222222222', '{"monthly": 24.99, "yearly": 249.99}', false, 'logo4.png', 'pending'),
  ('ffffgggg-ffff-gggg-ffff-ggggffffgggg', 'Rejected Bot', 'rejected-bot', 'This agent was rejected', 'Rejected agent', 'support', '33333333-3333-3333-3333-333333333333', '{"monthly": 9.99}', false, 'logo5.png', 'rejected');

-- Insert Sample Agent Reports
INSERT INTO agent_reports (id, agent_id, reporter_id, reason, description, status, admin_notes, resolution, reviewed_by, reviewed_at)
VALUES 
  ('report1id-1111-1111-1111-report1idaaa', 'aaaabbbb-aaaa-bbbb-aaaa-bbbbaaaabbbb', '44444444-4444-4444-4444-444444444444', 'Misleading Description', 'The agent description is misleading', 'pending', NULL, NULL, NULL, NULL),
  ('report2id-2222-2222-2222-report2idaaa', 'bbbbcccc-bbbb-cccc-bbbb-ccccbbbbcccc', '44444444-4444-4444-4444-444444444444', 'Not Working', 'The agent is not working as advertised', 'reviewed', 'Looking into this issue', NULL, '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '2 days'),
  ('report3id-3333-3333-3333-report3idaaa', 'ccccdddd-cccc-dddd-cccc-ddddccccdddd', '55555555-5555-5555-5555-555555555555', 'Inappropriate Content', 'The agent generates inappropriate content', 'actioned', 'Content filters adjusted', 'Agent content filters improved', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '5 days'),
  ('report4id-4444-4444-4444-report4idaaa', 'ddddeeeee-dddd-eeee-dddd-eeeeddddeee', '44444444-4444-4444-4444-444444444444', 'Performance Issues', 'Very slow responses', 'dismissed', 'Performance is within normal parameters', 'No action needed', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '10 days');

-- Insert Sample Admin Activity Logs
INSERT INTO admin_activity_log (id, admin_id, action, entity_type, entity_id, details, created_at)
VALUES 
  (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'user_suspend', 'user', '55555555-5555-5555-5555-555555555555', '{"reason": "Policy violation"}', NOW() - INTERVAL '30 days'),
  (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'agent_approve', 'agent', 'aaaabbbb-aaaa-bbbb-aaaa-bbbbaaaabbbb', '{"notes": "Meets all guidelines"}', NOW() - INTERVAL '25 days'),
  (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'agent_approve', 'agent', 'bbbbcccc-bbbb-cccc-bbbb-ccccbbbbcccc', '{"notes": "Good quality agent"}', NOW() - INTERVAL '20 days'),
  (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'agent_approve', 'agent', 'ccccdddd-cccc-dddd-cccc-ddddccccdddd', '{"notes": "Approved with minor suggestions"}', NOW() - INTERVAL '15 days'),
  (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'agent_reject', 'agent', 'ffffgggg-ffff-gggg-ffff-ggggffffgggg', '{"reason": "Does not meet quality standards"}', NOW() - INTERVAL '10 days'),
  (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'category_create', 'category', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, NOW() - INTERVAL '60 days'),
  (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'report_review', 'report', 'report2id-2222-2222-2222-report2idaaa', NULL, NOW() - INTERVAL '2 days'),
  (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'report_action', 'report', 'report3id-3333-3333-3333-report3idaaa', '{"action": "Content filter adjustment"}', NOW() - INTERVAL '5 days'),
  (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'report_dismiss', 'report', 'report4id-4444-4444-4444-report4idaaa', NULL, NOW() - INTERVAL '10 days'),
  (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'settings_update', 'system', uuid_generate_v4(), '{"setting": "homepage_featured_limit"}', NOW() - INTERVAL '15 days');

-- Insert Sample System Settings
INSERT INTO system_settings (id, setting_key, setting_value, description)
VALUES 
  (uuid_generate_v4(), 'homepage_featured_limit', '{"value": 6}', 'Maximum number of featured agents on homepage'),
  (uuid_generate_v4(), 'agent_approval_required', '{"value": true}', 'Whether agent approval is required before publishing'),
  (uuid_generate_v4(), 'minimum_agent_price', '{"value": 4.99}', 'Minimum price allowed for agents'),
  (uuid_generate_v4(), 'platform_fee_percentage', '{"value": 15}', 'Platform fee percentage for transactions'),
  (uuid_generate_v4(), 'maintenance_mode', '{"value": false}', 'Whether the site is in maintenance mode');

-- Insert Sample Agent Views
INSERT INTO agent_views (id, agent_id, creator_id, count, updated_at)
VALUES 
  (uuid_generate_v4(), 'aaaabbbb-aaaa-bbbb-aaaa-bbbbaaaabbbb', '22222222-2222-2222-2222-222222222222', 450, NOW() - INTERVAL '1 day'),
  (uuid_generate_v4(), 'bbbbcccc-bbbb-cccc-bbbb-ccccbbbbcccc', '22222222-2222-2222-2222-222222222222', 320, NOW() - INTERVAL '1 day'),
  (uuid_generate_v4(), 'ccccdddd-cccc-dddd-cccc-ddddccccdddd', '33333333-3333-3333-3333-333333333333', 280, NOW() - INTERVAL '1 day'),
  (uuid_generate_v4(), 'ddddeeeee-dddd-eeee-dddd-eeeeddddeee', '33333333-3333-3333-3333-333333333333', 190, NOW() - INTERVAL '1 day');

-- Insert Sample Agent Revenue
INSERT INTO agent_revenue (id, agent_id, creator_id, amount, currency, updated_at)
VALUES 
  (uuid_generate_v4(), 'aaaabbbb-aaaa-bbbb-aaaa-bbbbaaaabbbb', '22222222-2222-2222-2222-222222222222', 1250.00, 'EUR', NOW() - INTERVAL '30 days'),
  (uuid_generate_v4(), 'aaaabbbb-aaaa-bbbb-aaaa-bbbbaaaabbbb', '22222222-2222-2222-2222-222222222222', 1450.00, 'EUR', NOW() - INTERVAL '1 day'),
  (uuid_generate_v4(), 'bbbbcccc-bbbb-cccc-bbbb-ccccbbbbcccc', '22222222-2222-2222-2222-222222222222', 980.00, 'EUR', NOW() - INTERVAL '1 day'),
  (uuid_generate_v4(), 'ccccdddd-cccc-dddd-cccc-ddddccccdddd', '33333333-3333-3333-3333-333333333333', 720.00, 'EUR', NOW() - INTERVAL '1 day'),
  (uuid_generate_v4(), 'ddddeeeee-dddd-eeee-dddd-eeeeddddeee', '33333333-3333-3333-3333-333333333333', 340.00, 'EUR', NOW() - INTERVAL '1 day');

-- Insert Sample Favorites
INSERT INTO favorites (id, user_id, agent_id, created_at)
VALUES 
  (uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'aaaabbbb-aaaa-bbbb-aaaa-bbbbaaaabbbb', NOW() - INTERVAL '15 days'),
  (uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'bbbbcccc-bbbb-cccc-bbbb-ccccbbbbcccc', NOW() - INTERVAL '10 days'),
  (uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', 'ccccdddd-cccc-dddd-cccc-ddddccccdddd', NOW() - INTERVAL '5 days');

-- Insert Sample Purchased Agents
INSERT INTO purchased_agents (id, user_id, agent_id, status, created_at)
VALUES 
  (uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'aaaabbbb-aaaa-bbbb-aaaa-bbbbaaaabbbb', 'active', NOW() - INTERVAL '20 days'),
  (uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'bbbbcccc-bbbb-cccc-bbbb-ccccbbbbcccc', 'active', NOW() - INTERVAL '15 days'),
  (uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', 'ccccdddd-cccc-dddd-cccc-ddddccccdddd', 'active', NOW() - INTERVAL '10 days'),
  (uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', 'ddddeeeee-dddd-eeee-dddd-eeeeddddeee', 'canceled', NOW() - INTERVAL '5 days');

-- Add some historical data for charts and trends (last 30 days)
DO $$
DECLARE
  current_date DATE := CURRENT_DATE;
  i INT;
BEGIN
  FOR i IN 1..30 LOOP
    -- Insert daily agent views
    INSERT INTO agent_views (id, agent_id, creator_id, count, updated_at)
    VALUES 
      (uuid_generate_v4(), 'aaaabbbb-aaaa-bbbb-aaaa-bbbbaaaabbbb', '22222222-2222-2222-2222-222222222222', 10 + (random() * 40)::INT, current_date - (i || ' days')::INTERVAL),
      (uuid_generate_v4(), 'bbbbcccc-bbbb-cccc-bbbb-ccccbbbbcccc', '22222222-2222-2222-2222-222222222222', 5 + (random() * 30)::INT, current_date - (i || ' days')::INTERVAL),
      (uuid_generate_v4(), 'ccccdddd-cccc-dddd-cccc-ddddccccdddd', '33333333-3333-3333-3333-333333333333', 8 + (random() * 25)::INT, current_date - (i || ' days')::INTERVAL);

    -- Insert daily revenue (only on some days)
    IF i % 3 = 0 THEN
      INSERT INTO agent_revenue (id, agent_id, creator_id, amount, currency, updated_at)
      VALUES 
        (uuid_generate_v4(), 'aaaabbbb-aaaa-bbbb-aaaa-bbbbaaaabbbb', '22222222-2222-2222-2222-222222222222', 50 + (random() * 150)::INT, 'EUR', current_date - (i || ' days')::INTERVAL),
        (uuid_generate_v4(), 'bbbbcccc-bbbb-cccc-bbbb-ccccbbbbcccc', '22222222-2222-2222-2222-222222222222', 30 + (random() * 100)::INT, 'EUR', current_date - (i || ' days')::INTERVAL),
        (uuid_generate_v4(), 'ccccdddd-cccc-dddd-cccc-ddddccccdddd', '33333333-3333-3333-3333-333333333333', 25 + (random() * 80)::INT, 'EUR', current_date - (i || ' days')::INTERVAL);
    END IF;

    -- Insert admin activity (only on some days)
    IF i % 5 = 0 THEN
      INSERT INTO admin_activity_log (id, admin_id, action, entity_type, entity_id, details, created_at)
      VALUES (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 
              CASE (random() * 3)::INT 
                WHEN 0 THEN 'user_update' 
                WHEN 1 THEN 'agent_review' 
                ELSE 'system_update' 
              END,
              CASE (random() * 2)::INT 
                WHEN 0 THEN 'user' 
                WHEN 1 THEN 'agent' 
                ELSE 'system' 
              END,
              uuid_generate_v4(), NULL, current_date - (i || ' days')::INTERVAL);
    END IF;
  END LOOP;
END $$;

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
  COUNT(DISTINCT pa.id) AS purchase_count,
  u.name AS creator_name,
  u.id AS creator_id
FROM 
  agents a
LEFT JOIN 
  agent_views av ON a.id = av.agent_id
LEFT JOIN 
  agent_revenue ar ON a.id = ar.agent_id
LEFT JOIN 
  favorites f ON a.id = f.agent_id
LEFT JOIN 
  purchased_agents pa ON a.id = pa.agent_id
JOIN 
  users u ON a.creator_id = u.id
GROUP BY 
  a.id, u.id, u.name;

-- Create view for user statistics
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
  u.id,
  u.name,
  u.email,
  u.role,
  u.status,
  u.created_at,
  COUNT(DISTINCT a.id) AS agent_count,
  COALESCE(SUM(ar.amount), 0) AS total_revenue,
  COUNT(DISTINCT f.id) AS favorite_count,
  COUNT(DISTINCT pa.id) AS purchase_count
FROM 
  users u
LEFT JOIN 
  agents a ON u.id = a.creator_id
LEFT JOIN 
  agent_revenue ar ON a.id = ar.agent_id
LEFT JOIN 
  favorites f ON u.id = f.user_id
LEFT JOIN 
  purchased_agents pa ON u.id = pa.user_id
GROUP BY 
  u.id;

-- Create function to summarize daily stats
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
      users
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
      DATE(updated_at) AS date,
      SUM(amount) AS total_revenue
    FROM 
      agent_revenue
    WHERE 
      updated_at >= start_date AND updated_at <= end_date
    GROUP BY 
      DATE(updated_at)
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

-- Create stored procedure for agent performance report
CREATE OR REPLACE FUNCTION get_agent_performance_report()
RETURNS TABLE (
  agent_id UUID,
  agent_name VARCHAR,
  creator_name VARCHAR,
  total_views BIGINT,
  total_revenue DECIMAL(12, 2),
  favorite_count BIGINT,
  purchase_count BIGINT,
  conversion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id AS agent_id,
    a.name AS agent_name,
    u.name AS creator_name,
    COALESCE(SUM(av.count), 0) AS total_views,
    COALESCE(SUM(ar.amount), 0) AS total_revenue,
    COUNT(DISTINCT f.id) AS favorite_count,
    COUNT(DISTINCT pa.id) AS purchase_count,
    CASE 
      WHEN COALESCE(SUM(av.count), 0) > 0 THEN 
        (COUNT(DISTINCT pa.id)::NUMERIC / COALESCE(SUM(av.count), 1)) * 100
      ELSE 0
    END AS conversion_rate
  FROM 
    agents a
  JOIN 
    users u ON a.creator_id = u.id
  LEFT JOIN 
    agent_views av ON a.id = av.agent_id
  LEFT JOIN 
    agent_revenue ar ON a.id = ar.agent_id
  LEFT JOIN 
    favorites f ON a.id = f.agent_id
  LEFT JOIN 
    purchased_agents pa ON a.id = pa.agent_id
  WHERE 
    a.status = 'approved'
  GROUP BY 
    a.id, a.name, u.name
  ORDER BY 
    total_revenue DESC;
END;
$$ LANGUAGE plpgsql;

-- Done! The admin dashboard database structure is now set up with sample data.
