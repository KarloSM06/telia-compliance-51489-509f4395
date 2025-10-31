-- Consolidate multiple SELECT policies on ai_consultations for better performance
-- This fixes the "Multiple Permissive Policies" warnings

-- Drop the two separate SELECT policies
DROP POLICY IF EXISTS "Admins view all consultations" ON ai_consultations;
DROP POLICY IF EXISTS "Users view own consultations" ON ai_consultations;

-- Create a single consolidated policy with the same logic
CREATE POLICY "Users and admins can view consultations" ON ai_consultations
  FOR SELECT
  USING (
    -- Admins can see all consultations
    is_admin((select auth.uid()))
    OR 
    -- Users can see their own consultations (matched by email)
    email = (
      SELECT users.email 
      FROM auth.users 
      WHERE users.id = (select auth.uid())
    )::text
  );