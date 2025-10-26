-- Create SMS provider settings table
CREATE TABLE sms_provider_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('twilio', 'telnyx')),
  encrypted_credentials TEXT NOT NULL,
  from_phone_number TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  test_message_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Enable RLS
ALTER TABLE sms_provider_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own SMS provider settings"
  ON sms_provider_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own SMS provider settings"
  ON sms_provider_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own SMS provider settings"
  ON sms_provider_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own SMS provider settings"
  ON sms_provider_settings FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_sms_provider_settings_updated_at
  BEFORE UPDATE ON sms_provider_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add columns to message_logs if they don't exist
ALTER TABLE message_logs 
  ADD COLUMN IF NOT EXISTS provider_type TEXT,
  ADD COLUMN IF NOT EXISTS sms_provider_settings_id UUID REFERENCES sms_provider_settings(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cost DECIMAL(10,4);