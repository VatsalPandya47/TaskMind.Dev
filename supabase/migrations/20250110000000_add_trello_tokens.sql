-- Create table to store Trello API keys and tokens
CREATE TABLE public.trello_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  api_key TEXT NOT NULL,
  token TEXT NOT NULL,
  username TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trello_tokens ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX trello_tokens_user_id_idx ON public.trello_tokens USING btree (user_id);

-- Add RLS policies for trello_tokens
CREATE POLICY "Users can view their own trello tokens" 
  ON public.trello_tokens 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trello tokens" 
  ON public.trello_tokens 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trello tokens" 
  ON public.trello_tokens 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trello tokens" 
  ON public.trello_tokens 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.trello_tokens TO authenticated;
GRANT ALL ON public.trello_tokens TO service_role; 