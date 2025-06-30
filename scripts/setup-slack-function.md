# Slack Function Setup Guide

Since the Supabase CLI installation is having issues, here's how to set up the Slack function manually:

## 1. Set Environment Variables in Supabase Dashboard

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/jsxupnogyvfynjgkwdyj
2. Navigate to **Settings** → **Edge Functions**
3. Add the following environment variables:

### Environment Variable 1:
- **Key**: `SLACK_BOT_TOKEN`
- **Value**: `xoxb-your-bot-token-here` (Replace with your actual bot token)

### Environment Variable 2:
- **Key**: `SLACK_CHANNEL_ID`
- **Value**: `C1234567890` (Replace with your actual channel ID)

## 2. Get Your Slack Channel ID

1. Open Slack in your browser
2. Navigate to the channel where you want to send messages
3. Right-click on the channel name
4. Select "Copy link"
5. The channel ID is the last part of the URL (e.g., `C1234567890`)
6. Update the `SLACK_CHANNEL_ID` environment variable with this value

## 3. Deploy the Function

### Option A: Using Supabase Dashboard (Recommended)
1. Go to **Edge Functions** in your Supabase dashboard
2. Click **Create a new function**
3. Name it: `notifySlack`
4. Copy the contents of `supabase/functions/notifySlack/index.ts` into the function editor
5. Click **Deploy**

### Option B: Using Git (if you have CLI access)
```bash
# If you get Supabase CLI working later:
supabase functions deploy notifySlack
```

## 4. Test the Function

Once deployed, you can test it using curl or your application:

```bash
curl -X POST https://jsxupnogyvfynjgkwdyj.supabase.co/functions/v1/notifySlack \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -d '{"message": "Hello from TaskMind! 🚀"}'
```

## 5. Get Your Supabase Anon Key

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the **anon public** key
3. Use this key in the Authorization header when testing

## 6. Integration with Your App

You can now call the function from your React app:

```javascript
const sendSlackMessage = async (message) => {
  const response = await fetch('/functions/v1/notifySlack', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseKey}`
    },
    body: JSON.stringify({ message })
  });
  
  return response.json();
};
```

## Troubleshooting

- **401 Unauthorized**: Check your Supabase anon key
- **500 Internal Server Error**: Check your Slack bot token and channel ID
- **Channel not found**: Make sure the bot is added to the channel
- **Permission denied**: Ensure the bot has `chat:write` scope

## Security Notes

- Keep your Slack bot token secure
- Consider regenerating the token if it was exposed
- The bot token gives access to your Slack workspace
- Only share the token with trusted team members 