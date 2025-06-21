-- Create meetings table to store meeting information
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  participants TEXT[] DEFAULT '{}',
  duration TEXT,
  has_recording BOOLEAN DEFAULT false,
  summary TEXT,
  transcript TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table to store action items from meetings
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  assignee TEXT NOT NULL,
  due_date DATE,
  priority TEXT CHECK (priority IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

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

-- Add zoom_meeting_id column to meetings table to link with Zoom
ALTER TABLE public.meetings 
ADD COLUMN zoom_meeting_id TEXT,
ADD COLUMN zoom_uuid TEXT;

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

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zoom_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zoom_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for meetings table
CREATE POLICY "Users can view their own meetings" 
  ON public.meetings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meetings" 
  ON public.meetings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meetings" 
  ON public.meetings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meetings" 
  ON public.meetings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for tasks table
CREATE POLICY "Users can view their own tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Add RLS policies for zoom_tokens
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

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.email
  );
  RETURN new;
END;
$$;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to automatically update updated_at timestamp for summaries
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

-- Create trigger to automatically update updated_at for summaries
CREATE TRIGGER on_summary_updated
  BEFORE UPDATE ON public.summaries
  FOR EACH ROW EXECUTE PROCEDURE public.handle_summary_updated();
