-- Utöka leads-tabellen med alla LinkedIn-kolumner
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS prospect_id text,
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS country_name text,
ADD COLUMN IF NOT EXISTS region_name text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS linkedin text,
ADD COLUMN IF NOT EXISTS experience jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS skills jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS interests jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS company_linkedin text,
ADD COLUMN IF NOT EXISTS job_department text,
ADD COLUMN IF NOT EXISTS job_seniority_level text,
ADD COLUMN IF NOT EXISTS job_title text,
ADD COLUMN IF NOT EXISTS business_id text;

-- Index för snabbare queries
CREATE INDEX IF NOT EXISTS idx_leads_prospect_id ON public.leads(prospect_id);
CREATE INDEX IF NOT EXISTS idx_leads_business_id ON public.leads(business_id);
CREATE INDEX IF NOT EXISTS idx_leads_city ON public.leads(city);
CREATE INDEX IF NOT EXISTS idx_leads_linkedin ON public.leads(linkedin);
CREATE INDEX IF NOT EXISTS idx_leads_provider ON public.leads(provider);