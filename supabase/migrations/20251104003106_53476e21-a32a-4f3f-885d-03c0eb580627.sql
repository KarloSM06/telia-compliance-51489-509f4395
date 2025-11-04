-- Add integration health tracking fields
ALTER TABLE public.integrations
ADD COLUMN IF NOT EXISTS last_health_check TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS health_status TEXT CHECK (health_status IN ('healthy', 'warning', 'error')),
ADD COLUMN IF NOT EXISTS last_error_message TEXT,
ADD COLUMN IF NOT EXISTS total_api_calls INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS failed_api_calls INTEGER DEFAULT 0;

-- Create integration logs table
CREATE TABLE IF NOT EXISTS public.integration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES public.integrations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('api_call', 'webhook', 'sync', 'error')),
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'warning')),
  message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on integration_logs
ALTER TABLE public.integration_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own integration logs
CREATE POLICY "Users can view their own integration logs"
ON public.integration_logs FOR SELECT
USING (
  integration_id IN (
    SELECT id FROM public.integrations WHERE user_id = auth.uid()
  )
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_integrations_health 
ON public.integrations(health_status, is_active);

CREATE INDEX IF NOT EXISTS idx_integrations_user_provider 
ON public.integrations(user_id, provider);

CREATE INDEX IF NOT EXISTS idx_integration_logs_integration 
ON public.integration_logs(integration_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_integration_logs_status 
ON public.integration_logs(status, created_at DESC);