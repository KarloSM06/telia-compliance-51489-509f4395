-- Fix Security Warnings

-- Remove SECURITY DEFINER från views (de är inte SECURITY DEFINER just nu, men för att vara säker)
-- Recreate views without security definer and add RLS-aware WHERE clauses

DROP VIEW IF EXISTS v_user_costs;
DROP VIEW IF EXISTS v_user_revenue;

-- Consolidated cost view (alla kostnader i SEK) - RLS-aware
CREATE VIEW v_user_costs 
WITH (security_invoker = true)
AS
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

-- Consolidated revenue view - RLS-aware
CREATE VIEW v_user_revenue 
WITH (security_invoker = true)
AS
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