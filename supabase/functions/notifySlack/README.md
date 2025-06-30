# TaskMind Slack Integration

This Supabase Edge Function enables TaskMind to send notifications to Slack channels, providing real-time updates for tasks, meetings, summaries, and productivity insights.

## Features

### 🔔 Real-time Notifications
- **Task Management**: Notifications for task creation, completion, and reminders
- **Meeting Updates**: Alerts for new meetings, updates, and summaries
- **Productivity Insights**: Daily digests and weekly reports
- **Custom Messages**: Flexible notification system for any event

### 📊 Smart Notifications
- **Task Created**: New task alerts with priority and due date
- **Task Completed**: Celebration messages for completed tasks
- **Meeting Summaries**: AI-generated meeting summaries sent to Slack
- **Daily Digest**: Daily productivity overview
- **Weekly Reports**: Comprehensive weekly productivity analysis

## Setup

### 1. Slack App Configuration

1. **Create a Slack App**:
   - Go to [api.slack.com/apps](https://api.slack.com/apps)
   - Click "Create New App" → "From scratch"
   - Name: `TaskMind Integration`
   - Workspace: Select your workspace

2. **Configure Bot Token Scopes**:
   - Go to "OAuth & Permissions"
   - Add these Bot Token Scopes:
     - `chat:write` - Send messages to channels
     - `chat:write.public` - Send messages to public channels
     - `channels:read` - Read channel information

3. **Install App to Workspace**:
   - Click "Install to Workspace"
   - Authorize the app

4. **Get Credentials**:
   - Copy the **Bot User OAuth Token** (starts with `xoxb-`)
   - Note your **Channel ID** (e.g., `#general` → `C1234567890`)

### 2. Environment Variables

Set these secrets in your Supabase project:

```bash
# Set Slack credentials
supabase secrets set SLACK_BOT_TOKEN=xoxb-your-bot-token-here
supabase secrets set SLACK_CHANNEL_ID=C1234567890
```

### 3. Deploy the Function

```bash
# Deploy the notifySlack function
supabase functions deploy notifySlack
```

## Usage

### Frontend Integration

The Slack integration is fully integrated into TaskMind's React components:

#### 1. Settings Tab Integration
```tsx
import SlackIntegration from '@/components/SlackIntegration';

// In your settings component
<SlackIntegration 
  onSettingsChange={(settings) => {
    // Handle settings changes
    console.log('Slack settings updated:', settings);
  }}
/>
```

#### 2. Automatic Notifications
The integration automatically sends notifications when:
- Tasks are created or completed
- Meetings are scheduled or updated
- Meeting summaries are generated
- Daily/weekly reports are available

#### 3. Manual Testing
Use the test buttons in the Slack Integration settings to verify all notification types work correctly.

### API Usage

#### Send a Simple Message
```typescript
import { slackService } from '@/lib/slackService';

// Send a custom message
await slackService.sendCustomNotification({
  type: 'custom',
  title: 'Important Update',
  message: 'Your meeting summary is ready!',
  metadata: {
    userId: 'user123',
    priority: 'high'
  }
});
```

#### Task Notifications
```typescript
// Notify when a task is created
await slackService.notifyTaskCreated({
  title: 'Review Q4 Report',
  description: 'Complete the quarterly review',
  dueDate: '2024-01-15',
  priority: 'high'
});

// Notify when a task is completed
await slackService.notifyTaskCompleted({
  title: 'Review Q4 Report',
  description: 'Task completed successfully'
});
```

#### Meeting Notifications
```typescript
// Notify when a meeting is created
await slackService.notifyMeetingCreated({
  title: 'Team Standup',
  description: 'Daily team synchronization',
  date: '2024-01-10T10:00:00Z',
  duration: '30 minutes',
  location: 'Conference Room A'
});

// Send meeting summary
await slackService.notifyMeetingSummary(
  {
    title: 'Team Standup',
    date: '2024-01-10T10:00:00Z',
    duration: '30 minutes'
  },
  'Meeting summary content here...'
);
```

#### Digest and Reports
```typescript
// Send daily digest
await slackService.sendDailyDigest(tasks, meetings);

// Send weekly report
await slackService.sendWeeklyReport(tasks, meetings);
```

## Notification Types

### 🎯 Task Notifications
- **Task Created**: New task with title, description, due date, and priority
- **Task Completed**: Celebration message for completed tasks
- **Task Reminder**: Reminder for upcoming due dates

### 📅 Meeting Notifications
- **Meeting Created**: New meeting with details and location
- **Meeting Updated**: Changes to meeting details
- **Meeting Summary**: AI-generated summary of meeting content

### 📊 Productivity Reports
- **Daily Digest**: Overview of daily tasks and meetings
- **Weekly Report**: Comprehensive weekly productivity analysis

### 💬 Custom Messages
- **Custom Notifications**: Flexible messaging for any event
- **Test Messages**: Verification messages for integration testing

## Configuration

### Notification Preferences
Users can configure their Slack notification preferences in the TaskMind settings:

- **Enable/Disable**: Toggle Slack notifications on/off
- **Channel Selection**: Choose which Slack channel to use
- **Notification Types**: Select which events trigger notifications
- **Test Connection**: Verify the integration is working

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `SLACK_BOT_TOKEN` | Bot User OAuth Token | Yes |
| `SLACK_CHANNEL_ID` | Default channel ID | Yes |

## Error Handling

The integration includes comprehensive error handling:

- **Network Errors**: Automatic retry with exponential backoff
- **Authentication Errors**: Clear error messages for invalid tokens
- **Rate Limiting**: Respects Slack's rate limits
- **Fallback Behavior**: Graceful degradation when Slack is unavailable

## Security

- **Token Security**: Bot tokens are stored as Supabase secrets
- **Channel Validation**: Messages are only sent to authorized channels
- **User Permissions**: Respects Slack workspace permissions
- **Error Logging**: Secure error logging without exposing sensitive data

## Troubleshooting

### Common Issues

1. **"Invalid token" error**:
   - Verify your bot token starts with `xoxb-`
   - Ensure the token has the required scopes
   - Check that the app is installed to your workspace

2. **"Channel not found" error**:
   - Verify the channel ID is correct
   - Ensure the bot is invited to the channel
   - Check channel permissions

3. **"Rate limited" error**:
   - The function automatically handles rate limiting
   - Wait a few minutes and try again
   - Consider reducing notification frequency

4. **Messages not appearing**:
   - Check that the bot is online
   - Verify channel permissions
   - Test with the connection test button

### Testing

Use the test buttons in the Slack Integration settings to verify:
- Connection to Slack
- Message delivery
- All notification types
- Error handling

## Development

### Local Development
```bash
# Start Supabase locally
supabase start

# Set local secrets
supabase secrets set SLACK_BOT_TOKEN=xoxb-your-token
supabase secrets set SLACK_CHANNEL_ID=C1234567890

# Test the function
supabase functions serve notifySlack
```

### Function Structure
```
supabase/functions/notifySlack/
├── index.ts          # Main function code
├── README.md         # This documentation
└── test.ts           # Test cases
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the error logs in Supabase dashboard
3. Test the connection using the test buttons
4. Contact the TaskMind support team

---

**Note**: This integration requires a Slack workspace with appropriate permissions. The bot will only send messages to channels where it has been invited and has the necessary permissions. 