-- Create phone_numbers table for storing demo requests
CREATE TABLE public.phone_numbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.phone_numbers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert phone numbers (for demo requests)
CREATE POLICY "Anyone can insert phone numbers"
ON public.phone_numbers
FOR INSERT
TO public
WITH CHECK (true);

-- Only authenticated users can view phone numbers (admins can add more restrictive policies later)
CREATE POLICY "Authenticated users can view phone numbers"
ON public.phone_numbers
FOR SELECT
TO authenticated
USING (true);