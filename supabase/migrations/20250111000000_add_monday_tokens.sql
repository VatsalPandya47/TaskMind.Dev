-- Create table to store Monday.com OAuth tokens
CREATE TABLE public.monday_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  scope TEXT,
  account_id TEXT,
  account_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.monday_tokens ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX monday_tokens_user_id_idx ON public.monday_tokens USING btree (user_id);

-- Add RLS policies for monday_tokens
CREATE POLICY "Users can view their own monday tokens" 
  ON public.monday_tokens 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own monday tokens" 
  ON public.monday_tokens 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monday tokens" 
  ON public.monday_tokens 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own monday tokens" 
  ON public.monday_tokens 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.monday_tokens TO authenticated;
GRANT ALL ON public.monday_tokens TO service_role; 