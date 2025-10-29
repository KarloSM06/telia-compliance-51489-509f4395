-- Make account_id nullable since not all providers have this information
-- and it's not critical for event tracking
ALTER TABLE telephony_events 
ALTER COLUMN account_id DROP NOT NULL;

-- Add index for account_id for better query performance
CREATE INDEX IF NOT EXISTS idx_telephony_events_account_id 
ON telephony_events(account_id) 
WHERE account_id IS NOT NULL;