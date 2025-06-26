// Test script for the notifySlack function
const SUPABASE_URL = 'http://127.0.0.1:54321'; // Local development URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

async function testSlackFunction() {
  try {
    console.log('🧪 Testing Slack function...');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/notifySlack`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        message: '🚀 Hello from TaskMind! This is a test message from the notifySlack function.'
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Success!');
      console.log('Response:', result);
    } else {
      console.log('❌ Error:');
      console.log('Status:', response.status);
      console.log('Response:', result);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

// Run the test
testSlackFunction(); 