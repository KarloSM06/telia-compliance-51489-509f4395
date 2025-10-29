-- ============================================
-- Phase 1: Create agents table
-- ============================================
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('vapi', 'retell', 'telnyx', 'twilio')),
  
  -- Provider-specific IDs
  provider_agent_id TEXT,
  
  -- Configuration
  name TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_provider_agent UNIQUE (integration_id, provider_agent_id)
);

CREATE INDEX idx_agents_integration ON agents(integration_id);
CREATE INDEX idx_agents_user ON agents(user_id);
CREATE INDEX idx_agents_provider ON agents(provider);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own agents"
  ON agents FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own agents"
  ON agents FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own agents"
  ON agents FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own agents"
  ON agents FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- Phase 2: Create call_events table
-- ============================================
CREATE TABLE call_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID NOT NULL,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  
  -- Event details
  event_type TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  
  -- Content
  text TEXT,
  audio_url TEXT,
  
  -- Metadata
  data JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_call_events_call ON call_events(call_id);
CREATE INDEX idx_call_events_agent ON call_events(agent_id);
CREATE INDEX idx_call_events_timestamp ON call_events(timestamp);

ALTER TABLE call_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own call events"
  ON call_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM telephony_events te
      JOIN integrations i ON te.integration_id = i.id
      WHERE te.id = call_events.call_id
      AND i.user_id = auth.uid()
    )
  );

-- ============================================
-- Phase 3: Enhance telephony_events table
-- ============================================
ALTER TABLE telephony_events 
ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS user_id UUID;

CREATE INDEX IF NOT EXISTS idx_telephony_events_agent ON telephony_events(agent_id);
CREATE INDEX IF NOT EXISTS idx_telephony_events_user ON telephony_events(user_id);
CREATE INDEX IF NOT EXISTS idx_telephony_events_timestamp ON telephony_events(event_timestamp);
CREATE INDEX IF NOT EXISTS idx_telephony_events_provider_event ON telephony_events(provider, provider_event_id);

-- Update existing events to set user_id from integration
UPDATE telephony_events te
SET user_id = i.user_id
FROM integrations i
WHERE te.integration_id = i.id
AND te.user_id IS NULL;

-- ============================================
-- Phase 4: Enhance phone_numbers table
-- ============================================
ALTER TABLE phone_numbers
ADD COLUMN IF NOT EXISTS integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS capabilities JSONB DEFAULT '{"voice": true, "sms": true, "mms": false}',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_phone_numbers_integration ON phone_numbers(integration_id);

-- Update RLS for phone_numbers
DROP POLICY IF EXISTS "Users can view own phone numbers" ON phone_numbers;
CREATE POLICY "Users can view own phone numbers"
  ON phone_numbers FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own phone numbers"
  ON phone_numbers FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own phone numbers"
  ON phone_numbers FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own phone numbers"
  ON phone_numbers FOR DELETE
  USING (user_id = auth.uid());