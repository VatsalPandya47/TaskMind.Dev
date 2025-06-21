// Configuration for TaskMind.Dev
export const config = {
  // Set to true to show only the landing page (for production)
  // Set to false to show the full application (for development)
  LANDING_PAGE_ONLY: false,
  
  // App version
  VERSION: '1.0.0',
  
  // Environment
  ENV: process.env.NODE_ENV || 'development',
} as const;

// Helper function to check if we're in landing page only mode
export const isLandingPageOnly = () => config.LANDING_PAGE_ONLY;

// Helper function to check if we're in development mode
export const isDevelopment = () => config.ENV === 'development'; 