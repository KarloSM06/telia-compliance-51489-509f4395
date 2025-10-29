-- Create webhooks_received table for raw webhook logging with idempotency
CREATE TABLE IF NOT EXISTS webhooks_received (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  event_type TEXT,
  provider_event_id TEXT,
  raw_payload JSONB NOT NULL,
  headers JSONB,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  processing_error TEXT,
  signature_verified BOOLEAN DEFAULT false,
  idempotency_key TEXT UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_webhooks_received_provider_event ON webhooks_received(provider, provider_event_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_received_idempotency ON webhooks_received(idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_webhooks_received_processed ON webhooks_received(processed, received_at);
CREATE INDEX IF NOT EXISTS idx_webhooks_received_user ON webhooks_received(user_id, received_at DESC);

-- RLS policies
ALTER TABLE webhooks_received ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own webhook logs"
  ON webhooks_received FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert webhook logs"
  ON webhooks_received FOR INSERT
  WITH CHECK (true);

-- Add missing columns to provider_sync_status if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'provider_sync_status' 
                 AND column_name = 'last_synced_event_id') THEN
    ALTER TABLE provider_sync_status ADD COLUMN last_synced_event_id TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'provider_sync_status' 
                 AND column_name = 'last_synced_timestamp') THEN
    ALTER TABLE provider_sync_status ADD COLUMN last_synced_timestamp TIMESTAMPTZ;
  END IF;
END $$;