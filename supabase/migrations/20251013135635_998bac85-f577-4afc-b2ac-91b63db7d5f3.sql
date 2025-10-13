-- Allow anyone to insert bookings (for consultation bookings)
CREATE POLICY "Anyone can insert bookings"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);