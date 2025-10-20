-- Create table for AI consultation form submissions
CREATE TABLE IF NOT EXISTS public.ai_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Section 1: Company info
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_description TEXT NOT NULL,
  
  -- Section 2: Goals & Vision
  ai_goals TEXT[] DEFAULT '{}',
  ai_goals_other TEXT,
  success_definition TEXT,
  ai_priority INTEGER CHECK (ai_priority >= 1 AND ai_priority <= 5),
  
  -- Section 3: Current situation
  manual_processes TEXT,
  existing_ai TEXT,
  current_systems TEXT,
  
  -- Section 4: Data
  data_types TEXT[] DEFAULT '{}',
  data_types_other TEXT,
  historical_data TEXT,
  data_quality INTEGER CHECK (data_quality >= 1 AND data_quality <= 5),
  gdpr_compliant TEXT,
  
  -- Section 5: Resources & Budget
  internal_resources TEXT[] DEFAULT '{}',
  internal_resources_other TEXT,
  budget TEXT,
  timeframe TEXT,
  
  -- Section 6: Users & Operations
  ai_users TEXT[] DEFAULT '{}',
  ai_users_other TEXT,
  training_needed TEXT,
  
  -- Section 7: Risks & Limitations
  regulatory_requirements TEXT,
  sensitive_data TEXT,
  ethical_limitations TEXT,
  
  -- Section 8: Future Vision
  long_term_goals TEXT,
  open_to_experiments TEXT
);

-- Enable RLS
ALTER TABLE public.ai_consultations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form submission)
CREATE POLICY "Anyone can submit AI consultation form"
  ON public.ai_consultations
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can view their own submissions
CREATE POLICY "Users can view AI consultations"
  ON public.ai_consultations
  FOR SELECT
  USING (auth.uid() IS NOT NULL);