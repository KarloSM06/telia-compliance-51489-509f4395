-- Sätt direction och message_source för befintliga påminnelser
UPDATE message_logs 
SET 
  direction = 'outbound',
  message_source = 'calendar_notification',
  delivered_at = COALESCE(delivered_at, sent_at)
WHERE 
  scheduled_message_id IS NOT NULL 
  AND direction IS NULL;

-- Fixa delivered_at för alla "delivered" meddelanden som saknar tidsstämpel
UPDATE message_logs
SET delivered_at = sent_at
WHERE 
  status = 'delivered' 
  AND delivered_at IS NULL
  AND sent_at IS NOT NULL;