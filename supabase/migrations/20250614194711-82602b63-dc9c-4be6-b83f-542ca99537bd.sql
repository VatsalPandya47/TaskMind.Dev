
-- Create table to store Zoom OAuth tokens
CREATE TABLE public.zoom_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  scope TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table to store Zoom meeting data
CREATE TABLE public.zoom_meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  zoom_meeting_id TEXT NOT NULL,
  zoom_uuid TEXT,
  topic TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in minutes
  recording_files JSONB,
  transcript_file_url TEXT,
  meeting_id UUID REFERENCES public.meetings(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(zoom_meeting_id, user_id)
);

-- Add RLS policies for zoom_tokens
ALTER TABLE public.zoom_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own zoom tokens" 
  ON public.zoom_tokens 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own zoom tokens" 
  ON public.zoom_tokens 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own zoom tokens" 
  ON public.zoom_tokens 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own zoom tokens" 
  ON public.zoom_tokens 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for zoom_meetings
ALTER TABLE public.zoom_meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own zoom meetings" 
  ON public.zoom_meetings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own zoom meetings" 
  ON public.zoom_meetings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own zoom meetings" 
  ON public.zoom_meetings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own zoom meetings" 
  ON public.zoom_meetings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add zoom_meeting_id column to meetings table to link with Zoom
ALTER TABLE public.meetings 
ADD COLUMN zoom_meeting_id TEXT,
ADD COLUMN zoom_uuid TEXT;
