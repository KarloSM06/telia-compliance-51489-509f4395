-- Add integration_id to telephony_sync_jobs and make it the primary reference
ALTER TABLE telephony_sync_jobs 
  ADD COLUMN IF NOT EXISTS integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_telephony_sync_jobs_integration_id ON telephony_sync_jobs(integration_id);

-- Update telephony_events to make integration_id NOT NULL after migration
-- (Currently it's nullable, but we'll enforce it for new records)
CREATE INDEX IF NOT EXISTS idx_telephony_events_integration_id ON telephony_events(integration_id);

-- Add webhook_token to integrations if not exists (for backward compatibility)
ALTER TABLE integrations 
  ADD COLUMN IF NOT EXISTS webhook_token TEXT UNIQUE;

-- Create index on webhook_token for fast webhook lookups
CREATE INDEX IF NOT EXISTS idx_integrations_webhook_token ON integrations(webhook_token);

-- Function to generate webhook token for integrations
CREATE OR REPLACE FUNCTION generate_integration_webhook_token()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate token for telephony providers if not already set
  IF NEW.webhook_token IS NULL AND NEW.provider_type IN ('telephony', 'multi') THEN
    NEW.webhook_token := encode(gen_random_bytes(32), 'hex');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-generate webhook tokens
DROP TRIGGER IF EXISTS trigger_generate_integration_webhook_token ON integrations;
CREATE TRIGGER trigger_generate_integration_webhook_token
  BEFORE INSERT ON integrations
  FOR EACH ROW
  EXECUTE FUNCTION generate_integration_webhook_token();