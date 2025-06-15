
-- Add columns to store the selected Slack channel for notifications
ALTER TABLE public.slack_tokens
ADD COLUMN selected_channel_id TEXT,
ADD COLUMN selected_channel_name TEXT;

-- Add comments for clarity
COMMENT ON COLUMN public.slack_tokens.selected_channel_id IS 'The ID of the Slack channel selected for notifications.';
COMMENT ON COLUMN public.slack_tokens.selected_channel_name IS 'The name of the Slack channel selected for notifications.';
