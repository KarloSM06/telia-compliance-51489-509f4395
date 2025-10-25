-- Add new columns to calendar_events for sync management
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS sync_version BIGINT DEFAULT 0;

ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS sync_state TEXT DEFAULT 'idle';

ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS external_resource JSONB;

ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

-- Add check constraint for sync_state
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'calendar_events_sync_state_check'
  ) THEN
    ALTER TABLE calendar_events 
    ADD CONSTRAINT calendar_events_sync_state_check 
    CHECK (sync_state IN ('idle', 'outbound_pending', 'syncing', 'error', 'conflict'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_calendar_events_sync_state ON calendar_events(sync_state);
CREATE INDEX IF NOT EXISTS idx_calendar_events_source_external_id ON calendar_events(source, external_id);

-- Create sync_logs table for detailed operation logging
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_event_id UUID REFERENCES calendar_events(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  source TEXT NOT NULL,
  external_id TEXT,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'noop')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'error', 'retrying')),
  request_payload JSONB,
  response_payload JSONB,
  error_message TEXT,
  attempt INTEGER DEFAULT 1,
  max_attempts INTEGER DEFAULT 3,
  idempotency_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_sync_logs_event_id ON sync_logs(calendar_event_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_direction_status ON sync_logs(direction, status);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON sync_logs(created_at DESC);

-- Update booking_sync_queue for DLQ functionality
ALTER TABLE booking_sync_queue 
ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;

ALTER TABLE booking_sync_queue 
ADD COLUMN IF NOT EXISTS next_retry_at TIMESTAMPTZ;

ALTER TABLE booking_sync_queue 
ADD COLUMN IF NOT EXISTS last_error TEXT;

ALTER TABLE booking_sync_queue 
ADD COLUMN IF NOT EXISTS is_dead_letter BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_sync_queue_next_retry ON booking_sync_queue(next_retry_at) 
WHERE status = 'pending' AND is_dead_letter = FALSE;

-- Create webhook_secrets table
CREATE TABLE IF NOT EXISTS webhook_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES booking_system_integrations(id) ON DELETE CASCADE,
  secret TEXT NOT NULL,
  algorithm TEXT DEFAULT 'sha256',
  header_name TEXT DEFAULT 'X-Signature',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  rotated_at TIMESTAMPTZ,
  UNIQUE(integration_id)
);

-- Create function to notify outbound changes
CREATE OR REPLACE FUNCTION notify_calendar_event_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Skip if change came from sync to avoid loops
  IF NEW.sync_state = 'syncing' OR NEW.sync_state = 'outbound_pending' THEN
    RETURN NEW;
  END IF;
  
  -- Push to outbound queue if event has external_id and source
  IF NEW.external_id IS NOT NULL AND NEW.source IS NOT NULL THEN
    INSERT INTO booking_sync_queue (
      integration_id,
      operation,
      entity_type,
      entity_id,
      payload,
      scheduled_at,
      status
    )
    SELECT 
      bsi.id,
      CASE 
        WHEN TG_OP = 'INSERT' THEN 'create'
        WHEN TG_OP = 'UPDATE' THEN 'update'
        WHEN TG_OP = 'DELETE' THEN 'delete'
      END,
      'calendar_event',
      COALESCE(NEW.id, OLD.id)::text,
      jsonb_build_object(
        'event_id', COALESCE(NEW.id, OLD.id),
        'external_id', COALESCE(NEW.external_id, OLD.external_id),
        'source', COALESCE(NEW.source, OLD.source),
        'operation', TG_OP,
        'sync_version', COALESCE(NEW.sync_version, 0)
      ),
      NOW(),
      'pending'
    FROM booking_system_integrations bsi
    WHERE bsi.provider = COALESCE(NEW.source, OLD.source)
      AND bsi.user_id = COALESCE(NEW.user_id, OLD.user_id)
      AND bsi.is_enabled = TRUE
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for calendar event changes
DROP TRIGGER IF EXISTS calendar_event_change_trigger ON calendar_events;
CREATE TRIGGER calendar_event_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON calendar_events
FOR EACH ROW EXECUTE FUNCTION notify_calendar_event_change();

-- Enable RLS on new tables
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_secrets ENABLE ROW LEVEL SECURITY;

-- RLS policies for sync_logs
CREATE POLICY "Users can view their own sync logs"
  ON sync_logs FOR SELECT
  USING (
    calendar_event_id IN (
      SELECT id FROM calendar_events WHERE user_id = auth.uid()
    )
  );

-- RLS policies for webhook_secrets
CREATE POLICY "Users can view their own webhook secrets"
  ON webhook_secrets FOR SELECT
  USING (
    integration_id IN (
      SELECT id FROM booking_system_integrations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own webhook secrets"
  ON webhook_secrets FOR ALL
  USING (
    integration_id IN (
      SELECT id FROM booking_system_integrations WHERE user_id = auth.uid()
    )
  );