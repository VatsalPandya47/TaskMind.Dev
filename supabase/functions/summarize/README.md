# Summarize Function

A Supabase Edge Function that generates comprehensive meeting summaries using OpenAI's GPT-4o-mini model. This function processes meeting transcripts and creates structured summaries with key topics, decisions, action items, insights, and next steps.

## 🚀 Features

- **AI-Powered Summarization**: Uses OpenAI's GPT-4o-mini for high-quality summaries
- **Structured Output**: Organizes content into clear sections (Topics, Decisions, Actions, Insights, Next Steps)
- **Robust Error Handling**: Comprehensive retry logic with exponential backoff
- **Rate Limiting**: Graceful handling of OpenAI API rate limits
- **Authentication**: Secure user verification and meeting ownership validation
- **Dry Run Mode**: Test functionality without saving to database
- **Comprehensive Logging**: Detailed logging for debugging and monitoring

## 📋 Prerequisites

- Supabase project with Edge Functions enabled
- OpenAI API key with GPT-4o-mini access
- Supabase CLI installed (`npm install -g supabase`)

## 🔧 Setup

### 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. Database Schema

Ensure your database has the following tables:

#### Meetings Table
```sql
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  date DATE,
  summary TEXT, -- Legacy field, summaries now stored in summaries table
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Summaries Table (New)
```sql
CREATE TABLE summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE NOT NULL,
  summary TEXT NOT NULL,
  transcript_sample TEXT, -- Store a sample of the transcript used
  ai_model TEXT DEFAULT 'gpt-4o-mini',
  prompt_version TEXT DEFAULT 'summarizer-v1',
  processing_time_ms INTEGER, -- Time taken to generate summary
  retry_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one summary per meeting
  UNIQUE(meeting_id)
);

-- Create indexes for better performance
CREATE INDEX idx_summaries_user_id ON summaries(user_id);
CREATE INDEX idx_summaries_meeting_id ON summaries(meeting_id);
CREATE INDEX idx_summaries_created_at ON summaries(created_at);
```

#### Row Level Security (RLS)
```sql
-- Enable RLS on both tables
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meetings
CREATE POLICY "Users can view own meetings" ON meetings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meetings" ON meetings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meetings" ON meetings
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for summaries
CREATE POLICY "Users can view their own summaries" ON summaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own summaries" ON summaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own summaries" ON summaries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own summaries" ON summaries
  FOR DELETE USING (auth.uid() = user_id);
```

### 3. Deploy the Function

```bash
# Deploy to production
npx supabase functions deploy summarize

# Or deploy with environment variables
npx supabase functions deploy summarize --env-file .env.local
```

## 📡 API Reference

### Endpoint

```
POST /functions/v1/summarize
```

### Request Headers

```http
Authorization: Bearer <user_jwt_token>
Content-Type: application/json
```

### Request Body

```typescript
{
  meetingId: string;      // UUID of the meeting to summarize
  transcript: string;     // Meeting transcript text
  dry_run?: boolean;      // Optional: test mode (default: false)
}
```

### Response Format

#### Success Response (200)

```typescript
{
  success: true;
  message: "Successfully generated and saved meeting summary" | "Dry run: generated summary, not saved to DB.";
  summary: string;        // Generated summary text
  meetingId: string;      // Meeting ID
  summaryId?: string;     // Summary ID (only for non-dry runs)
  processing_time_ms?: number; // Time taken to generate summary (only for non-dry runs)
  dry_run: boolean;       // Whether this was a dry run
}
```

#### Error Response (4xx/5xx)

```typescript
{
  success: false;
  error: string;          // Human-readable error message
  code?: string;          // Error code for programmatic handling
  details?: string;       // Additional error details (optional)
}
```

## 🎯 Usage Examples

### Using the React Hook

```typescript
import { useSummarize } from '@/hooks/useSummarize';

function MeetingComponent() {
  const { summarizeTranscript, isSummarizing } = useSummarize();

  const handleSummarize = async () => {
    try {
      const result = await summarizeTranscript.mutateAsync({
        meetingId: 'your-meeting-id',
        transcript: 'meeting transcript text...',
        dry_run: false // Set to true for testing
      });
      
      console.log('Summary generated:', result.summary);
    } catch (error) {
      console.error('Summarization failed:', error);
    }
  };

  return (
    <button 
      onClick={handleSummarize} 
      disabled={isSummarizing}
    >
      {isSummarizing ? 'Generating...' : 'Generate Summary'}
    </button>
  );
}
```

### Direct API Call

```typescript
const response = await fetch('/functions/v1/summarize', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    meetingId: 'meeting-uuid',
    transcript: 'Meeting transcript content...',
    dry_run: false
  })
});

const data = await response.json();
```

### cURL Example

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/summarize' \
  -H 'Authorization: Bearer your_jwt_token' \
  -H 'Content-Type: application/json' \
  -d '{
    "meetingId": "meeting-uuid",
    "transcript": "Meeting transcript content...",
    "dry_run": false
  }'
```

## 🧪 Dry Run Mode

The `dry_run` parameter allows you to test the function without saving results to the database:

```typescript
// Test mode - generates summary but doesn't save
const result = await summarizeTranscript.mutateAsync({
  meetingId: 'test-meeting-id',
  transcript: 'Test transcript...',
  dry_run: true
});

// Response includes summary but meeting is not updated
console.log(result.summary); // Summary text
console.log(result.message); // "Dry run: generated summary, not saved to DB."
```

## ⚠️ Error Codes

| Code | HTTP Status | Description | Action |
|------|-------------|-------------|---------|
| `RATE_LIMITED` | 429 | OpenAI API rate limit exceeded | Wait a few minutes and retry |
| `INVALID_API_KEY` | 500 | OpenAI API key is invalid | Check API key configuration |
| `SERVICE_ERROR` | 503 | OpenAI service temporarily unavailable | Retry later |
| `SUMMARY_ERROR` | 422 | AI failed to generate valid summary | Check transcript quality |
| `DB_ERROR` | 500 | Database operation failed | Check database connection |
| `AUTH_ERROR` | 401 | User not authenticated | Ensure valid JWT token |
| `MEETING_NOT_FOUND` | 404 | Meeting doesn't exist or unauthorized | Verify meeting ID and ownership |

### Error Handling Example

```typescript
try {
  const result = await summarizeTranscript.mutateAsync({
    meetingId: 'meeting-id',
    transcript: 'transcript...'
  });
} catch (error) {
  switch (error.code) {
    case 'RATE_LIMITED':
      // Show user-friendly message about waiting
      break;
    case 'INVALID_API_KEY':
      // Contact support or check configuration
      break;
    case 'SUMMARY_ERROR':
      // Suggest improving transcript quality
      break;
    default:
      // Handle unexpected errors
      break;
  }
}
```

## 📊 Summary Format

The AI generates summaries with the following structure:

```
## Meeting Summary

**Key Topics Discussed:**
- Main subjects and themes covered in the meeting

**Important Decisions:**
- Decisions made during the meeting

**Action Items:**
- Tasks assigned and responsibilities

**Key Insights:**
- Important points or revelations

**Next Steps:**
- What happens after this meeting
```

## 🔒 Security

- **Authentication Required**: All requests must include a valid JWT token
- **User Ownership**: Users can only summarize their own meetings
- **Row Level Security**: Database policies enforce access control
- **Input Validation**: All parameters are validated before processing
- **Rate Limiting**: Built-in protection against API abuse

## 🚀 Performance

- **Model**: GPT-4o-mini for optimal cost/performance balance
- **Retry Logic**: Exponential backoff for transient failures
- **Timeout**: Maximum 30 seconds per request (including retries)
- **Concurrent Requests**: Handles multiple simultaneous requests
- **Caching**: No caching implemented (each request generates fresh summary)

## 🧪 Testing

### Run Tests Locally

```bash
# Run all tests
deno test --allow-env --allow-net supabase/functions/summarize/test.ts

# Run with verbose output
deno test --allow-env --allow-net --verbose supabase/functions/summarize/test.ts

# Run specific test categories
deno test --allow-env --allow-net --filter "Integration Tests" supabase/functions/summarize/test.ts
```

### Test Scenarios Covered

- ✅ Valid transcript processing
- ✅ Empty transcript handling
- ✅ Authentication validation
- ✅ Meeting ownership verification
- ✅ Dry run mode functionality
- ✅ Error handling and retry logic
- ✅ Rate limiting scenarios
- ✅ Performance and load testing

## 📝 Logging

The function provides comprehensive logging for debugging and monitoring:

```typescript
// Example log output
console.log('[Summarize] Starting summarization for meeting:', meetingId);
console.log('[Summarize] OpenAI API attempt 1/3');
console.log('[Summarize] Successfully generated summary');
console.error('[Summarize] API call failed:', error);
```

### Log Levels

- **Info**: General operation logs
- **Warning**: Retry attempts and non-critical issues
- **Error**: Failures and exceptions
- **Debug**: Detailed operation information

## 🔧 Configuration

### OpenAI Settings

```typescript
// Model configuration
model: 'gpt-4o-mini'
temperature: 0.3          // Low temperature for consistent output
max_tokens: 1500         // Maximum response length
```

### Retry Configuration

```typescript
// Retry settings
maxRetries: 3            // Maximum retry attempts
baseDelay: 1000          // Base delay in milliseconds
maxDelay: 10000          // Maximum delay cap
backoffMultiplier: 2     // Exponential backoff multiplier
```

## 🚨 Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Ensure `OPENAI_API_KEY` is set in environment variables
   - Verify the key has access to GPT-4o-mini

2. **"Meeting not found or unauthorized"**
   - Check that the meeting ID exists
   - Verify the user owns the meeting
   - Ensure JWT token is valid

3. **"AI service is temporarily unavailable"**
   - Check OpenAI service status
   - Verify API key permissions
   - Wait and retry the request

4. **"Failed to generate a valid summary"**
   - Ensure transcript has sufficient content (>50 characters)
   - Check transcript quality and readability
   - Try with a different transcript

### Debug Mode

Enable detailed logging by setting the environment variable:

```bash
DEBUG=true
```

## 📈 Monitoring

Monitor function performance and errors:

```bash
# View function logs
npx supabase functions logs summarize

# Monitor real-time logs
npx supabase functions logs summarize --follow
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This function is part of the TaskMind.Dev project and follows the project's licensing terms.

## 🆘 Support

For issues and questions:

1. Check the troubleshooting section above
2. Review the test suite for examples
3. Check function logs for detailed error information
4. Open an issue in the project repository

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Compatibility**: Supabase Edge Functions, OpenAI GPT-4o-mini 