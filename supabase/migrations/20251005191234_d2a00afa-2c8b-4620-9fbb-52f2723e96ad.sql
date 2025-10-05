-- Extend calls table with Leaddesk fields (one column at a time to avoid syntax errors)
ALTER TABLE public.calls 
  ADD COLUMN IF NOT EXISTS external_call_id text,
  ADD COLUMN IF NOT EXISTS leaddesk_campaign_id text,
  ADD COLUMN IF NOT EXISTS encrypted_customer_phone text,
  ADD COLUMN IF NOT EXISTS encrypted_customer_name text,
  ADD COLUMN IF NOT EXISTS encrypted_agent_name text,
  ADD COLUMN IF NOT EXISTS leaddesk_metadata jsonb;

-- Add index for efficient external_call_id lookups
CREATE INDEX IF NOT EXISTS idx_calls_external_id ON public.calls(external_call_id);

-- Add comments for clarity
COMMENT ON COLUMN public.calls.external_call_id IS 'Leaddesk call ID - null for manual uploads';
COMMENT ON COLUMN public.calls.encrypted_customer_phone IS 'Encrypted customer phone number from Leaddesk';
COMMENT ON COLUMN public.calls.encrypted_customer_name IS 'Encrypted customer name from Leaddesk';
COMMENT ON COLUMN public.calls.encrypted_agent_name IS 'Encrypted agent name from Leaddesk';

-- Create Leaddesk agent mapping table
CREATE TABLE IF NOT EXISTS public.leaddesk_agent_mapping (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  leaddesk_agent_id text UNIQUE NOT NULL,
  encrypted_agent_name text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on agent mapping
ALTER TABLE public.leaddesk_agent_mapping ENABLE ROW LEVEL SECURITY;

-- RLS policies for agent mapping
CREATE POLICY "Users can view own agent mappings" 
  ON public.leaddesk_agent_mapping FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own agent mappings" 
  ON public.leaddesk_agent_mapping FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own agent mappings" 
  ON public.leaddesk_agent_mapping FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own agent mappings" 
  ON public.leaddesk_agent_mapping FOR DELETE 
  USING (auth.uid() = user_id);

-- Add Leaddesk consent fields to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS leaddesk_enabled boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS leaddesk_consent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS leaddesk_consent_date timestamptz;

-- Update data_access_log actions comment
COMMENT ON COLUMN public.data_access_log.action IS 'Actions: DATA_EXPORTED, DATA_DELETION_REQUESTED, LEADDESK_DATA_RECEIVED, LEADDESK_CUSTOMER_PHONE_ACCESSED, LEADDESK_WEBHOOK_RECEIVED';