// Script to get a valid user JWT token for testing
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jsxupnogyvfynjgkwdyj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzeHVwbm9neXZmeW5qZ2t3ZHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MDUxODQsImV4cCI6MjA2NTM4MTE4NH0.GM-u3tU60Dy9dZUYbvXrYB-YMypx7f7TOu1-pAgZ62s";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function getToken() {
  console.log('Getting user session...');
  
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      return;
    }
    
    if (!data.session) {
      console.log('No active session found. You need to log in first.');
      console.log('Please:');
      console.log('1. Go to http://localhost:8080');
      console.log('2. Sign in or create an account');
      console.log('3. Run this script again');
      return;
    }
    
    const accessToken = data.session.access_token;
    console.log('✅ Valid access token found!');
    console.log('Token:', accessToken);
    console.log('\n📋 Use this token in your curl command:');
    console.log(`curl -i -X POST "https://jsxupnogyvfynjgkwdyj.supabase.co/functions/v1/transcribe-audio" -H "Authorization: Bearer ${accessToken}" -F "file=@C:/Users/Vatsal/Downloads/example-audio.m4a"`);
    
  } catch (err) {
    console.error('Error:', err);
  }
}

getToken(); 