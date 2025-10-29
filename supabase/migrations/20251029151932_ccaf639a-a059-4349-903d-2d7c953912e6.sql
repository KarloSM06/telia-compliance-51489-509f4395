-- Add event aggregation columns to telephony_events
ALTER TABLE telephony_events ADD COLUMN IF NOT EXISTS parent_event_id UUID REFERENCES telephony_events(id) ON DELETE CASCADE;
ALTER TABLE telephony_events ADD COLUMN IF NOT EXISTS provider_layer TEXT CHECK (provider_layer IN ('agent', 'telephony', 'standalone'));
ALTER TABLE telephony_events ADD COLUMN IF NOT EXISTS related_events JSONB DEFAULT '[]'::jsonb;
ALTER TABLE telephony_events ADD COLUMN IF NOT EXISTS aggregate_cost_amount NUMERIC(10,4);
ALTER TABLE telephony_events ADD COLUMN IF NOT EXISTS cost_breakdown JSONB DEFAULT '{}'::jsonb;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_telephony_events_parent ON telephony_events(parent_event_id);
CREATE INDEX IF NOT EXISTS idx_telephony_events_layer ON telephony_events(provider_layer);
CREATE INDEX IF NOT EXISTS idx_telephony_events_timestamp ON telephony_events(event_timestamp);

-- Set provider_layer for existing data based on provider
UPDATE telephony_events 
SET provider_layer = CASE 
  WHEN provider IN ('vapi', 'retell') THEN 'agent'
  WHEN provider IN ('telnyx', 'twilio') THEN 'telephony'
  ELSE 'standalone'
END
WHERE provider_layer IS NULL;

-- Initialize cost_breakdown from existing data
UPDATE telephony_events 
SET cost_breakdown = jsonb_build_object(
  provider, jsonb_build_object(
    'amount', COALESCE(cost_amount, 0),
    'currency', COALESCE(cost_currency, 'USD'),
    'layer', provider_layer
  )
),
aggregate_cost_amount = COALESCE(cost_amount, 0)
WHERE cost_breakdown = '{}'::jsonb OR cost_breakdown IS NULL;