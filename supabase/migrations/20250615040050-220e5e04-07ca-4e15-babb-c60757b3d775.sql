
-- Create a table to store Slack API tokens
CREATE TABLE public.slack_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  team_id TEXT,
  team_name TEXT,
  scope TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add an index for faster lookups on user_id
CREATE INDEX slack_tokens_user_id_idx ON public.slack_tokens(user_id);

-- Enable Row Level Security to protect user data
ALTER TABLE public.slack_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own Slack tokens.
CREATE POLICY "Users can view their own Slack tokens"
ON public.slack_tokens FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can create their own Slack tokens.
CREATE POLICY "Users can insert their own Slack tokens"
ON public.slack_tokens FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own Slack tokens.
CREATE POLICY "Users can delete their own Slack tokens"
ON public.slack_tokens FOR DELETE
USING (auth.uid() = user_id);
