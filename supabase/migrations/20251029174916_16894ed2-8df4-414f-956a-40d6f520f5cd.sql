-- Enable RLS on phone_numbers_duplicate
ALTER TABLE phone_numbers_duplicate ENABLE ROW LEVEL SECURITY;

-- Users can view own phone numbers
CREATE POLICY "Users can view own phone numbers" 
ON phone_numbers_duplicate 
FOR SELECT 
USING (user_id = auth.uid());

-- Users can insert own phone numbers
CREATE POLICY "Users can insert own phone numbers" 
ON phone_numbers_duplicate 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Users can update own phone numbers
CREATE POLICY "Users can update own phone numbers" 
ON phone_numbers_duplicate 
FOR UPDATE 
USING (user_id = auth.uid());

-- Users can delete own phone numbers
CREATE POLICY "Users can delete own phone numbers" 
ON phone_numbers_duplicate 
FOR DELETE 
USING (user_id = auth.uid());

-- System can insert phone numbers (for service role)
CREATE POLICY "System can insert phone numbers" 
ON phone_numbers_duplicate 
FOR INSERT 
WITH CHECK (true);