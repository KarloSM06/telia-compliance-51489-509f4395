-- Skapa calendar_events tabell först
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Event detaljer
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'meeting',
  status TEXT DEFAULT 'scheduled',
  
  -- Tidshantering
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'Europe/Stockholm',
  all_day BOOLEAN DEFAULT false,
  
  -- Deltagarhantering
  attendees JSONB,
  
  -- Integration & synk
  source TEXT DEFAULT 'internal',
  external_id TEXT,
  sync_status TEXT DEFAULT 'synced',
  last_synced_at TIMESTAMPTZ,
  
  -- CRM-koppling
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Påminnelser
  reminders JSONB,
  
  -- Noteringar & uppföljning
  notes TEXT,
  outcome TEXT,
  next_steps TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- RLS för calendar_events
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events"
  ON calendar_events FOR SELECT
  USING (
    user_id = auth.uid() 
    OR organization_id = user_organization_id(auth.uid())
  );

CREATE POLICY "Users can insert own events"
  ON calendar_events FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own events"
  ON calendar_events FOR UPDATE
  USING (
    user_id = auth.uid() 
    OR organization_id = user_organization_id(auth.uid())
  );

CREATE POLICY "Users can delete own events"
  ON calendar_events FOR DELETE
  USING (user_id = auth.uid());

-- Trigger för updated_at
CREATE TRIGGER calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Nu skapar vi booking integrations tabellerna
CREATE TABLE booking_system_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- System identifiering
  provider TEXT NOT NULL,
  provider_display_name TEXT NOT NULL,
  integration_type TEXT NOT NULL DEFAULT 'full_api',
  
  -- Status
  is_enabled BOOLEAN DEFAULT true,
  is_configured BOOLEAN DEFAULT false,
  
  -- Autentisering (krypterad)
  encrypted_credentials JSONB,
  
  -- Konfiguration
  sync_settings JSONB DEFAULT '{
    "direction": "bidirectional",
    "auto_sync": true,
    "sync_interval_minutes": 5,
    "conflict_resolution": "external_wins"
  }'::jsonb,
  
  -- Mapping och transformation
  field_mappings JSONB,
  
  -- Synkstatus
  last_sync_at TIMESTAMPTZ,
  last_sync_status TEXT,
  last_sync_error TEXT,
  next_sync_at TIMESTAMPTZ,
  
  -- Statistik
  total_synced_events INTEGER DEFAULT 0,
  failed_syncs INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, provider)
);

CREATE TABLE booking_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID NOT NULL REFERENCES booking_system_integrations(id) ON DELETE CASCADE,
  
  webhook_url TEXT NOT NULL,
  webhook_secret TEXT,
  event_types JSONB,
  
  is_active BOOLEAN DEFAULT true,
  last_received_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE booking_sync_queue (
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

-- Lägg till booking_system_integration_id i calendar_events
ALTER TABLE calendar_events ADD COLUMN 
  booking_system_integration_id UUID REFERENCES booking_system_integrations(id) ON DELETE SET NULL;

-- RLS Policies för booking tables
ALTER TABLE booking_system_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_sync_queue ENABLE ROW LEVEL SECURITY;

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

-- Trigger för updated_at på booking_system_integrations
CREATE TRIGGER booking_integration_updated_at
  BEFORE UPDATE ON booking_system_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();