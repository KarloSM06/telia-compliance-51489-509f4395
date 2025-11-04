-- Fix customer_preferences security issue
-- Drop overly permissive policies that allow anyone to access/modify data
DROP POLICY IF EXISTS "Anyone can check opt-out status" ON public.customer_preferences;
DROP POLICY IF EXISTS "Anyone can update opt-out status with token" ON public.customer_preferences;
DROP POLICY IF EXISTS "System can insert preferences" ON public.customer_preferences;

-- Only service role (edge functions) can manage customer preferences
-- This forces all operations through the handle-unsubscribe edge function
-- which properly validates unsubscribe tokens
CREATE POLICY "Service role can manage customer preferences"
ON public.customer_preferences
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create audit log trigger for GDPR compliance
CREATE TABLE IF NOT EXISTS public.customer_preference_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  preference_id uuid REFERENCES public.customer_preferences(id) ON DELETE SET NULL,
  email text,
  phone text,
  action text NOT NULL,
  old_values jsonb,
  new_values jsonb,
  changed_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on audit table
ALTER TABLE public.customer_preference_audit ENABLE ROW LEVEL SECURITY;

-- Only service role can insert audit logs
CREATE POLICY "Service role can insert audit logs"
ON public.customer_preference_audit
FOR INSERT
TO service_role
WITH CHECK (true);

-- Create trigger function for audit logging
CREATE OR REPLACE FUNCTION public.log_customer_preference_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.customer_preference_audit (
      preference_id,
      email,
      phone,
      action,
      old_values,
      new_values
    ) VALUES (
      NEW.id,
      NEW.email,
      NEW.phone,
      'UPDATE',
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.customer_preference_audit (
      preference_id,
      email,
      phone,
      action,
      new_values
    ) VALUES (
      NEW.id,
      NEW.email,
      NEW.phone,
      'INSERT',
      to_jsonb(NEW)
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Attach trigger to customer_preferences
DROP TRIGGER IF EXISTS audit_customer_preference_changes ON public.customer_preferences;
CREATE TRIGGER audit_customer_preference_changes
AFTER INSERT OR UPDATE ON public.customer_preferences
FOR EACH ROW
EXECUTE FUNCTION public.log_customer_preference_change();