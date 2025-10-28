-- Add SELECT and DELETE policies to bookings table for GDPR compliance and user data management

-- Allow users to view their own bookings
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  USING (user_id = auth.uid());

-- Allow users to delete their own bookings (GDPR right to deletion)
CREATE POLICY "Users can delete own bookings"
  ON public.bookings FOR DELETE
  USING (user_id = auth.uid());