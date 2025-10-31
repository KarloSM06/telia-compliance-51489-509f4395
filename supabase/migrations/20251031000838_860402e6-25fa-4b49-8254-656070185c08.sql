-- Create business_metrics table for ROI calculations
CREATE TABLE IF NOT EXISTS public.business_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- Basic business information
  annual_revenue DECIMAL(12,2),
  currency TEXT DEFAULT 'SEK',
  fiscal_year INTEGER,
  
  -- Service pricing (AI interprets bookings based on this)
  service_pricing JSONB DEFAULT '[]'::jsonb,
  -- Format: [{ service_name, avg_price, min_price, max_price, conversion_probability }]
  
  -- Uploaded documents
  uploaded_quotes JSONB DEFAULT '[]'::jsonb,
  uploaded_invoices JSONB DEFAULT '[]'::jsonb,
  -- Format: [{ file_name, file_url, amount, date, service_type }]
  
  -- Statistics from user
  meeting_to_payment_probability DECIMAL(5,2) DEFAULT 50.00,
  avg_project_cost DECIMAL(12,2),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT business_metrics_user_id_unique UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.business_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own business metrics"
  ON public.business_metrics
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own business metrics"
  ON public.business_metrics
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business metrics"
  ON public.business_metrics
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_business_metrics_updated_at
  BEFORE UPDATE ON public.business_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_business_metrics_user_id ON public.business_metrics(user_id);