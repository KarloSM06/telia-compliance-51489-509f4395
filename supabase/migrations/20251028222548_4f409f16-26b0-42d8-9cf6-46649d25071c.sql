-- Create user_api_keys table
CREATE TABLE user_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_name TEXT NOT NULL,
  api_key TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, key_name)
);

CREATE INDEX idx_user_api_keys_user ON user_api_keys(user_id);
CREATE INDEX idx_user_api_keys_key ON user_api_keys(api_key) WHERE is_active = true;

-- Enable RLS
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own API keys"
  ON user_api_keys FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own API keys"
  ON user_api_keys FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own API keys"
  ON user_api_keys FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own API keys"
  ON user_api_keys FOR DELETE
  USING (user_id = auth.uid());

-- Add webhook_token to telephony_accounts
ALTER TABLE telephony_accounts 
ADD COLUMN webhook_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex');

CREATE INDEX idx_telephony_accounts_webhook ON telephony_accounts(webhook_token) WHERE is_active = true;