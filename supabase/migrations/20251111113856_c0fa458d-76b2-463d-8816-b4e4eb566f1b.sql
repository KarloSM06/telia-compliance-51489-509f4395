-- Skapa tabell för publika bokningsförfrågningar
CREATE TABLE public.booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aktivera RLS
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Tillåt publika användare att skicka bokningar (INSERT)
CREATE POLICY "Anyone can submit booking requests"
  ON public.booking_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Endast admins kan läsa bokningar
CREATE POLICY "Admins can view all booking requests"
  ON public.booking_requests
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

-- Endast admins kan uppdatera bokningar
CREATE POLICY "Admins can update booking requests"
  ON public.booking_requests
  FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Index för prestanda
CREATE INDEX idx_booking_requests_status ON public.booking_requests(status);
CREATE INDEX idx_booking_requests_created_at ON public.booking_requests(created_at DESC);

-- Trigger för updated_at
CREATE TRIGGER update_booking_requests_updated_at
  BEFORE UPDATE ON public.booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();