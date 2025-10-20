-- Fix 1: Enable RLS on tables that are missing it
-- Hiems_Kunddata
ALTER TABLE "Hiems_Kunddata" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access own Hiems customer data"
ON "Hiems_Kunddata"
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- call_history
ALTER TABLE call_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access own call history"
ON call_history
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access own messages"
ON messages
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Fix 2: Restrict phone_numbers table access
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view phone numbers" ON public.phone_numbers;

-- Add user_id column to properly scope access
ALTER TABLE public.phone_numbers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create restrictive policy
CREATE POLICY "Users can only view own phone numbers"
ON public.phone_numbers
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own phone numbers"
ON public.phone_numbers
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Fix 3: Restrict access to encryption functions
-- These should only be callable by service_role (edge functions), not by authenticated users
REVOKE EXECUTE ON FUNCTION public.encrypt_text(text, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.decrypt_text(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.encrypt_text(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.decrypt_text(text, text) TO service_role;