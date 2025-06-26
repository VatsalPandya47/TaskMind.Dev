// Script to create a test user and get a valid JWT token
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jsxupnogyvfynjgkwdyj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzeHVwbm9neXZmeW5qZ2t3ZHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MDUxODQsImV4cCI6MjA2NTM4MTE4NH0.GM-u3tU60Dy9dZUYbvXrYB-YMypx7f7TOu1-pAgZ62s";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function createTestUser() {
  console.log('Creating test user account...');
  
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  
  try {
    // First, try to sign up
    console.log('Signing up test user:', testEmail);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User'
        }
      }
    });
    
    if (signUpError) {
      console.error('Sign up error:', signUpError.message);
      
      // If sign up fails, try to sign in (in case user already exists)
      console.log('Trying to sign in instead...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      if (signInError) {
        console.error('Sign in error:', signInError.message);
        console.log('\nPlease manually create an account at http://localhost:8080');
        return;
      }
      
      console.log('✅ Successfully signed in!');
      const accessToken = signInData.session.access_token;
      console.log('Token:', accessToken);
      console.log('\n📋 Use this token in your curl command:');
      console.log(`curl -i -X POST "https://jsxupnogyvfynjgkwdyj.supabase.co/functions/v1/transcribe-audio" -H "Authorization: Bearer ${accessToken}" -F "file=@C:/Users/Vatsal/Downloads/example-audio.m4a"`);
      
    } else {
      console.log('✅ Successfully signed up!');
      console.log('Note: You may need to confirm your email if email confirmation is enabled.');
      console.log('For testing purposes, you can try signing in directly...');
      
      // Try to sign in immediately
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      if (signInError) {
        console.log('Sign in failed (email confirmation may be required):', signInError.message);
        console.log('Please check your email or try signing in manually at http://localhost:8080');
        return;
      }
      
      console.log('✅ Successfully signed in!');
      const accessToken = signInData.session.access_token;
      console.log('Token:', accessToken);
      console.log('\n📋 Use this token in your curl command:');
      console.log(`curl -i -X POST "https://jsxupnogyvfynjgkwdyj.supabase.co/functions/v1/transcribe-audio" -H "Authorization: Bearer ${accessToken}" -F "file=@C:/Users/Vatsal/Downloads/example-audio.m4a"`);
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

createTestUser(); 