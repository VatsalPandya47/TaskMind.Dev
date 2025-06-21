# Landing Page Mode Configuration

This document explains how to switch between landing page only mode and full application mode for TaskMind.Dev.

## Current Mode: Landing Page Only ✅

The website `taskmind.dev` is currently configured to show **only the landing page**. This means:
- ✅ Landing page is visible to the public
- ❌ Sign in, dashboard, and other app features are hidden
- ❌ Main application is under development and not accessible

## How to Switch Modes

### To Show Landing Page Only (Current - Production Ready)
Edit `src/config.ts`:
```typescript
export const config = {
  LANDING_PAGE_ONLY: true,  // Set to true
  // ... other config
};
```

### To Show Full Application (Development Mode)
Edit `src/config.ts`:
```typescript
export const config = {
  LANDING_PAGE_ONLY: false,  // Set to false
  // ... other config
};
```

Then uncomment the full application code in `src/App.tsx`:
1. Uncomment the import statements for main app components
2. Uncomment the full application return statement
3. Remove or comment out the landing page only return statement

## What's Included in Landing Page Mode

The landing page includes:
- 🏠 Home page with hero section
- 📄 About page
- 📝 Blog page
- 🔒 Privacy policy
- 📋 Terms of service
- 🎨 Modern UI components
- 📱 Responsive design
- 🎭 Beautiful animations

## What's Hidden in Landing Page Mode

The following features are hidden:
- 🔐 Authentication system
- 📊 Dashboard
- 📅 My Meetings
- 📝 Summary History
- 🔗 Zoom Integration
- ⚙️ Settings
- 🛠️ Admin features

## Deployment

When you're ready to deploy:
1. Ensure `LANDING_PAGE_ONLY: true` in `src/config.ts`
2. Build the project: `npm run build`
3. Deploy the `dist/` folder to your hosting provider

## Development Workflow

1. **For landing page changes**: Edit files in `src/components/` and `src/pages/`
2. **For main app development**: 
   - Set `LANDING_PAGE_ONLY: false`
   - Uncomment the full app code in `App.tsx`
   - Work on the main application features
3. **For production**: Always set back to `LANDING_PAGE_ONLY: true`

## File Structure

```
src/
├── config.ts              # Mode configuration
├── App.tsx               # Main app component (with mode switching)
├── components/           # Landing page components
├── pages/               # Landing page pages
├── hooks/               # Shared hooks
├── lib/                 # Utility functions
└── integrations/        # Supabase integration
```

## Notes

- The landing page is fully functional and production-ready
- All main app code is preserved and can be easily restored
- The configuration system makes it easy to switch between modes
- No data or functionality is lost when switching modes 