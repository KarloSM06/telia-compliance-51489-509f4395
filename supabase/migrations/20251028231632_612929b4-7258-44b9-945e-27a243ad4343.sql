-- FAS 1: DATABASE SCHEMA OMDESIGN

-- 1.1 Uppdatera telephony_events tabell
ALTER TABLE telephony_events ADD COLUMN IF NOT EXISTS resource_type TEXT CHECK (resource_type IN ('call', 'message', 'recording', 'transcript', 'number', 'event'));
ALTER TABLE telephony_events ADD COLUMN IF NOT EXISTS raw_payload JSONB;
ALTER TABLE telephony_events ADD COLUMN IF NOT EXISTS webhook_received_at TIMESTAMPTZ;
ALTER TABLE telephony_events ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending';
ALTER TABLE telephony_events ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

-- Create unique index for idempotency_key
CREATE UNIQUE INDEX IF NOT EXISTS idx_telephony_events_idempotency_key ON telephony_events(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- 1.2 Uppdatera telephony_webhook_logs
ALTER TABLE telephony_webhook_logs ADD COLUMN IF NOT EXISTS webhook_signature TEXT;
ALTER TABLE telephony_webhook_logs ADD COLUMN IF NOT EXISTS signature_verified BOOLEAN;
ALTER TABLE telephony_webhook_logs ADD COLUMN IF NOT EXISTS verification_error TEXT;

-- 1.3 Skapa telephony_sync_jobs tabell
CREATE TABLE IF NOT EXISTS telephony_sync_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES telephony_accounts(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('calls', 'messages', 'recordings', 'transcripts')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'rate_limited')),
  cursor TEXT,
  last_sync_timestamp TIMESTAMPTZ,
  items_synced INTEGER DEFAULT 0,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE telephony_sync_jobs ENABLE ROW LEVEL SECURITY;

-- RLS policies for sync jobs
CREATE POLICY "Users can view their own sync jobs"
  ON telephony_sync_jobs FOR SELECT
  USING (
    account_id IN (
      SELECT id FROM telephony_accounts WHERE user_id = auth.uid()
    )
  );

-- 1.4 Skapa telephony_media tabell
CREATE TABLE IF NOT EXISTS telephony_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES telephony_events(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('recording', 'transcript', 'voicemail')),
  provider_url TEXT,
  storage_path TEXT,
  file_size_bytes BIGINT,
  duration_seconds INTEGER,
  mime_type TEXT,
  download_status TEXT DEFAULT 'pending' CHECK (download_status IN ('pending', 'downloading', 'completed', 'failed')),
  download_error TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  downloaded_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE telephony_media ENABLE ROW LEVEL SECURITY;

-- RLS policies for media
CREATE POLICY "Users can view their own media"
  ON telephony_media FOR SELECT
  USING (
    event_id IN (
      SELECT te.id FROM telephony_events te
      JOIN telephony_accounts ta ON te.account_id = ta.id
      WHERE ta.user_id = auth.uid()
    )
  );

-- 1.5 Uppdatera telephony_accounts med provider-specifika fält
ALTER TABLE telephony_accounts ADD COLUMN IF NOT EXISTS webhook_public_key TEXT;
ALTER TABLE telephony_accounts ADD COLUMN IF NOT EXISTS polling_enabled BOOLEAN DEFAULT true;
ALTER TABLE telephony_accounts ADD COLUMN IF NOT EXISTS polling_interval_minutes INTEGER DEFAULT 15;
ALTER TABLE telephony_accounts ADD COLUMN IF NOT EXISTS rate_limit_per_minute INTEGER;
ALTER TABLE telephony_accounts ADD COLUMN IF NOT EXISTS last_rate_limit_at TIMESTAMPTZ;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_telephony_sync_jobs_account_id ON telephony_sync_jobs(account_id);
CREATE INDEX IF NOT EXISTS idx_telephony_sync_jobs_status ON telephony_sync_jobs(status);
CREATE INDEX IF NOT EXISTS idx_telephony_media_event_id ON telephony_media(event_id);
CREATE INDEX IF NOT EXISTS idx_telephony_media_download_status ON telephony_media(download_status);
CREATE INDEX IF NOT EXISTS idx_telephony_events_resource_type ON telephony_events(resource_type);
CREATE INDEX IF NOT EXISTS idx_telephony_events_processing_status ON telephony_events(processing_status);