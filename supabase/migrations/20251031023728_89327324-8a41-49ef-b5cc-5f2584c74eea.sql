-- Rename integration_monthly_cost to integration_cost and add integration_start_date
ALTER TABLE business_metrics 
  RENAME COLUMN integration_monthly_cost TO integration_cost;

-- Add integration_start_date column
ALTER TABLE business_metrics 
  ADD COLUMN integration_start_date date;

-- Add comment to clarify this is a one-time cost
COMMENT ON COLUMN business_metrics.integration_cost IS 'One-time upfront integration cost paid at start';
COMMENT ON COLUMN business_metrics.integration_start_date IS 'Date when the one-time integration cost was paid';
COMMENT ON COLUMN business_metrics.hiems_monthly_support_cost IS 'Recurring monthly cost for Hiems platform support';