-- Fas 1: Database Migration - Total Överarbetning av Telefoni-system

-- 1.1 Lägg till webhook token på user-nivå (profiles)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS telephony_webhook_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex');

CREATE INDEX IF NOT EXISTS idx_profiles_webhook ON profiles(telephony_webhook_token);

-- 1.2 Ta bort webhook_token från telephony_accounts (flyttar till user-nivå)
ALTER TABLE telephony_accounts 
DROP COLUMN IF EXISTS webhook_token;

-- 1.3 Skapa RLS policy för att läsa webhook token
DROP POLICY IF EXISTS "Users can read own webhook token" ON profiles;
CREATE POLICY "Users can read own webhook token"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- 1.4 Skapa trigger för auto-generering av webhook token
CREATE OR REPLACE FUNCTION ensure_user_webhook_token()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles 
  SET telephony_webhook_token = encode(gen_random_bytes(32), 'hex')
  WHERE id = NEW.user_id 
    AND telephony_webhook_token IS NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS auto_create_webhook_token ON telephony_accounts;
CREATE TRIGGER auto_create_webhook_token
  AFTER INSERT ON telephony_accounts
  FOR EACH ROW
  EXECUTE FUNCTION ensure_user_webhook_token();

-- Fas 5: Skapa telephony_webhook_logs tabell för monitoring
CREATE TABLE IF NOT EXISTS telephony_webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT,
  request_method TEXT,
  request_headers JSONB,
  request_body JSONB,
  response_status INTEGER,
  response_body TEXT,
  processing_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS för webhook logs
ALTER TABLE telephony_webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own webhook logs"
  ON telephony_webhook_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_webhook_logs_user ON telephony_webhook_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created ON telephony_webhook_logs(created_at DESC);