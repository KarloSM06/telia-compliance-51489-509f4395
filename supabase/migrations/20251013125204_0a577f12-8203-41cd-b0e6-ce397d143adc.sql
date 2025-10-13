-- Add tier and minutes_purchased columns to user_products table
ALTER TABLE public.user_products 
ADD COLUMN tier text CHECK (tier IN ('pro', 'business', 'enterprise')),
ADD COLUMN minutes_purchased integer;