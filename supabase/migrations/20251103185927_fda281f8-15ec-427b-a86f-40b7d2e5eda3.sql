-- Phase 3: Critical Database Indexes for Performance

-- Indexes för telephony_events (används mycket i analytics)
CREATE INDEX IF NOT EXISTS idx_telephony_events_user_timestamp 
  ON telephony_events(integration_id, event_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_telephony_events_parent 
  ON telephony_events(parent_event_id) 
  WHERE parent_event_id IS NOT NULL;

-- Indexes för ai_usage_logs
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_date 
  ON ai_usage_logs(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_provider 
  ON ai_usage_logs(provider, created_at DESC);

-- Indexes för calendar_events (används i ROI calculations)
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_time 
  ON calendar_events(user_id, start_time DESC);

CREATE INDEX IF NOT EXISTS idx_calendar_events_status 
  ON calendar_events(status, start_time DESC);

-- Indexes för message_logs
CREATE INDEX IF NOT EXISTS idx_message_logs_user_date 
  ON message_logs(user_id, created_at DESC) 
  WHERE user_id IS NOT NULL;

-- Indexes för leads (conversion funnel tracking)
CREATE INDEX IF NOT EXISTS idx_leads_conversion_stage 
  ON leads(user_id, conversion_stage, created_at DESC);

-- Database Views för Analytics

-- Consolidated cost view (alla kostnader i SEK)
CREATE OR REPLACE VIEW v_user_costs AS
SELECT 
  user_id,
  DATE(created_at) as date,
  'ai' as cost_type,
  SUM(cost_sek) as cost_sek,
  COUNT(*) as event_count
FROM ai_usage_logs
GROUP BY user_id, DATE(created_at)
UNION ALL
SELECT 
  ml.user_id,
  DATE(ml.created_at) as date,
  ml.channel as cost_type,
  SUM(COALESCE((ml.metadata->>'cost_sek')::numeric, ml.cost * 10.5)) as cost_sek,
  COUNT(*) as event_count
FROM message_logs ml
WHERE ml.user_id IS NOT NULL
GROUP BY ml.user_id, DATE(ml.created_at), ml.channel;

-- Consolidated revenue view
CREATE OR REPLACE VIEW v_user_revenue AS
SELECT
  user_id,
  DATE(start_time::timestamptz) as date,
  COUNT(*) as booking_count,
  service_type,
  SUM(expected_revenue) as expected_revenue,
  SUM(actual_revenue) as actual_revenue
FROM calendar_events
WHERE status = 'completed'
GROUP BY user_id, DATE(start_time::timestamptz), service_type;