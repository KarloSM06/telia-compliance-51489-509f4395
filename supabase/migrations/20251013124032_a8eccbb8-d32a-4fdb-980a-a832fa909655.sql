-- Create user_products table to track product ownership
CREATE TABLE public.user_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL,
  stripe_session_id TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.user_products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own products"
ON public.user_products
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products"
ON public.user_products
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_user_products_user_id ON public.user_products(user_id);
CREATE INDEX idx_user_products_status ON public.user_products(status);

-- Add trigger for updated_at
CREATE TRIGGER update_user_products_updated_at
BEFORE UPDATE ON public.user_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();