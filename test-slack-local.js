// Test script for local Slack function
const fetch = require('node-fetch');

async function testSlackFunction() {
  try {
    console.log('🧪 Testing Slack function...');
    
    const response = await fetch('http://127.0.0.1:54321/functions/v1/notifySlack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
      },
      body: JSON.stringify({
        message: '🧪 Test message from Node.js script!'
      })
    });

    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Response:', text);
    
    if (response.ok) {
      console.log('✅ Success!');
    } else {
      console.log('❌ Failed!');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSlackFunction(); 