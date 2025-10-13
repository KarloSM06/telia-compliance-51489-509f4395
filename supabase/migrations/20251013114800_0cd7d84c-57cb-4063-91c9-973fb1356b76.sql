-- Add status column to Hiems_Kunddata (correct case)
ALTER TABLE public."Hiems_Kunddata" 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'ny';

-- Update the handle_new_user function to also insert into Hiems_Kunddata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW());
  
  -- Insert into Hiems_Kunddata table (only if not already exists)
  INSERT INTO public."Hiems_Kunddata" (
    user_id,
    email,
    username,
    created_at,
    status
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    NOW(),
    'ny'
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;