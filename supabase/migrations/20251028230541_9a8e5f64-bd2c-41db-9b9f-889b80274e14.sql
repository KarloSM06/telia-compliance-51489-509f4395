-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update existing profiles that don't have telephony_webhook_token
UPDATE profiles 
SET telephony_webhook_token = encode(gen_random_bytes(32), 'hex')
WHERE telephony_webhook_token IS NULL;