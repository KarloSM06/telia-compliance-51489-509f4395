-- Lägg till direction för enkel filtrering
ALTER TABLE message_logs ADD COLUMN IF NOT EXISTS direction text CHECK (direction IN ('inbound', 'outbound'));

-- Lägg till message_source för att kategorisera UTGÅENDE meddelanden
ALTER TABLE message_logs ADD COLUMN IF NOT EXISTS message_source text CHECK (message_source IN ('calendar_notification', 'ai_agent', 'manual', 'webhook'));

-- Lägg till message_type för att kategorisera INKOMMANDE meddelanden  
ALTER TABLE message_logs ADD COLUMN IF NOT EXISTS message_type text CHECK (message_type IN ('review', 'general', 'booking_request', 'question'));

-- Lägg till AI-klassificering metadata
ALTER TABLE message_logs ADD COLUMN IF NOT EXISTS ai_classification jsonb;

-- Lägg till index för snabbare queries
CREATE INDEX IF NOT EXISTS idx_message_logs_direction ON message_logs(direction);
CREATE INDEX IF NOT EXISTS idx_message_logs_message_type ON message_logs(message_type);
CREATE INDEX IF NOT EXISTS idx_message_logs_message_source ON message_logs(message_source);

-- Uppdatera direction baserat på metadata för befintliga poster
UPDATE message_logs 
SET direction = COALESCE(metadata->>'direction', 'outbound')
WHERE direction IS NULL;

-- Sätt message_source för befintliga meddelanden
UPDATE message_logs 
SET message_source = CASE 
  WHEN calendar_event_id IS NOT NULL THEN 'calendar_notification'
  WHEN scheduled_message_id IS NOT NULL THEN 'calendar_notification'
  ELSE 'manual'
END
WHERE direction = 'outbound' AND message_source IS NULL;

-- Sätt message_type till 'general' för gamla inkommande
UPDATE message_logs 
SET message_type = 'general'
WHERE direction = 'inbound' AND message_type IS NULL;