-- Add timezone support to calendar_events and availability_slots
-- Default all times to Europe/Stockholm timezone

-- Add timezone column to calendar_events
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Europe/Stockholm';

COMMENT ON COLUMN calendar_events.timezone IS 'Timezone for the event (default: Europe/Stockholm). Handles CET/CEST automatically.';

-- Add timezone column to availability_slots
ALTER TABLE availability_slots 
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Europe/Stockholm';

COMMENT ON COLUMN availability_slots.timezone IS 'Timezone for availability slot (default: Europe/Stockholm). Handles CET/CEST automatically.';

-- Create index for better performance on timezone queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_timezone 
ON calendar_events(timezone);

CREATE INDEX IF NOT EXISTS idx_availability_slots_timezone 
ON availability_slots(timezone);

-- Update existing records to have explicit timezone
UPDATE calendar_events 
SET timezone = 'Europe/Stockholm' 
WHERE timezone IS NULL;

UPDATE availability_slots 
SET timezone = 'Europe/Stockholm' 
WHERE timezone IS NULL;