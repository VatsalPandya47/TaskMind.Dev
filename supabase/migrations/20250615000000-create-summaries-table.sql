-- Create summaries table to store AI-generated meeting summaries
CREATE TABLE public.summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE NOT NULL,
  summary TEXT NOT NULL,
  transcript_sample TEXT, -- Store a sample of the transcript used
  ai_model TEXT DEFAULT 'gpt-4o-mini',
  prompt_version TEXT DEFAULT 'summarizer-v1',
  processing_time_ms INTEGER, -- Time taken to generate summary
  retry_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one summary per meeting
  UNIQUE(meeting_id)
);

-- Create index for better query performance
CREATE INDEX idx_summaries_user_id ON public.summaries(user_id);
CREATE INDEX idx_summaries_meeting_id ON public.summaries(meeting_id);
CREATE INDEX idx_summaries_created_at ON public.summaries(created_at);

-- Enable Row Level Security
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for summaries table
CREATE POLICY "Users can view their own summaries" 
  ON public.summaries 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own summaries" 
  ON public.summaries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own summaries" 
  ON public.summaries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own summaries" 
  ON public.summaries 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_summary_updated()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update updated_at
CREATE TRIGGER on_summary_updated
  BEFORE UPDATE ON public.summaries
  FOR EACH ROW EXECUTE PROCEDURE public.handle_summary_updated(); 