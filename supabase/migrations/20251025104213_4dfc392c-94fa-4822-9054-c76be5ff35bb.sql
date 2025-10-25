-- Fix security warning: Add search_path to function
CREATE OR REPLACE FUNCTION notify_calendar_event_change()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Skip if change came from sync to avoid loops
  IF NEW.sync_state = 'syncing' OR NEW.sync_state = 'outbound_pending' THEN
    RETURN NEW;
  END IF;
  
  -- Push to outbound queue if event has external_id and source
  IF NEW.external_id IS NOT NULL AND NEW.source IS NOT NULL THEN
    INSERT INTO booking_sync_queue (
      integration_id,
      operation,
      entity_type,
      entity_id,
      payload,
      scheduled_at,
      status
    )
    SELECT 
      bsi.id,
      CASE 
        WHEN TG_OP = 'INSERT' THEN 'create'
        WHEN TG_OP = 'UPDATE' THEN 'update'
        WHEN TG_OP = 'DELETE' THEN 'delete'
      END,
      'calendar_event',
      COALESCE(NEW.id, OLD.id)::text,
      jsonb_build_object(
        'event_id', COALESCE(NEW.id, OLD.id),
        'external_id', COALESCE(NEW.external_id, OLD.external_id),
        'source', COALESCE(NEW.source, OLD.source),
        'operation', TG_OP,
        'sync_version', COALESCE(NEW.sync_version, 0)
      ),
      NOW(),
      'pending'
    FROM booking_system_integrations bsi
    WHERE bsi.provider = COALESCE(NEW.source, OLD.source)
      AND bsi.user_id = COALESCE(NEW.user_id, OLD.user_id)
      AND bsi.is_enabled = TRUE
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;