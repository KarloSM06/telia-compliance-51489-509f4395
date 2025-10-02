-- Enable pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  gdpr_consent boolean DEFAULT false,
  gdpr_consent_date timestamptz,
  data_retention_days integer DEFAULT 90 NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Create calls table with encrypted fields
CREATE TABLE public.calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  encrypted_transcript text,
  encrypted_analysis jsonb,
  status text DEFAULT 'uploaded' NOT NULL,
  score numeric,
  sale_outcome boolean,
  duration text,
  created_at timestamptz NOT NULL DEFAULT now(),
  deletion_scheduled_at timestamptz
);

-- Enable RLS on calls
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

-- Calls RLS policies
CREATE POLICY "Users can view own calls"
ON public.calls FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own calls"
ON public.calls FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own calls"
ON public.calls FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own calls"
ON public.calls FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Create user_analysis table
CREATE TABLE public.user_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  total_calls integer DEFAULT 0 NOT NULL,
  average_score numeric,
  success_rate numeric,
  encrypted_insights jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on user_analysis
ALTER TABLE public.user_analysis ENABLE ROW LEVEL SECURITY;

-- User analysis RLS policies
CREATE POLICY "Users can view own analysis"
ON public.user_analysis FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own analysis"
ON public.user_analysis FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own analysis"
ON public.user_analysis FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Create data access log for GDPR audit trail
CREATE TABLE public.data_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action text NOT NULL,
  resource_type text,
  resource_id uuid,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on data_access_log
ALTER TABLE public.data_access_log ENABLE ROW LEVEL SECURITY;

-- Data access log RLS policies
CREATE POLICY "Users can view own access log"
ON public.data_access_log FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create encryption functions using pgcrypto
CREATE OR REPLACE FUNCTION public.encrypt_text(data text, key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN encode(pgp_sym_encrypt(data, key), 'base64');
END;
$$;

CREATE OR REPLACE FUNCTION public.decrypt_text(encrypted_data text, key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN pgp_sym_decrypt(decode(encrypted_data, 'base64'), key);
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-files', 'audio-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for audio-files bucket
CREATE POLICY "Users can upload own audio files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'audio-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own audio files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'audio-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own audio files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'audio-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW());
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to auto-delete old calls based on retention period
CREATE OR REPLACE FUNCTION public.auto_delete_old_calls()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.calls
  WHERE deletion_scheduled_at IS NOT NULL
    AND deletion_scheduled_at < NOW();
END;
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger to auto-update updated_at on user_analysis
CREATE TRIGGER update_user_analysis_updated_at
  BEFORE UPDATE ON public.user_analysis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();