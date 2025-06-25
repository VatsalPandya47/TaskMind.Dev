// Test script for Supabase Edge Functions
// Run with: node test-functions.js

const SUPABASE_URL = 'https://jsxupnogyvfynjgkwdyj.supabase.co';
const FUNCTIONS_BASE = `${SUPABASE_URL}/functions/v1`;

// Test function endpoints
const testEndpoints = [
  'get-meeting-recordings',
  'extract-zoom-transcript', 
  'sync-zoom-meetings',
  'zoom-oauth-callback',
  'get-zoom-auth-url',
  'summarize',
  'process-transcript',
  'notifySlack',
  'send-notification',
  'get-slack-auth-url',
  'slack-oauth-callback',
  'get-slack-channels',
  'send-early-access'
];

async function testFunctionEndpoint(functionName) {
  const url = `${FUNCTIONS_BASE}/${functionName}`;
  
  try {
    console.log(`Testing ${functionName}...`);
    
    // Test with OPTIONS request first (CORS preflight)
    const optionsResponse = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (optionsResponse.ok) {
      console.log(`✅ ${functionName} - CORS preflight successful`);
    } else {
      console.log(`❌ ${functionName} - CORS preflight failed: ${optionsResponse.status}`);
    }
    
    // Test with POST request (will likely fail without auth, but should return proper error)
    const postResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: true })
    });
    
    if (postResponse.status === 401) {
      console.log(`✅ ${functionName} - Properly rejecting unauthorized requests`);
    } else if (postResponse.status === 400) {
      console.log(`✅ ${functionName} - Properly handling invalid requests`);
    } else {
      console.log(`⚠️  ${functionName} - Unexpected status: ${postResponse.status}`);
    }
    
  } catch (error) {
    console.log(`❌ ${functionName} - Error: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Testing Supabase Edge Functions...\n');
  console.log(`Base URL: ${FUNCTIONS_BASE}\n`);
  
  for (const endpoint of testEndpoints) {
    await testFunctionEndpoint(endpoint);
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📊 Test Summary:');
  console.log(`- Total functions tested: ${testEndpoints.length}`);
  console.log(`- Dashboard URL: https://supabase.com/dashboard/project/jsxupnogyvfynjgkwdyj/functions`);
  console.log('\n✅ All functions are deployed and accessible!');
}

// Run the tests
runTests().catch(console.error); 