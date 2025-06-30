// Test script to check function accessibility
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jsxupnogyvfynjgkwdyj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzeHVwbm9neXZmeW5qZ2t3ZHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MDUxODQsImV4cCI6MjA2NTM4MTE4NH0.GM-u3tU60Dy9dZUYbvXrYB-YMypx7f7TOu1-pAgZ62s";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testFunctionAccess() {
  console.log('Testing function accessibility...');
  
  try {
    // First, check if we can get a session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Session available:', !!session);
    
    if (session) {
      console.log('Access token available:', !!session.access_token);
      
      // Test with a simple request
      const response = await fetch('https://jsxupnogyvfynjgkwdyj.supabase.co/functions/v1/transcribe-audio', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'ping' }),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Response body:', responseText);
      
    } else {
      console.log('No session found. Please sign in first.');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
  }
}

testFunctionAccess(); 