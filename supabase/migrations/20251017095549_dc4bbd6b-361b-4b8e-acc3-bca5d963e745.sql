-- Create lead_searches table
CREATE TABLE public.lead_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Search criteria
  search_name TEXT NOT NULL,
  industry TEXT[],
  location TEXT[],
  company_size TEXT,
  revenue_range TEXT,
  keywords TEXT[],
  
  -- Metadata
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  leads_target INTEGER DEFAULT 50,
  leads_generated INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_run_at TIMESTAMPTZ
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  search_id UUID REFERENCES public.lead_searches(id) ON DELETE SET NULL,
  
  -- Lead information
  company_name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  industry TEXT,
  location TEXT,
  company_size TEXT,
  description TEXT,
  
  -- Lead quality and scoring
  ai_score INTEGER CHECK (ai_score >= 1 AND ai_score <= 100),
  ai_reasoning TEXT,
  
  -- Status and follow-up
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'rejected')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes TEXT,
  
  -- Metadata
  source TEXT DEFAULT 'n8n' CHECK (source IN ('n8n', 'manual', 'imported')),
  contacted_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create lead_activities table
CREATE TABLE public.lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  activity_type TEXT NOT NULL CHECK (activity_type IN ('email_sent', 'call_made', 'meeting_scheduled', 'note_added', 'status_changed')),
  description TEXT,
  metadata JSONB,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_lead_searches_user_id ON public.lead_searches(user_id);
CREATE INDEX idx_lead_searches_organization_id ON public.lead_searches(organization_id);
CREATE INDEX idx_lead_searches_status ON public.lead_searches(status);

CREATE INDEX idx_leads_user_id ON public.leads(user_id);
CREATE INDEX idx_leads_organization_id ON public.leads(organization_id);
CREATE INDEX idx_leads_search_id ON public.leads(search_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);

CREATE INDEX idx_lead_activities_lead_id ON public.lead_activities(lead_id);
CREATE INDEX idx_lead_activities_user_id ON public.lead_activities(user_id);

-- Enable RLS
ALTER TABLE public.lead_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

-- RLS policies for lead_searches
CREATE POLICY "Users can view own lead searches"
  ON public.lead_searches FOR SELECT
  USING (user_id = auth.uid() OR organization_id = user_organization_id(auth.uid()));

CREATE POLICY "Users can insert own lead searches"
  ON public.lead_searches FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own lead searches"
  ON public.lead_searches FOR UPDATE
  USING (user_id = auth.uid() OR organization_id = user_organization_id(auth.uid()));

CREATE POLICY "Users can delete own lead searches"
  ON public.lead_searches FOR DELETE
  USING (user_id = auth.uid());

-- RLS policies for leads
CREATE POLICY "Users can view own leads"
  ON public.leads FOR SELECT
  USING (user_id = auth.uid() OR organization_id = user_organization_id(auth.uid()));

CREATE POLICY "Users can insert own leads"
  ON public.leads FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own leads"
  ON public.leads FOR UPDATE
  USING (user_id = auth.uid() OR organization_id = user_organization_id(auth.uid()));

CREATE POLICY "Users can delete own leads"
  ON public.leads FOR DELETE
  USING (user_id = auth.uid());

-- RLS policies for lead_activities
CREATE POLICY "Users can view activities for own leads"
  ON public.lead_activities FOR SELECT
  USING (lead_id IN (SELECT id FROM public.leads WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert activities for own leads"
  ON public.lead_activities FOR INSERT
  WITH CHECK (user_id = auth.uid() AND lead_id IN (SELECT id FROM public.leads WHERE user_id = auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_lead_searches_updated_at
  BEFORE UPDATE ON public.lead_searches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();