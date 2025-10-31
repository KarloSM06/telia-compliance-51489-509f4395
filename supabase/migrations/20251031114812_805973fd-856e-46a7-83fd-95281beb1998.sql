-- Optimize webhook_secrets RLS policies for better performance
-- Replace auth.uid() with (SELECT auth.uid()) to prevent row-by-row reevaluation

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own webhook secrets" ON public.webhook_secrets;
DROP POLICY IF EXISTS "Users can insert their own webhook secrets" ON public.webhook_secrets;
DROP POLICY IF EXISTS "Users can update their own webhook secrets" ON public.webhook_secrets;
DROP POLICY IF EXISTS "Users can delete their own webhook secrets" ON public.webhook_secrets;

-- Create optimized policies with (SELECT auth.uid())
CREATE POLICY "Users can view their own webhook secrets"
ON public.webhook_secrets
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.integrations
    WHERE integrations.id = webhook_secrets.integration_id
    AND integrations.user_id = (SELECT auth.uid())
  )
);

CREATE POLICY "Users can insert their own webhook secrets"
ON public.webhook_secrets
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.integrations
    WHERE integrations.id = webhook_secrets.integration_id
    AND integrations.user_id = (SELECT auth.uid())
  )
);

CREATE POLICY "Users can update their own webhook secrets"
ON public.webhook_secrets
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.integrations
    WHERE integrations.id = webhook_secrets.integration_id
    AND integrations.user_id = (SELECT auth.uid())
  )
);

CREATE POLICY "Users can delete their own webhook secrets"
ON public.webhook_secrets
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.integrations
    WHERE integrations.id = webhook_secrets.integration_id
    AND integrations.user_id = (SELECT auth.uid())
  )
);