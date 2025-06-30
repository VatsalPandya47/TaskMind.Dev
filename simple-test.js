// Simple test for Slack function
import fetch from 'node-fetch';

async function testSlack() {
  try {
    console.log('🧪 Testing Slack function...');
    
    const response = await fetch('http://127.0.0.1:54321/functions/v1/notifySlack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      },
      body: JSON.stringify({
        message: '🚀 Hello from TaskMind! Test message.'
      })
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success!');
      console.log('Response:', result);
    } else {
      const errorText = await response.text();
      console.log('❌ Error:');
      console.log('Status:', response.status);
      console.log('Response:', errorText);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testSlack(); 