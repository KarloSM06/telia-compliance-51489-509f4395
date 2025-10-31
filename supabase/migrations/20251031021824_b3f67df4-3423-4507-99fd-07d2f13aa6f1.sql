-- Add Hiems platform costs to business_metrics table
ALTER TABLE business_metrics
ADD COLUMN IF NOT EXISTS hiems_monthly_support_cost NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS integration_monthly_cost NUMERIC DEFAULT 0;

COMMENT ON COLUMN business_metrics.hiems_monthly_support_cost IS 'Monthly cost for Hiems platform support in SEK';
COMMENT ON COLUMN business_metrics.integration_monthly_cost IS 'Monthly cost for external integrations in SEK';