// Test script for the notifySlack function
// Usage: node scripts/test-slack-function.js

const SUPABASE_URL = 'https://jsxupnogyvfynjgkwdyj.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your actual anon key

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

// Instructions for use:
console.log('📋 Instructions:');
console.log('1. Replace SUPABASE_ANON_KEY with your actual anon key from Supabase dashboard');
console.log('2. Make sure the notifySlack function is deployed');
console.log('3. Ensure environment variables are set (SLACK_BOT_TOKEN and SLACK_CHANNEL_ID)');
console.log('4. Run: node scripts/test-slack-function.js');
console.log('');

// Uncomment the line below to run the test:
// testSlackFunction(); 