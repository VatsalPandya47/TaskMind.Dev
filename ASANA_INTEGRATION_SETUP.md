# Asana OAuth Integration Setup

This document explains how to set up and use the Asana OAuth integration in TaskMind.Dev.

## Overview

The Asana integration allows users to:
- Connect their Asana account via OAuth 2.0
- View all projects in their workspace
- Create new tasks in any project
- Set task details like name, description, and due dates
- Manage the integration connection

## Architecture

The integration follows the same pattern as other OAuth integrations in the app:

### Backend Components (Supabase Edge Functions)
- `get-asana-auth-url` - Generates OAuth authorization URLs
- `asana-oauth-callback` - Handles OAuth callback and token exchange
- `get-asana-projects` - Fetches projects from Asana API
- `create-asana-task` - Creates tasks in Asana projects

### Database
- `asana_tokens` table - Stores OAuth tokens securely with RLS policies

### Frontend Components
- `AsanaIntegration` - Main integration UI component
- `AsanaCallback` - Handles OAuth callback processing
- `useAsanaAuth` - Hook for authentication management
- `useAsanaProjects` - Hook for projects and task management

## Setup Instructions

### 1. Create Asana OAuth App

1. Go to [Asana Developers Console](https://app.asana.com/0/my-apps)
2. Click "Create new app"
3. Fill in app details:
   - **App name**: TaskMind.Dev (or your preferred name)
   - **App description**: Task management integration
   - **App URL**: Your app's URL (e.g., https://taskmind.dev)
4. Set redirect URLs:
   - For development: `http://localhost:5173/asana-callback`
   - For production: `https://yourdomain.com/asana-callback`
5. Save and note down your **Client ID** and **Client Secret**

### 2. Configure Environment Variables

Add these environment variables to your Supabase project:

```bash
# In Supabase Dashboard > Settings > Edge Functions
ASANA_CLIENT_ID=your_asana_client_id_here
ASANA_CLIENT_SECRET=your_asana_client_secret_here
```

### 3. Deploy Edge Functions

Deploy the Asana integration functions to Supabase:

```bash
# Deploy all Asana functions
supabase functions deploy get-asana-auth-url
supabase functions deploy asana-oauth-callback  
supabase functions deploy get-asana-projects
supabase functions deploy create-asana-task
```

### 4. Run Database Migration

Apply the database migration to create the `asana_tokens` table:

```bash
supabase db push
```

### 5. Add Route Configuration

Add the Asana callback route to your app's routing configuration:

```tsx
// In your main routing component (e.g., App.tsx)
import AsanaCallback from "@/components/AsanaCallback";

// Add route
<Route path="/asana-callback" element={<AsanaCallback />} />
```

### 6. Integrate into Settings/Dashboard

Add the AsanaIntegration component to your settings or dashboard:

```tsx
import AsanaIntegration from "@/components/AsanaIntegration";

// In your settings or integrations section
<AsanaIntegration />
```

## Usage

### Connecting to Asana

1. Navigate to the integrations section
2. Click "Connect Asana Account"
3. You'll be redirected to Asana for authorization
4. After authorization, you'll be redirected back to the app
5. The integration will be marked as connected

### Creating Tasks

1. Once connected, you'll see your available projects
2. Click "Create Task" button
3. Fill in task details:
   - Select a project
   - Enter task name (required)
   - Add notes/description (optional)
   - Set due date (optional)
4. Click "Create Task" to add it to Asana

### Managing Connection

- Use the "Refresh" button to update your projects list
- Use the "Disconnect" button to remove the integration
- Reconnect anytime by clicking "Connect Asana Account" again

## API Endpoints

### GET /functions/v1/get-asana-auth-url
Generates OAuth authorization URL for Asana.

**Response:**
```json
{
  "authUrl": "https://app.asana.com/-/oauth_authorize?...",
  "state": "random-state-string",
  "redirectUri": "http://localhost:5173/asana-callback"
}
```

### POST /functions/v1/asana-oauth-callback
Handles OAuth callback and exchanges code for access token.

**Request:**
```json
{
  "code": "authorization-code",
  "state": "state-string",
  "redirect_uri": "http://localhost:5173/asana-callback"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Asana account connected successfully",
  "expires_at": "2025-01-01T00:00:00Z",
  "workspace_name": "My Workspace"
}
```

### GET /functions/v1/get-asana-projects
Fetches user's Asana projects.

**Response:**
```json
{
  "success": true,
  "projects": [
    {
      "gid": "project-id",
      "name": "Project Name",
      "notes": "Project description"
    }
  ],
  "workspace": {
    "id": "workspace-id", 
    "name": "Workspace Name"
  }
}
```

### POST /functions/v1/create-asana-task
Creates a new task in an Asana project.

**Request:**
```json
{
  "projectId": "project-gid",
  "name": "Task name",
  "notes": "Task description (optional)",
  "due_on": "2025-01-01 (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "task": {
    "gid": "task-id",
    "name": "Task name",
    "completed": false
  },
  "message": "Task created successfully in Asana"
}
```

## Security Features

- **State Parameter**: OAuth state parameter prevents CSRF attacks
- **Row Level Security**: Database policies ensure users only access their own tokens
- **Token Expiration**: Handles token expiration gracefully
- **Secure Storage**: Tokens stored securely in Supabase with encryption

## Troubleshooting

### Common Issues

1. **"Asana credentials not configured" error**
   - Ensure ASANA_CLIENT_ID and ASANA_CLIENT_SECRET are set in Supabase
   - Redeploy edge functions after setting environment variables

2. **"Invalid redirect URI" error**
   - Verify redirect URI matches what's configured in Asana app settings
   - Ensure the callback route is properly set up

3. **"Unauthorized" error when fetching projects**
   - Check if token has expired and user needs to reconnect
   - Verify token was saved correctly during OAuth callback

4. **"No projects found" message**
   - User might not have access to any projects in their workspace
   - Check Asana workspace permissions

### Debug Mode

Enable debug logging by checking the Supabase Edge Functions logs:

```bash
supabase functions logs get-asana-auth-url
supabase functions logs asana-oauth-callback
supabase functions logs get-asana-projects
supabase functions logs create-asana-task
```

## Asana API Documentation

For more details about Asana API capabilities:
- [Asana API Documentation](https://developers.asana.com/docs)
- [OAuth 2.0 Guide](https://developers.asana.com/docs/oauth)
- [Tasks API](https://developers.asana.com/docs/tasks)
- [Projects API](https://developers.asana.com/docs/projects)

## Rate Limits

Asana API has rate limits:
- 1500 requests per minute per app
- The integration handles rate limiting gracefully with error messages

## Future Enhancements

Potential improvements for the integration:
- Task assignment to team members
- Task status updates (mark as complete)
- Custom fields support
- Bulk task creation
- Task templates
- Integration with calendar for due dates
- Webhooks for real-time updates 