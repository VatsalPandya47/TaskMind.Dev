// Test script for transcribe-audio function
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jsxupnogyvfynjgkwdyj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzeHVwbm9neXZmeW5qZ2t3ZHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MDUxODQsImV4cCI6MjA2NTM4MTE4NH0.GM-u3tU60Dy9dZUYbvXrYB-YMypx7f7TOu1-pAgZ62s";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testTranscribeFunction() {
  console.log('Testing transcribe-audio function...');
  
  try {
    // Test with a simple request to see if the function exists
    const { data, error } = await supabase.functions.invoke('transcribe-audio', {
      body: { test: 'ping' }
    });
    
    console.log('Response:', { data, error });
    
    if (error) {
      console.error('Function error:', error);
    } else {
      console.log('Function is accessible');
    }
  } catch (err) {
    console.error('Test failed:', err);
  }
}

testTranscribeFunction(); 