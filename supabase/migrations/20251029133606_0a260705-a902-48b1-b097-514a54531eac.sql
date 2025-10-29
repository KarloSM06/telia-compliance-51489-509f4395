-- Set REPLICA IDENTITY FULL to ensure full row data is sent on UPDATE events
ALTER TABLE public.telephony_events REPLICA IDENTITY FULL;