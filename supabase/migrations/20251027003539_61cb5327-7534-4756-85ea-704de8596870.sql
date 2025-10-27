-- Fix: Function Search Path Mutable warning
DROP TRIGGER IF EXISTS update_customer_preferences_updated_at ON public.customer_preferences;
DROP FUNCTION IF EXISTS public.update_customer_preferences_updated_at();

CREATE OR REPLACE FUNCTION public.update_customer_preferences_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_customer_preferences_updated_at
  BEFORE UPDATE ON public.customer_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_customer_preferences_updated_at();