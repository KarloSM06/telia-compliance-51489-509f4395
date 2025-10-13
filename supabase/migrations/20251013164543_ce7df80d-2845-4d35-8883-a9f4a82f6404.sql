-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = $1
      AND user_roles.role = 'admin'
  );
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Update user_products RLS policies to allow admins full access
DROP POLICY IF EXISTS "Users can view own products" ON public.user_products;

CREATE POLICY "Users can view own products"
  ON public.user_products
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can insert any products"
  ON public.user_products
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Insert admin roles for the two specified users
INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('2428b857-5338-4448-acf0-231a7deb51ba', 'admin'),
  ('44c78baa-b342-49f4-b5f4-a4da35a7907b', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;