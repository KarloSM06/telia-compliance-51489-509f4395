-- Update existing integrations to have full capabilities
UPDATE integrations
SET 
  capabilities = ARRAY['voice', 'sms', 'mms', 'video', 'fax'],
  provider_type = 'multi',
  provider_display_name = REPLACE(provider_display_name, ' (SMS)', '')
WHERE provider = 'twilio';

UPDATE integrations
SET 
  capabilities = ARRAY['voice', 'sms', 'mms', 'fax', 'number_management'],
  provider_type = 'multi'
WHERE provider = 'telnyx';

UPDATE integrations
SET 
  capabilities = ARRAY['voice', 'ai_agent', 'realtime_streaming'],
  provider_type = 'telephony'
WHERE provider = 'vapi';

UPDATE integrations
SET 
  capabilities = ARRAY['voice', 'ai_agent', 'websocket'],
  provider_type = 'telephony'
WHERE provider = 'retell';

UPDATE integrations
SET 
  capabilities = ARRAY['calendar_sync'],
  provider_type = 'calendar'
WHERE provider = 'google_calendar';

UPDATE integrations
SET 
  capabilities = ARRAY['calendar_sync', 'booking', 'customer_management'],
  provider_type = 'calendar'
WHERE provider = 'simplybook';

UPDATE integrations
SET 
  capabilities = ARRAY['calendar_sync', 'booking', 'payment'],
  provider_type = 'calendar'
WHERE provider = 'bookeo';

-- Create function to auto-set full capabilities on insert/update
CREATE OR REPLACE FUNCTION public.auto_set_integration_capabilities()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-assign full capabilities based on provider
  CASE NEW.provider
    WHEN 'twilio' THEN
      NEW.capabilities := ARRAY['voice', 'sms', 'mms', 'video', 'fax'];
      NEW.provider_type := 'multi';
    WHEN 'telnyx' THEN
      NEW.capabilities := ARRAY['voice', 'sms', 'mms', 'fax', 'number_management'];
      NEW.provider_type := 'multi';
    WHEN 'vapi' THEN
      NEW.capabilities := ARRAY['voice', 'ai_agent', 'realtime_streaming'];
      NEW.provider_type := 'telephony';
    WHEN 'retell' THEN
      NEW.capabilities := ARRAY['voice', 'ai_agent', 'websocket'];
      NEW.provider_type := 'telephony';
    WHEN 'google_calendar' THEN
      NEW.capabilities := ARRAY['calendar_sync', 'event_management'];
      NEW.provider_type := 'calendar';
    WHEN 'simplybook' THEN
      NEW.capabilities := ARRAY['calendar_sync', 'booking', 'customer_management'];
      NEW.provider_type := 'calendar';
    WHEN 'bookeo' THEN
      NEW.capabilities := ARRAY['calendar_sync', 'booking', 'payment'];
      NEW.provider_type := 'calendar';
    ELSE
      -- Keep existing capabilities if provider not recognized
      NULL;
  END CASE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-set capabilities
DROP TRIGGER IF EXISTS auto_set_integration_capabilities_trigger ON public.integrations;
CREATE TRIGGER auto_set_integration_capabilities_trigger
  BEFORE INSERT OR UPDATE ON public.integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_set_integration_capabilities();