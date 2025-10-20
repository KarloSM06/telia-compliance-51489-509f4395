-- Add 'enriched' status to leads table
-- This allows leads to be marked as enriched by AI

-- Note: The status column is already text type, so 'enriched' is automatically valid

-- Add index for better query performance on status
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);

-- Add index for Adress and Postal_Area for better search performance (note: capital letters)
CREATE INDEX IF NOT EXISTS idx_leads_adress ON public.leads("Adress");
CREATE INDEX IF NOT EXISTS idx_leads_postal_area ON public.leads("Postal_Area");