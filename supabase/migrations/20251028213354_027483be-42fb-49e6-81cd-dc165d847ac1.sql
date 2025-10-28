-- Create telephony_accounts table
CREATE TABLE telephony_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  provider TEXT NOT NULL CHECK (provider IN ('retell', 'vapi', 'twilio', 'telnyx')),
  provider_display_name TEXT NOT NULL,
  encrypted_credentials JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}',
  last_synced_at TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Create telephony_events table
CREATE TABLE telephony_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES telephony_accounts(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  direction TEXT,
  from_number TEXT,
  to_number TEXT,
  status TEXT,
  duration_seconds INTEGER,
  cost_amount NUMERIC(10,4),
  cost_currency TEXT DEFAULT 'SEK',
  provider_event_id TEXT,
  provider_payload JSONB,
  normalized JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  event_timestamp TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider_event_id)
);

-- Create telephony_attachments table
CREATE TABLE telephony_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES telephony_events(id) ON DELETE CASCADE,
  attachment_type TEXT NOT NULL,
  file_path TEXT,
  file_url TEXT,
  file_size_bytes BIGINT,
  duration_seconds INTEGER,
  transcript_text TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create telephony_metrics_snapshots table
CREATE TABLE telephony_metrics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES telephony_accounts(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  total_calls INTEGER DEFAULT 0,
  total_sms INTEGER DEFAULT 0,
  total_duration_seconds INTEGER DEFAULT 0,
  total_cost_amount NUMERIC(10,2) DEFAULT 0,
  cost_currency TEXT DEFAULT 'SEK',
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, snapshot_date)
);

-- Create indexes
CREATE INDEX idx_telephony_events_account ON telephony_events(account_id);
CREATE INDEX idx_telephony_events_timestamp ON telephony_events(event_timestamp DESC);
CREATE INDEX idx_telephony_events_type ON telephony_events(event_type);
CREATE INDEX idx_telephony_attachments_event ON telephony_attachments(event_id);
CREATE INDEX idx_telephony_metrics_date ON telephony_metrics_snapshots(snapshot_date DESC);

-- Enable RLS
ALTER TABLE telephony_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE telephony_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE telephony_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE telephony_metrics_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for telephony_accounts
CREATE POLICY "Users can view own accounts"
  ON telephony_accounts FOR SELECT
  USING (user_id = auth.uid() OR organization_id = user_organization_id(auth.uid()));

CREATE POLICY "Users can insert own accounts"
  ON telephony_accounts FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own accounts"
  ON telephony_accounts FOR UPDATE
  USING (user_id = auth.uid() OR organization_id = user_organization_id(auth.uid()));

CREATE POLICY "Users can delete own accounts"
  ON telephony_accounts FOR DELETE
  USING (user_id = auth.uid());

-- RLS Policies for telephony_events
CREATE POLICY "Users can view own events"
  ON telephony_events FOR SELECT
  USING (account_id IN (
    SELECT id FROM telephony_accounts 
    WHERE user_id = auth.uid()
  ));

-- RLS Policies for telephony_attachments
CREATE POLICY "Users can view own attachments"
  ON telephony_attachments FOR SELECT
  USING (event_id IN (
    SELECT te.id FROM telephony_events te
    JOIN telephony_accounts ta ON te.account_id = ta.id
    WHERE ta.user_id = auth.uid()
  ));

-- RLS Policies for telephony_metrics_snapshots
CREATE POLICY "Users can view own metrics"
  ON telephony_metrics_snapshots FOR SELECT
  USING (account_id IN (
    SELECT id FROM telephony_accounts 
    WHERE user_id = auth.uid()
  ));

-- Enable realtime for telephony_events
ALTER PUBLICATION supabase_realtime ADD TABLE telephony_events;