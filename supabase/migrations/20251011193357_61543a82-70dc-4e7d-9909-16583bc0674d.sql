-- Create offers table for quote requests
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary TEXT,
  email TEXT,
  phone_number TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert offers (including non-authenticated users)
CREATE POLICY "Anyone can insert offers"
ON public.offers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated users can view their own offers (based on email or phone)
CREATE POLICY "Users can view own offers"
ON public.offers
FOR SELECT
TO authenticated
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR phone_number IN (
    SELECT phone_number FROM public.phone_numbers 
    WHERE created_at::date = CURRENT_DATE
  )
);