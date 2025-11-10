-- =====================================================
-- Security Fix: Secure ai_consultations Table
-- =====================================================

-- Remove existing public policy that allows anyone to submit
DROP POLICY IF EXISTS "Anyone can submit consultation requests" ON public.ai_consultations;

-- Add secure policy for admins to insert (only if doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ai_consultations' 
    AND policyname = 'Admins can insert consultations'
  ) THEN
    CREATE POLICY "Admins can insert consultations"
      ON public.ai_consultations
      FOR INSERT
      WITH CHECK (public.is_admin(auth.uid()));
      
    RAISE NOTICE 'Created policy: Admins can insert consultations';
  ELSE
    RAISE NOTICE 'Policy already exists: Admins can insert consultations';
  END IF;
  
  RAISE NOTICE 'Successfully secured ai_consultations table';
END $$;

-- Add helpful comment
COMMENT ON TABLE public.ai_consultations IS 
  'Stores AI consultation requests. Contains sensitive business data - admin access only.';