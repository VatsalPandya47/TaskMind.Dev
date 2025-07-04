-- Create table to store Asana OAuth tokens
CREATE TABLE public.asana_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  scope TEXT,
  workspace_id TEXT,
  workspace_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.asana_tokens ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX asana_tokens_user_id_idx ON public.asana_tokens USING btree (user_id);

-- Add RLS policies for asana_tokens
CREATE POLICY "Users can view their own asana tokens" 
  ON public.asana_tokens 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own asana tokens" 
  ON public.asana_tokens 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own asana tokens" 
  ON public.asana_tokens 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own asana tokens" 
  ON public.asana_tokens 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.asana_tokens TO authenticated;
GRANT ALL ON public.asana_tokens TO service_role; 