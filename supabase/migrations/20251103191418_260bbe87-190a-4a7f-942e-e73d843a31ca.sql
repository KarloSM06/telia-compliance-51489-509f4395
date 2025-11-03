-- Performance optimization indexes for communication queries
CREATE INDEX IF NOT EXISTS idx_message_logs_user_channel_date 
  ON message_logs(user_id, channel, sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_message_logs_status_date 
  ON message_logs(user_id, status, sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_telephony_events_integration_timestamp
  ON telephony_events(integration_id, event_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_telephony_events_provider_timestamp
  ON telephony_events(provider, event_timestamp DESC);

-- Materialized view för snabbare aggregering av kommunikationsstatistik
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_daily_communication_stats AS
SELECT 
  user_id,
  DATE(sent_at) as date,
  channel,
  status,
  provider,
  COUNT(*) as message_count,
  SUM(cost) as total_cost,
  COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_count,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count,
  COUNT(CASE WHEN direction = 'inbound' THEN 1 END) as inbound_count,
  COUNT(CASE WHEN direction = 'outbound' THEN 1 END) as outbound_count
FROM message_logs
GROUP BY user_id, DATE(sent_at), channel, status, provider;

-- Index för materialized view
CREATE INDEX IF NOT EXISTS idx_mv_daily_comm_stats_user_date
  ON mv_daily_communication_stats(user_id, date DESC);

-- Funktion för att refresha materialized view
CREATE OR REPLACE FUNCTION refresh_communication_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_communication_stats;
END;
$$;