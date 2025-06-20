-- Update summaries table to match the requested schema
-- Drop existing table if it exists and recreate with new schema
DROP TABLE IF EXISTS public.summaries CASCADE;

-- Create summaries table with the requested schema
CREATE TABLE public.summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transcript TEXT NOT NULL,
  summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  audio_name TEXT
);

-- Create index for better query performance
CREATE INDEX idx_summaries_user_id ON public.summaries(user_id);
CREATE INDEX idx_summaries_created_at ON public.summaries(created_at);

-- Enable Row Level Security
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for summaries table
CREATE POLICY "Users can view their summaries"
  ON public.summaries 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their summaries"
  ON public.summaries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their summaries"
  ON public.summaries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their summaries"
  ON public.summaries 
  FOR DELETE 
  USING (auth.uid() = user_id); 