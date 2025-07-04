# Monday.com OAuth Integration Setup

This document explains how to set up and use the Monday.com OAuth integration in TaskMind.Dev.

## Overview

The Monday.com integration allows users to:
- Connect their Monday.com account via OAuth 2.0
- View all boards in their workspace
- Create new items in any board/group
- Set item details like name and column values
- Manage the integration connection

## Architecture

The integration follows the same pattern as other OAuth integrations in the app:

### Backend Components (Supabase Edge Functions)
- `get-monday-auth-url` - Generates OAuth authorization URLs
- `monday-oauth-callback` - Handles OAuth callback and token exchange
- `get-monday-boards` - Fetches boards from Monday.com GraphQL API
- `create-monday-item` - Creates items in Monday.com boards using GraphQL

### Database
- `monday_tokens` table - Stores OAuth tokens securely with RLS policies

### Frontend Components
- `MondayIntegration` - Main integration UI component
- `MondayCallback` - Handles OAuth callback processing
- `useMondayAuth` - Hook for authentication management
- `useMondayBoards` - Hook for boards and item management

## Setup Instructions

### 1. Create Monday.com OAuth App

1. Go to [Monday.com Developers](https://monday.com/developers)
2. Sign in with your Monday.com account
3. Click "Create App" or "My Apps" → "Create App"
4. Fill in app details:
   - **App name**: TaskMind.Dev (or your preferred name)
   - **App description**: Task management integration
   - **App URL**: Your app's URL (e.g., https://taskmind.dev)
5. Set redirect URLs:
   - For development: `http://localhost:5173/monday-callback`
   - For production: `https://yourdomain.com/monday-callback`
6. Set scopes: Select `boards:read` and `boards:write`
7. Save and note down your **Client ID** and **Client Secret**

### 2. Configure Environment Variables

Add these environment variables to your Supabase project:

```bash
# In Supabase Dashboard > Settings > Edge Functions
MONDAY_CLIENT_ID=your_monday_client_id_here
MONDAY_CLIENT_SECRET=your_monday_client_secret_here
```

### 3. ✅ Deploy Edge Functions (COMPLETED)

The Monday.com integration functions have been deployed:
- ✅ `get-monday-auth-url`
- ✅ `monday-oauth-callback`  
- ✅ `get-monday-boards`
- ✅ `create-monday-item`

### 4. ✅ Run Database Migration (COMPLETED)

The database migration has been applied:
- ✅ `monday_tokens` table created with RLS policies

### 5. ✅ Add Route Configuration (COMPLETED)

The Monday.com callback route has been added:
- ✅ `/monday-callback` route configured in App.tsx

### 6. ✅ Integrate into Settings (COMPLETED)

The MondayIntegration component has been added to the settings tab.

## Usage

### Connecting to Monday.com

1. Navigate to the Settings tab
2. Scroll to the Monday.com Integration section
3. Click "Connect Monday.com Account"
4. You'll be redirected to Monday.com for authorization
5. After authorization, you'll be redirected back to the app
6. The integration will be marked as connected

### Creating Items

1. Once connected, you'll see your available boards
2. Click "Create New Item" button
3. Fill in item details:
   - Select a board (required)
   - Select a group (optional)
   - Enter item name (required)
4. Click "Create Item" to add it to Monday.com

### Managing Connection

- Use the "Refresh" button to update your boards list
- Use the "Disconnect" button to remove the integration
- Reconnect anytime by clicking "Connect Monday.com Account" again

## API Endpoints

### GET /functions/v1/get-monday-auth-url
Generates OAuth authorization URL for Monday.com.

**Request Body:**
```json
{
  "redirect_uri": "http://localhost:5173/monday-callback"
}
```

**Response:**
```json
{
  "authUrl": "https://auth.monday.com/oauth2/authorize?...",
  "state": "random-state-value"
}
```

### POST /functions/v1/monday-oauth-callback
Handles OAuth callback and token exchange.

**Request Body:**
```json
{
  "code": "authorization_code",
  "state": "state_value",
  "redirect_uri": "http://localhost:5173/monday-callback"
}
```

### GET /functions/v1/get-monday-boards
Fetches boards from Monday.com using GraphQL.

**Response:**
```json
{
  "success": true,
  "boards": [
    {
      "id": "board_id",
      "name": "Board Name",
      "description": "Board description",
      "groups": [...],
      "columns": [...]
    }
  ],
  "account_name": "Account Name"
}
```

### POST /functions/v1/create-monday-item
Creates an item in a Monday.com board.

**Request Body:**
```json
{
  "board_id": "board_id",
  "group_id": "group_id", // optional
  "item_name": "Item Name",
  "column_values": {} // optional
}
```

## GraphQL Operations

The integration uses Monday.com's GraphQL API:

### Fetch Boards
```graphql
query {
  boards {
    id
    name
    description
    state
    columns {
      id
      title
      type
    }
    groups {
      id
      title
      color
    }
  }
}
```

### Create Item
```graphql
mutation {
  create_item(
    board_id: 123456789
    item_name: "New Item"
    group_id: "group_id"
    column_values: "{\"status\":\"Working on it\"}"
  ) {
    id
    name
    board {
      id
      name
    }
    group {
      id
      title
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **"OAuth credentials not configured" error**
   - Verify `MONDAY_CLIENT_ID` and `MONDAY_CLIENT_SECRET` are set in Supabase Edge Functions environment variables

2. **"Invalid redirect URI" error**
   - Verify redirect URI matches what's configured in Monday.com app settings
   - Ensure the callback route is properly set up

3. **"Unauthorized" error when fetching boards**
   - Check if token has expired and user needs to reconnect
   - Verify token was saved correctly during OAuth callback

4. **"No boards found" message**
   - User might not have access to any boards in their workspace
   - Check Monday.com workspace permissions

### Debug Mode

Enable debug logging by checking the Supabase Edge Functions logs:

```bash
.\supabase.exe functions logs get-monday-auth-url
.\supabase.exe functions logs monday-oauth-callback
.\supabase.exe functions logs get-monday-boards
.\supabase.exe functions logs create-monday-item
```

## Monday.com API Documentation

For more details about Monday.com API capabilities:
- [Monday.com API Documentation](https://developer.monday.com/api-reference/docs)
- [OAuth 2.0 Guide](https://developer.monday.com/api-reference/docs/oauth)
- [GraphQL API](https://developer.monday.com/api-reference/docs/introduction-to-graphql)
- [Items API](https://developer.monday.com/api-reference/docs/items-queries)

## Rate Limits

Monday.com API has rate limits:
- 10 requests per second per app
- The integration handles rate limiting gracefully with error messages

## Security Features

- ✅ OAuth 2.0 flow with state parameter verification
- ✅ Secure token storage with RLS policies
- ✅ Access token expiration handling
- ✅ CORS headers for secure browser requests

## Next Steps to Complete Setup

1. **Create Monday.com OAuth App**:
   - Go to Monday.com developers console
   - Create new app with redirect URI: `http://localhost:5173/monday-callback`
   - Note Client ID and Secret

2. **Add Environment Variables**:
   - In Supabase Dashboard → Settings → Edge Functions
   - Add `MONDAY_CLIENT_ID` and `MONDAY_CLIENT_SECRET`

3. **Test Integration**:
   - Go to Settings tab in your app
   - Try connecting Monday.com account
   - Create test items

## Future Enhancements

Potential improvements for the integration:
- Update existing items
- Delete items
- Custom column values support
- Bulk operations
- Webhooks for real-time updates
- Advanced filtering and search
- Team member assignment 