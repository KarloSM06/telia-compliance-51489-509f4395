-- Create provider_sync_status table for tracking sync health
CREATE TABLE IF NOT EXISTS provider_sync_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  -- Sync Methods
  sync_method TEXT NOT NULL DEFAULT 'hybrid' CHECK (sync_method IN ('webhook', 'polling', 'hybrid')),
  webhook_enabled BOOLEAN DEFAULT true,
  polling_enabled BOOLEAN DEFAULT true,
  
  -- Webhook Health
  last_webhook_received_at TIMESTAMPTZ,
  webhook_failure_count INTEGER DEFAULT 0,
  webhook_health_status TEXT DEFAULT 'unknown' CHECK (webhook_health_status IN ('healthy', 'degraded', 'failing', 'unknown')),
  
  -- Polling Health
  last_poll_at TIMESTAMPTZ,
  last_successful_poll_at TIMESTAMPTZ,
  polling_failure_count INTEGER DEFAULT 0,
  polling_health_status TEXT DEFAULT 'unknown' CHECK (polling_health_status IN ('healthy', 'degraded', 'failing', 'unknown')),
  
  -- Cursor/Timestamp for Incremental Sync
  last_synced_event_id TEXT,
  last_synced_timestamp TIMESTAMPTZ,
  
  -- Overall Health
  overall_health TEXT DEFAULT 'unknown' CHECK (overall_health IN ('healthy', 'warning', 'error', 'unknown')),
  sync_confidence_percentage INTEGER DEFAULT 0 CHECK (sync_confidence_percentage BETWEEN 0 AND 100),
  
  -- Error Tracking
  consecutive_error_count INTEGER DEFAULT 0,
  last_error_message TEXT,
  last_error_at TIMESTAMPTZ,
  
  -- Retry Logic
  retry_count INTEGER DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  backoff_seconds INTEGER DEFAULT 60,
  
  -- Metadata
  total_events_synced INTEGER DEFAULT 0,
  last_sync_duration_ms INTEGER,
  average_sync_duration_ms INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_provider_sync_status_integration ON provider_sync_status(integration_id);
CREATE INDEX IF NOT EXISTS idx_provider_sync_status_user ON provider_sync_status(user_id);
CREATE INDEX IF NOT EXISTS idx_provider_sync_status_health ON provider_sync_status(overall_health);
CREATE INDEX IF NOT EXISTS idx_provider_sync_status_next_retry ON provider_sync_status(next_retry_at) WHERE next_retry_at IS NOT NULL;

-- Enable RLS
ALTER TABLE provider_sync_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own sync status"
  ON provider_sync_status FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sync status"
  ON provider_sync_status FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sync status"
  ON provider_sync_status FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own sync status"
  ON provider_sync_status FOR DELETE
  USING (user_id = auth.uid());

-- Enhance telephony_webhook_logs table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'telephony_webhook_logs') THEN
    ALTER TABLE telephony_webhook_logs
    ADD COLUMN IF NOT EXISTS is_duplicate BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS processing_duration_ms INTEGER,
    ADD COLUMN IF NOT EXISTS should_trigger_sync BOOLEAN DEFAULT true;
  END IF;
END $$;