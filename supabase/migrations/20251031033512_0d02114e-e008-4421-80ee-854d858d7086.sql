-- Add lead_id tracking to calendar_events and telephony_events for full funnel tracking
ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id) ON DELETE SET NULL;

ALTER TABLE telephony_events
ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id) ON DELETE SET NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_calendar_events_lead_id ON calendar_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_telephony_events_lead_id ON telephony_events(lead_id);

-- Add conversion tracking fields to leads
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS first_call_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS first_meeting_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS deal_closed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS deal_value DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS conversion_stage TEXT DEFAULT 'new' CHECK (conversion_stage IN ('new', 'contacted', 'meeting_scheduled', 'meeting_held', 'deal_closed', 'lost'));

-- Add service tracking to calendar_events
ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS service_type TEXT,
ADD COLUMN IF NOT EXISTS expected_revenue DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS actual_revenue DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS revenue_recognized_at TIMESTAMPTZ;

-- Create conversion_funnel_metrics table for tracking
CREATE TABLE IF NOT EXISTS conversion_funnel_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Funnel metrics
  leads_generated INTEGER DEFAULT 0,
  leads_contacted INTEGER DEFAULT 0,
  calls_made INTEGER DEFAULT 0,
  meetings_scheduled INTEGER DEFAULT 0,
  meetings_held INTEGER DEFAULT 0,
  deals_closed INTEGER DEFAULT 0,
  
  -- Conversion rates
  lead_to_contact_rate DECIMAL(5,2),
  contact_to_call_rate DECIMAL(5,2),
  call_to_meeting_rate DECIMAL(5,2),
  meeting_to_deal_rate DECIMAL(5,2),
  overall_conversion_rate DECIMAL(5,2),
  
  -- Revenue metrics
  total_revenue DECIMAL(12,2) DEFAULT 0,
  avg_deal_size DECIMAL(10,2),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(user_id, period_start, period_end)
);

-- Enable RLS
ALTER TABLE conversion_funnel_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversion_funnel_metrics
CREATE POLICY "Users can view their own funnel metrics"
ON conversion_funnel_metrics FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own funnel metrics"
ON conversion_funnel_metrics FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own funnel metrics"
ON conversion_funnel_metrics FOR UPDATE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_conversion_funnel_metrics_updated_at
BEFORE UPDATE ON conversion_funnel_metrics
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();