-- Add RLS policies for Hiems_Kunddata table
ALTER TABLE public."Hiems_Kunddata" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own customer data"
ON public."Hiems_Kunddata"
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own customer data"
ON public."Hiems_Kunddata"
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customer data"
ON public."Hiems_Kunddata"
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for call_history table
ALTER TABLE public.call_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own call history"
ON public.call_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own call history"
ON public.call_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own call history"
ON public.call_history
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own call history"
ON public.call_history
FOR DELETE
USING (auth.uid() = user_id);

-- Add RLS policies for messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
ON public.messages
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
ON public.messages
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages"
ON public.messages
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
ON public.messages
FOR DELETE
USING (auth.uid() = user_id);