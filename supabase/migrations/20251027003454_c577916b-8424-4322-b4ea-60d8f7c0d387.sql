-- Fas 6: Customer preferences tabell för opt-out funktionalitet
CREATE TABLE IF NOT EXISTS public.customer_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  phone TEXT,
  opt_out_sms BOOLEAN DEFAULT FALSE,
  opt_out_email BOOLEAN DEFAULT FALSE,
  unsubscribe_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index för snabba lookups
CREATE INDEX IF NOT EXISTS idx_customer_preferences_email ON public.customer_preferences(email);
CREATE INDEX IF NOT EXISTS idx_customer_preferences_phone ON public.customer_preferences(phone);
CREATE INDEX IF NOT EXISTS idx_customer_preferences_token ON public.customer_preferences(unsubscribe_token);

-- RLS policies
ALTER TABLE public.customer_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can check opt-out status"
  ON public.customer_preferences
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update opt-out status with token"
  ON public.customer_preferences
  FOR UPDATE
  USING (true);

CREATE POLICY "System can insert preferences"
  ON public.customer_preferences
  FOR INSERT
  WITH CHECK (true);

-- Fas 7: Uppdatera profiles tabell med språk och tonläge
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'sv',
ADD COLUMN IF NOT EXISTS default_tone TEXT DEFAULT 'friendly';

-- Trigger för att uppdatera updated_at
CREATE OR REPLACE FUNCTION public.update_customer_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_preferences_updated_at
  BEFORE UPDATE ON public.customer_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_customer_preferences_updated_at();