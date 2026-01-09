-- Supabase CRM Database Schema
-- Created: 2026-01-09
-- This schema includes tables for profiles, leads, interactions, deals, tasks, campaigns, and audit logging

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS AND TYPES
-- ============================================================================

CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'archived');
CREATE TYPE lead_source_type AS ENUM ('website', 'referral', 'cold_call', 'email', 'social_media', 'event', 'partnership', 'other');
CREATE TYPE interaction_type AS ENUM ('call', 'email', 'meeting', 'message', 'note', 'task_completion');
CREATE TYPE deal_status AS ENUM ('prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
CREATE TYPE task_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');
CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'restore');

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  company_name TEXT,
  job_title TEXT,
  time_zone TEXT DEFAULT 'UTC',
  language_preference TEXT DEFAULT 'en',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- ============================================================================
-- LEAD SOURCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS lead_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  source_type lead_source_type NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name)
);

CREATE INDEX idx_lead_sources_user_id ON lead_sources(user_id);
CREATE INDEX idx_lead_sources_source_type ON lead_sources(source_type);
CREATE INDEX idx_lead_sources_is_active ON lead_sources(is_active);

-- ============================================================================
-- LEADS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  job_title TEXT,
  status lead_status DEFAULT 'new',
  lead_source_id UUID REFERENCES lead_sources ON DELETE SET NULL,
  estimated_value DECIMAL(12, 2),
  currency TEXT DEFAULT 'USD',
  description TEXT,
  notes TEXT,
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_lead_source_id ON leads(lead_source_id);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_updated_at ON leads(updated_at);
CREATE INDEX idx_leads_deleted_at ON leads(deleted_at);

-- ============================================================================
-- INTERACTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES leads ON DELETE CASCADE,
  type interaction_type NOT NULL,
  subject TEXT,
  description TEXT,
  duration_minutes INTEGER,
  outcome TEXT,
  next_action TEXT,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interactions_user_id ON interactions(user_id);
CREATE INDEX idx_interactions_lead_id ON interactions(lead_id);
CREATE INDEX idx_interactions_type ON interactions(type);
CREATE INDEX idx_interactions_scheduled_for ON interactions(scheduled_for);
CREATE INDEX idx_interactions_completed_at ON interactions(completed_at);
CREATE INDEX idx_interactions_created_at ON interactions(created_at);

-- ============================================================================
-- DEALS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES leads ON DELETE CASCADE,
  name TEXT NOT NULL,
  status deal_status DEFAULT 'prospecting',
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  probability DECIMAL(3, 0) DEFAULT 50,
  expected_close_date DATE,
  actual_close_date DATE,
  description TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_deals_user_id ON deals(user_id);
CREATE INDEX idx_deals_lead_id ON deals(lead_id);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_expected_close_date ON deals(expected_close_date);
CREATE INDEX idx_deals_created_at ON deals(created_at);

-- ============================================================================
-- TASKS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  lead_id UUID REFERENCES leads ON DELETE CASCADE,
  deal_id UUID REFERENCES deals ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'open',
  priority task_priority DEFAULT 'medium',
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES auth.users ON DELETE SET NULL,
  reminder_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_lead_id ON tasks(lead_id);
CREATE INDEX idx_tasks_deal_id ON tasks(deal_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_completed_at ON tasks(completed_at);

-- ============================================================================
-- CAMPAIGNS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status campaign_status DEFAULT 'draft',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12, 2),
  currency TEXT DEFAULT 'USD',
  target_audience TEXT,
  expected_roi DECIMAL(5, 2),
  actual_roi DECIMAL(5, 2),
  leads_count INTEGER DEFAULT 0,
  conversions_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_start_date ON campaigns(start_date);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at);

-- ============================================================================
-- CAMPAIGN LEADS JUNCTION TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES leads ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(campaign_id, lead_id)
);

CREATE INDEX idx_campaign_leads_campaign_id ON campaign_leads(campaign_id);
CREATE INDEX idx_campaign_leads_lead_id ON campaign_leads(lead_id);

-- ============================================================================
-- AUDIT LOGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE SET NULL,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action audit_action NOT NULL,
  old_values JSONB,
  new_values JSONB,
  change_reason TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Lead sources policies
CREATE POLICY "Users can view their own lead sources" ON lead_sources
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create lead sources" ON lead_sources
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lead sources" ON lead_sources
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lead sources" ON lead_sources
  FOR DELETE USING (auth.uid() = user_id);

-- Leads policies
CREATE POLICY "Users can view their own leads" ON leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create leads" ON leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads" ON leads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads" ON leads
  FOR DELETE USING (auth.uid() = user_id);

-- Interactions policies
CREATE POLICY "Users can view their own interactions" ON interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create interactions" ON interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions" ON interactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactions" ON interactions
  FOR DELETE USING (auth.uid() = user_id);

-- Deals policies
CREATE POLICY "Users can view their own deals" ON deals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create deals" ON deals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deals" ON deals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deals" ON deals
  FOR DELETE USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can create tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Campaigns policies
CREATE POLICY "Users can view their own campaigns" ON campaigns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create campaigns" ON campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns" ON campaigns
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns" ON campaigns
  FOR DELETE USING (auth.uid() = user_id);

-- Campaign leads policies
CREATE POLICY "Users can view campaign leads for their campaigns" ON campaign_leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_leads.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage campaign leads" ON campaign_leads
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_leads.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete campaign leads" ON campaign_leads
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_leads.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

-- Audit logs policies - users can only view their own audit logs
CREATE POLICY "Users can view their own audit logs" ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- HELPER FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_sources_updated_at
  BEFORE UPDATE ON lead_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interactions_updated_at
  BEFORE UPDATE ON interactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create audit log entries
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (user_id, table_name, record_id, action, old_values)
    VALUES (auth.uid(), TG_TABLE_NAME, OLD.id, 'delete'::audit_action, row_to_json(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (user_id, table_name, record_id, action, old_values, new_values)
    VALUES (auth.uid(), TG_TABLE_NAME, NEW.id, 'update'::audit_action, row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (user_id, table_name, record_id, action, new_values)
    VALUES (auth.uid(), TG_TABLE_NAME, NEW.id, 'create'::audit_action, row_to_json(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Audit triggers for main tables
CREATE TRIGGER audit_leads
  AFTER INSERT OR UPDATE OR DELETE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_interactions
  AFTER INSERT OR UPDATE OR DELETE ON interactions
  FOR EACH ROW
  EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_deals
  AFTER INSERT OR UPDATE OR DELETE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_tasks
  AFTER INSERT OR UPDATE OR DELETE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_campaigns
  AFTER INSERT OR UPDATE OR DELETE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION create_audit_log();

-- Function to get lead details with related data
CREATE OR REPLACE FUNCTION get_lead_details(lead_id UUID)
RETURNS TABLE (
  lead_id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  status TEXT,
  estimated_value DECIMAL,
  interactions_count BIGINT,
  deals_count BIGINT,
  tasks_count BIGINT,
  last_interaction_date TIMESTAMP WITH TIME ZONE
) AS $$
SELECT
  l.id,
  l.first_name,
  l.last_name,
  l.email,
  l.phone,
  l.company,
  l.status::TEXT,
  l.estimated_value,
  COUNT(DISTINCT i.id) as interactions_count,
  COUNT(DISTINCT d.id) as deals_count,
  COUNT(DISTINCT t.id) as tasks_count,
  MAX(i.created_at) as last_interaction_date
FROM leads l
LEFT JOIN interactions i ON l.id = i.lead_id
LEFT JOIN deals d ON l.id = d.lead_id
LEFT JOIN tasks t ON l.id = t.lead_id
WHERE l.id = lead_id
GROUP BY l.id, l.first_name, l.last_name, l.email, l.phone, l.company, l.status, l.estimated_value;
$$ LANGUAGE sql STABLE;

-- Function to get deal pipeline summary
CREATE OR REPLACE FUNCTION get_deal_pipeline(user_id UUID)
RETURNS TABLE (
  status TEXT,
  count BIGINT,
  total_amount DECIMAL,
  average_probability DECIMAL
) AS $$
SELECT
  d.status::TEXT,
  COUNT(d.id) as count,
  COALESCE(SUM(d.amount), 0) as total_amount,
  COALESCE(AVG(d.probability), 0) as average_probability
FROM deals d
WHERE d.user_id = user_id
GROUP BY d.status
ORDER BY d.status;
$$ LANGUAGE sql STABLE;

-- Function to get campaign performance metrics
CREATE OR REPLACE FUNCTION get_campaign_metrics(campaign_id UUID)
RETURNS TABLE (
  campaign_name TEXT,
  total_leads INTEGER,
  conversions INTEGER,
  conversion_rate DECIMAL,
  budget DECIMAL,
  expected_roi DECIMAL,
  actual_roi DECIMAL
) AS $$
SELECT
  c.name,
  c.leads_count,
  c.conversions_count,
  CASE WHEN c.leads_count > 0 THEN (c.conversions_count::DECIMAL / c.leads_count * 100) ELSE 0 END,
  c.budget,
  c.expected_roi,
  c.actual_roi
FROM campaigns c
WHERE c.id = campaign_id;
$$ LANGUAGE sql STABLE;

-- Function to update lead status based on deal progression
CREATE OR REPLACE FUNCTION update_lead_status_from_deal()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'closed_won'::deal_status THEN
    UPDATE leads SET status = 'won'::lead_status WHERE id = NEW.lead_id;
  ELSIF NEW.status = 'closed_lost'::deal_status THEN
    UPDATE leads SET status = 'lost'::lead_status WHERE id = NEW.lead_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lead_status_from_deal_trigger
  AFTER UPDATE ON deals
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_lead_status_from_deal();

-- Function to get upcoming tasks for a user
CREATE OR REPLACE FUNCTION get_upcoming_tasks(user_id UUID, days_ahead INTEGER DEFAULT 7)
RETURNS TABLE (
  task_id UUID,
  title TEXT,
  description TEXT,
  priority TEXT,
  due_date DATE,
  lead_name TEXT,
  deal_name TEXT
) AS $$
SELECT
  t.id,
  t.title,
  t.description,
  t.priority::TEXT,
  t.due_date,
  CASE WHEN t.lead_id IS NOT NULL THEN CONCAT(l.first_name, ' ', l.last_name) ELSE NULL END,
  d.name
FROM tasks t
LEFT JOIN leads l ON t.lead_id = l.id
LEFT JOIN deals d ON t.deal_id = d.id
WHERE (t.user_id = user_id OR t.assigned_to = user_id)
  AND t.status != 'completed'::task_status
  AND t.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + days_ahead * INTERVAL '1 day'
ORDER BY t.due_date, t.priority DESC;
$$ LANGUAGE sql STABLE;

-- Function to get lead source performance
CREATE OR REPLACE FUNCTION get_lead_source_performance(user_id UUID)
RETURNS TABLE (
  source_name TEXT,
  source_type TEXT,
  total_leads BIGINT,
  qualified_leads BIGINT,
  converted_deals BIGINT,
  average_deal_value DECIMAL,
  conversion_rate DECIMAL
) AS $$
SELECT
  ls.name,
  ls.source_type::TEXT,
  COUNT(DISTINCT l.id) as total_leads,
  COUNT(DISTINCT CASE WHEN l.status IN ('qualified', 'proposal', 'negotiation', 'won') THEN l.id END) as qualified_leads,
  COUNT(DISTINCT CASE WHEN d.status = 'closed_won'::deal_status THEN d.id END) as converted_deals,
  COALESCE(AVG(d.amount), 0) as average_deal_value,
  CASE WHEN COUNT(DISTINCT l.id) > 0 
    THEN COUNT(DISTINCT CASE WHEN l.status IN ('qualified', 'proposal', 'negotiation', 'won') THEN l.id END)::DECIMAL / COUNT(DISTINCT l.id) * 100 
    ELSE 0 
  END as conversion_rate
FROM lead_sources ls
LEFT JOIN leads l ON ls.id = l.lead_source_id
LEFT JOIN deals d ON l.id = d.lead_id
WHERE ls.user_id = user_id
GROUP BY ls.id, ls.name, ls.source_type
ORDER BY total_leads DESC;
$$ LANGUAGE sql STABLE;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE profiles IS 'User profile information';
COMMENT ON TABLE leads IS 'Sales leads with contact and pipeline information';
COMMENT ON TABLE interactions IS 'Interactions with leads (calls, emails, meetings, etc.)';
COMMENT ON TABLE deals IS 'Sales deals and opportunities';
COMMENT ON TABLE tasks IS 'Tasks and action items for users';
COMMENT ON TABLE campaigns IS 'Marketing campaigns';
COMMENT ON TABLE campaign_leads IS 'Junction table linking campaigns to leads';
COMMENT ON TABLE lead_sources IS 'Definition of lead sources (website, referral, etc.)';
COMMENT ON TABLE audit_logs IS 'Audit trail of all data changes';

COMMENT ON FUNCTION get_lead_details(UUID) IS 'Returns comprehensive lead information with related counts';
COMMENT ON FUNCTION get_deal_pipeline(UUID) IS 'Returns deal pipeline summary grouped by status';
COMMENT ON FUNCTION get_campaign_metrics(UUID) IS 'Returns campaign performance metrics';
COMMENT ON FUNCTION get_upcoming_tasks(UUID, INTEGER) IS 'Returns upcoming tasks for a user within specified days';
COMMENT ON FUNCTION get_lead_source_performance(UUID) IS 'Returns performance metrics for each lead source';
