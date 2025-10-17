-- Lägg till kolumn i befintlig calendar_events om den inte finns
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'calendar_events' 
    AND column_name = 'booking_system_integration_id'
  ) THEN
    ALTER TABLE calendar_events ADD COLUMN 
      booking_system_integration_id UUID;
  END IF;
END $$;

-- Skapa booking integrations tabeller
CREATE TABLE IF NOT EXISTS booking_system_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  provider TEXT NOT NULL,
  provider_display_name TEXT NOT NULL,
  integration_type TEXT NOT NULL DEFAULT 'full_api',
  
  is_enabled BOOLEAN DEFAULT true,
  is_configured BOOLEAN DEFAULT false,
  
  encrypted_credentials JSONB,
  sync_settings JSONB DEFAULT '{
    "direction": "bidirectional",
    "auto_sync": true,
    "sync_interval_minutes": 5,
    "conflict_resolution": "external_wins"
  }'::jsonb,
  
  field_mappings JSONB,
  
  last_sync_at TIMESTAMPTZ,
  last_sync_status TEXT,
  last_sync_error TEXT,
  next_sync_at TIMESTAMPTZ,
  
  total_synced_events INTEGER DEFAULT 0,
  failed_syncs INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, provider)
);

CREATE TABLE IF NOT EXISTS booking_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID NOT NULL REFERENCES booking_system_integrations(id) ON DELETE CASCADE,
  
  webhook_url TEXT NOT NULL,
  webhook_secret TEXT,
  event_types JSONB,
  
  is_active BOOLEAN DEFAULT true,
  last_received_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID NOT NULL REFERENCES booking_system_integrations(id) ON DELETE CASCADE,
  
  operation TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  external_id TEXT,
  
  payload JSONB,
  
  status TEXT DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  error_message TEXT,
  
  scheduled_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lägg till foreign key för booking_system_integration_id om den inte finns
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'calendar_events_booking_system_integration_id_fkey'
  ) THEN
    ALTER TABLE calendar_events ADD CONSTRAINT 
      calendar_events_booking_system_integration_id_fkey 
      FOREIGN KEY (booking_system_integration_id) 
      REFERENCES booking_system_integrations(id) ON DELETE SET NULL;
  END IF;
END $$;

-- RLS Policies
ALTER TABLE booking_system_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_sync_queue ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own integrations" ON booking_system_integrations;
DROP POLICY IF EXISTS "Users can insert own integrations" ON booking_system_integrations;
DROP POLICY IF EXISTS "Users can update own integrations" ON booking_system_integrations;
DROP POLICY IF EXISTS "Users can delete own integrations" ON booking_system_integrations;
DROP POLICY IF EXISTS "Users can view own webhooks" ON booking_webhooks;
DROP POLICY IF EXISTS "Users can manage own webhooks" ON booking_webhooks;
DROP POLICY IF EXISTS "Users can view own sync queue" ON booking_sync_queue;

-- Create policies
CREATE POLICY "Users can view own integrations"
  ON booking_system_integrations FOR SELECT
  USING (
    user_id = auth.uid() 
    OR organization_id = user_organization_id(auth.uid())
  );

CREATE POLICY "Users can insert own integrations"
  ON booking_system_integrations FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own integrations"
  ON booking_system_integrations FOR UPDATE
  USING (
    user_id = auth.uid() 
    OR organization_id = user_organization_id(auth.uid())
  );

CREATE POLICY "Users can delete own integrations"
  ON booking_system_integrations FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own webhooks"
  ON booking_webhooks FOR SELECT
  USING (
    integration_id IN (
      SELECT id FROM booking_system_integrations 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own webhooks"
  ON booking_webhooks FOR ALL
  USING (
    integration_id IN (
      SELECT id FROM booking_system_integrations 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own sync queue"
  ON booking_sync_queue FOR SELECT
  USING (
    integration_id IN (
      SELECT id FROM booking_system_integrations 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger för updated_at
DROP TRIGGER IF EXISTS booking_integration_updated_at ON booking_system_integrations;
CREATE TRIGGER booking_integration_updated_at
  BEFORE UPDATE ON booking_system_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();