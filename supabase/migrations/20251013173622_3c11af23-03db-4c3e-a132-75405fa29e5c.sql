-- Dashboard Builder Tables

-- Dashboards table
CREATE TABLE IF NOT EXISTS public.dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  layout JSONB DEFAULT '[]'::jsonb,
  pages JSONB DEFAULT '[{"id": "page-1", "name": "Översikt", "layout": []}]'::jsonb,
  theme JSONB DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT false,
  is_template BOOLEAN DEFAULT false,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Dashboard Widgets
CREATE TABLE IF NOT EXISTS public.dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id UUID REFERENCES public.dashboards(id) ON DELETE CASCADE NOT NULL,
  page_id TEXT NOT NULL DEFAULT 'page-1',
  widget_type TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  data_source JSONB DEFAULT '{}'::jsonb,
  position JSONB NOT NULL DEFAULT '{"x": 0, "y": 0, "w": 4, "h": 2}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Dashboard Sharing
CREATE TABLE IF NOT EXISTS public.dashboard_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id UUID REFERENCES public.dashboards(id) ON DELETE CASCADE NOT NULL,
  shared_with_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_level TEXT NOT NULL DEFAULT 'view',
  share_token TEXT UNIQUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Widget Templates (marketplace)
CREATE TABLE IF NOT EXISTS public.widget_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  widget_type TEXT NOT NULL,
  config_template JSONB NOT NULL DEFAULT '{}'::jsonb,
  preview_image TEXT,
  category TEXT,
  downloads INT DEFAULT 0,
  rating NUMERIC(3,2),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widget_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dashboards
CREATE POLICY "Users can view own dashboards"
  ON public.dashboards FOR SELECT
  USING (
    user_id = auth.uid() 
    OR is_public = true 
    OR id IN (
      SELECT dashboard_id FROM public.dashboard_shares 
      WHERE shared_with_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own dashboards"
  ON public.dashboards FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own dashboards"
  ON public.dashboards FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own dashboards"
  ON public.dashboards FOR DELETE
  USING (user_id = auth.uid());

-- RLS Policies for dashboard_widgets
CREATE POLICY "Users can view widgets of accessible dashboards"
  ON public.dashboard_widgets FOR SELECT
  USING (
    dashboard_id IN (
      SELECT id FROM public.dashboards 
      WHERE user_id = auth.uid() 
      OR is_public = true
      OR id IN (
        SELECT dashboard_id FROM public.dashboard_shares 
        WHERE shared_with_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert widgets to own dashboards"
  ON public.dashboard_widgets FOR INSERT
  WITH CHECK (
    dashboard_id IN (
      SELECT id FROM public.dashboards WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update widgets in own dashboards"
  ON public.dashboard_widgets FOR UPDATE
  USING (
    dashboard_id IN (
      SELECT id FROM public.dashboards WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete widgets from own dashboards"
  ON public.dashboard_widgets FOR DELETE
  USING (
    dashboard_id IN (
      SELECT id FROM public.dashboards WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for dashboard_shares
CREATE POLICY "Users can view shares of own dashboards"
  ON public.dashboard_shares FOR SELECT
  USING (
    dashboard_id IN (
      SELECT id FROM public.dashboards WHERE user_id = auth.uid()
    )
    OR shared_with_user_id = auth.uid()
  );

CREATE POLICY "Users can create shares for own dashboards"
  ON public.dashboard_shares FOR INSERT
  WITH CHECK (
    dashboard_id IN (
      SELECT id FROM public.dashboards WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete shares of own dashboards"
  ON public.dashboard_shares FOR DELETE
  USING (
    dashboard_id IN (
      SELECT id FROM public.dashboards WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for widget_templates
CREATE POLICY "Users can view public templates"
  ON public.widget_templates FOR SELECT
  USING (is_public = true OR creator_id = auth.uid());

CREATE POLICY "Users can insert own templates"
  ON public.widget_templates FOR INSERT
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update own templates"
  ON public.widget_templates FOR UPDATE
  USING (creator_id = auth.uid());

CREATE POLICY "Users can delete own templates"
  ON public.widget_templates FOR DELETE
  USING (creator_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_dashboards_user_id ON public.dashboards(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_is_public ON public.dashboards(is_public);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_dashboard_id ON public.dashboard_widgets(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_shares_dashboard_id ON public.dashboard_shares(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_shares_user_id ON public.dashboard_shares(shared_with_user_id);
CREATE INDEX IF NOT EXISTS idx_widget_templates_category ON public.widget_templates(category);
CREATE INDEX IF NOT EXISTS idx_widget_templates_public ON public.widget_templates(is_public);