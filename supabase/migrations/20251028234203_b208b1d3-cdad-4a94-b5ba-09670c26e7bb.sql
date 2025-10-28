-- Update auto-set capabilities function to include all calendar providers
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
    WHEN 'outlook' THEN
      NEW.capabilities := ARRAY['calendar_sync', 'event_management'];
      NEW.provider_type := 'calendar';
    WHEN 'simplybook' THEN
      NEW.capabilities := ARRAY['calendar_sync', 'booking', 'customer_management'];
      NEW.provider_type := 'calendar';
    WHEN 'bokamera' THEN
      NEW.capabilities := ARRAY['calendar_sync', 'booking', 'customer_management'];
      NEW.provider_type := 'calendar';
    WHEN 'hapio' THEN
      NEW.capabilities := ARRAY['calendar_sync', 'booking', 'customer_management'];
      NEW.provider_type := 'calendar';
    WHEN 'bookeo' THEN
      NEW.capabilities := ARRAY['calendar_sync', 'booking', 'payment'];
      NEW.provider_type := 'calendar';
    WHEN 'supersaas' THEN
      NEW.capabilities := ARRAY['calendar_sync', 'booking', 'customer_management'];
      NEW.provider_type := 'calendar';
    WHEN 'tixly' THEN
      NEW.capabilities := ARRAY['calendar_sync', 'booking', 'customer_management'];
      NEW.provider_type := 'calendar';
    WHEN 'hogia_bookit' THEN
      NEW.capabilities := ARRAY['calendar_sync', 'booking', 'customer_management'];
      NEW.provider_type := 'calendar';
    WHEN 'ireserve' THEN
      NEW.capabilities := ARRAY['calendar_sync', 'booking', 'customer_management'];
      NEW.provider_type := 'calendar';
    WHEN 'bokadirekt' THEN
      NEW.capabilities := ARRAY['calendar_sync', 'booking', 'customer_management'];
      NEW.provider_type := 'calendar';
    WHEN 'bokase' THEN
      NEW.capabilities := ARRAY['calendar_sync'];
      NEW.provider_type := 'calendar';
    ELSE
      -- Keep existing capabilities if provider not recognized
      NULL;
  END CASE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;