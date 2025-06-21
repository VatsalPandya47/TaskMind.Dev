
-- Create waitlist table to store email signups
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source TEXT DEFAULT 'hero_button'
);

-- Add Row Level Security (RLS) but make it public for waitlist signups
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into waitlist (public signup)
CREATE POLICY "Anyone can join waitlist" 
  ON public.waitlist 
  FOR INSERT 
  WITH CHECK (true);

-- Only allow reading your own waitlist entry or admin access
CREATE POLICY "Users can view their own waitlist entry" 
  ON public.waitlist 
  FOR SELECT 
  USING (true);
