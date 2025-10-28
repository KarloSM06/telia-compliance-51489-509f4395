-- Create integrations table (centralized provider management)
CREATE TABLE IF NOT EXISTS public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Provider info
  provider TEXT NOT NULL,
  provider_display_name TEXT NOT NULL,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('telephony', 'messaging', 'calendar', 'multi')),
  
  -- Capabilities - what can this integration do?
  capabilities TEXT[] NOT NULL DEFAULT '{}',
  
  -- Credentials & config
  encrypted_credentials JSONB NOT NULL,
  config JSONB DEFAULT '{}',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  verification_data JSONB,
  
  -- Sync/webhook settings
  webhook_enabled BOOLEAN DEFAULT true,
  webhook_url TEXT,
  webhook_secret TEXT,
  polling_enabled BOOLEAN DEFAULT false,
  polling_interval_minutes INTEGER DEFAULT 15,
  
  -- Metadata
  last_used_at TIMESTAMPTZ,
  last_synced_at TIMESTAMPTZ,
  sync_status TEXT,
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Constraints
  UNIQUE(user_id, provider, provider_display_name)
);

-- Enable RLS
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own integrations"
  ON public.integrations FOR SELECT
  USING (
    user_id = auth.uid() OR
    organization_id = user_organization_id(auth.uid())
  );

CREATE POLICY "Users can insert own integrations"
  ON public.integrations FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own integrations"
  ON public.integrations FOR UPDATE
  USING (
    user_id = auth.uid() OR
    organization_id = user_organization_id(auth.uid())
  );

CREATE POLICY "Users can delete own integrations"
  ON public.integrations FOR DELETE
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_integrations_user_id ON public.integrations(user_id);
CREATE INDEX idx_integrations_capabilities ON public.integrations USING GIN(capabilities);
CREATE INDEX idx_integrations_provider ON public.integrations(provider);
CREATE INDEX idx_integrations_active ON public.integrations(user_id, is_active) WHERE is_active = true;

-- Migrate data from telephony_accounts
INSERT INTO public.integrations (
  id,
  user_id,
  organization_id,
  provider,
  provider_display_name,
  provider_type,
  capabilities,
  encrypted_credentials,
  config,
  is_active,
  is_verified,
  last_synced_at,
  sync_status,
  created_at,
  updated_at
)
SELECT 
  id,
  user_id,
  NULL as organization_id,
  provider,
  provider_display_name,
  CASE 
    WHEN provider IN ('twilio', 'telnyx') THEN 'multi'
    WHEN provider IN ('vapi', 'retell') THEN 'telephony'
    ELSE 'telephony'
  END as provider_type,
  CASE 
    WHEN provider = 'twilio' THEN ARRAY['voice', 'sms', 'mms', 'video']
    WHEN provider = 'telnyx' THEN ARRAY['voice', 'sms', 'mms', 'fax']
    WHEN provider IN ('vapi', 'retell') THEN ARRAY['voice', 'ai_agent']
    ELSE ARRAY['voice']
  END as capabilities,
  encrypted_credentials,
  COALESCE(config, '{}'::jsonb),
  is_active,
  is_verified,
  last_synced_at,
  sync_status,
  created_at,
  updated_at
FROM public.telephony_accounts
ON CONFLICT (user_id, provider, provider_display_name) DO NOTHING;

-- Migrate data from sms_provider_settings (only if not already migrated from telephony_accounts)
INSERT INTO public.integrations (
  user_id,
  provider,
  provider_display_name,
  provider_type,
  capabilities,
  encrypted_credentials,
  config,
  is_active,
  is_verified,
  created_at,
  updated_at
)
SELECT 
  user_id,
  provider,
  provider || ' (SMS)' as provider_display_name,
  'messaging' as provider_type,
  ARRAY['sms'] as capabilities,
  jsonb_build_object('credentials', encrypted_credentials, 'from_phone', from_phone_number),
  jsonb_build_object('from_phone_number', from_phone_number),
  is_active,
  is_verified,
  created_at,
  updated_at
FROM public.sms_provider_settings
WHERE NOT EXISTS (
  SELECT 1 FROM public.integrations i 
  WHERE i.user_id = sms_provider_settings.user_id 
  AND i.provider = sms_provider_settings.provider
)
ON CONFLICT (user_id, provider, provider_display_name) DO NOTHING;

-- Migrate data from booking_system_integrations
INSERT INTO public.integrations (
  id,
  user_id,
  organization_id,
  provider,
  provider_display_name,
  provider_type,
  capabilities,
  encrypted_credentials,
  config,
  is_active,
  is_verified,
  last_synced_at,
  sync_status,
  created_at,
  updated_at
)
SELECT 
  id,
  user_id,
  organization_id,
  provider,
  provider_display_name,
  'calendar' as provider_type,
  CASE 
    WHEN provider = 'google_calendar' THEN ARRAY['calendar_sync']
    ELSE ARRAY['calendar_sync', 'booking']
  END as capabilities,
  COALESCE(encrypted_credentials, '{}'::jsonb),
  COALESCE(sync_settings, '{}'::jsonb) || COALESCE(field_mappings, '{}'::jsonb),
  is_enabled,
  is_configured,
  last_sync_at,
  last_sync_status,
  created_at,
  updated_at
FROM public.booking_system_integrations
ON CONFLICT (user_id, provider, provider_display_name) DO NOTHING;

-- Add integration_id to related tables (for future use)
ALTER TABLE public.telephony_events 
  ADD COLUMN IF NOT EXISTS integration_id UUID REFERENCES public.integrations(id) ON DELETE SET NULL;

ALTER TABLE public.calendar_events 
  ADD COLUMN IF NOT EXISTS integration_id UUID REFERENCES public.integrations(id) ON DELETE SET NULL;

ALTER TABLE public.message_logs 
  ADD COLUMN IF NOT EXISTS integration_id UUID REFERENCES public.integrations(id) ON DELETE SET NULL;

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_integrations_updated_at();