-- Add lead_type and organization_type to lead_searches table
ALTER TABLE lead_searches 
ADD COLUMN IF NOT EXISTS lead_type TEXT DEFAULT 'business' CHECK (lead_type IN ('brf', 'business')),
ADD COLUMN IF NOT EXISTS organization_type TEXT,
ADD COLUMN IF NOT EXISTS apartment_range TEXT,
ADD COLUMN IF NOT EXISTS construction_year_range TEXT,
ADD COLUMN IF NOT EXISTS monthly_fee_range TEXT,
ADD COLUMN IF NOT EXISTS employee_range TEXT;

-- Add lead_type and organization_type to leads table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS lead_type TEXT DEFAULT 'business' CHECK (lead_type IN ('brf', 'business')),
ADD COLUMN IF NOT EXISTS organization_type TEXT,
ADD COLUMN IF NOT EXISTS apartment_count INTEGER,
ADD COLUMN IF NOT EXISTS construction_year INTEGER,
ADD COLUMN IF NOT EXISTS monthly_fee INTEGER,
ADD COLUMN IF NOT EXISTS employee_count INTEGER;

-- Add indexes for better query performance (skip if already exists)
CREATE INDEX IF NOT EXISTS idx_lead_searches_lead_type ON lead_searches(lead_type);
CREATE INDEX IF NOT EXISTS idx_leads_lead_type ON leads(lead_type);