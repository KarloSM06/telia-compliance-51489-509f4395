-- Security Fix: Add RLS policies for webhook_secrets table
-- Fixes "RLS Enabled No Policy" warning

CREATE POLICY "Users can view their own webhook secrets"
ON public.webhook_secrets
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.integrations
    WHERE integrations.id = webhook_secrets.integration_id
    AND integrations.user_id = auth.uid()
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
    AND integrations.user_id = auth.uid()
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
    AND integrations.user_id = auth.uid()
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
    AND integrations.user_id = auth.uid()
  )
);

-- Security Fix: Add SET search_path to security definer functions
-- Fixes "Function Search Path Mutable" warnings

CREATE OR REPLACE FUNCTION public.trigger_review_analysis()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  last_analysis_time TIMESTAMPTZ;
  should_analyze BOOLEAN;
  queue_exists BOOLEAN;
BEGIN
  -- Check when last analysis was run for this user
  SELECT MAX(created_at) INTO last_analysis_time
  FROM review_insights
  WHERE user_id = NEW.user_id;
  
  -- Only run analysis if:
  -- 1. No analysis has been run before, OR
  -- 2. More than 1 hour has passed since last analysis
  should_analyze := (
    last_analysis_time IS NULL OR 
    (NOW() - last_analysis_time) > INTERVAL '1 hour'
  );
  
  IF should_analyze THEN
    -- Check if there's already a pending job for this user
    SELECT EXISTS(
      SELECT 1 FROM review_analysis_queue
      WHERE user_id = NEW.user_id 
        AND status IN ('pending', 'processing')
    ) INTO queue_exists;
    
    -- Only create new job if none exists
    IF NOT queue_exists THEN
      INSERT INTO review_analysis_queue (
        user_id,
        trigger_source,
        scheduled_for,
        status
      ) VALUES (
        NEW.user_id,
        'database',
        NOW() + INTERVAL '2 minutes', -- Wait 2 minutes to batch multiple changes
        'pending'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_integration_webhook_token()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only generate token for telephony providers if not already set
  IF NEW.webhook_token IS NULL AND NEW.provider_type IN ('telephony', 'multi') THEN
    NEW.webhook_token := encode(gen_random_bytes(32), 'hex');
  END IF;
  RETURN NEW;
END;
$function$;