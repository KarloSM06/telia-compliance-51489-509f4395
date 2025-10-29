-- Add x_call_sid column to telephony_events for reliable event matching
ALTER TABLE telephony_events 
ADD COLUMN IF NOT EXISTS x_call_sid TEXT;

-- Add index for fast lookups on x_call_sid
CREATE INDEX IF NOT EXISTS idx_telephony_events_x_call_sid 
ON telephony_events(x_call_sid) 
WHERE x_call_sid IS NOT NULL;