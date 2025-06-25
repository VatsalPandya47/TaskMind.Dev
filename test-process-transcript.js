// Test script for process-transcript function
const SUPABASE_URL = "http://127.0.0.1:54321";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

const testEmail = "test@example.com";
const testPassword = "testpassword123";
// IMPORTANT: Set your OpenAI API key here for local testing. Do NOT commit real keys!
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "sk-...your-key-here...";

// Helper to generate a random UUID (v4)
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const testProcessTranscriptFunction = async () => {
  try {
    console.log('🧪 Testing process-transcript function...');
    
    // Step 1: Create a user account
    console.log('📝 Creating test user account...');
    const signUpResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });

    if (!signUpResponse.ok) {
      const errorData = await signUpResponse.json();
      console.log('Sign up response:', errorData);
    }

    // Step 2: Sign in to get access token
    console.log('🔐 Signing in...');
    const signInResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });

    if (!signInResponse.ok) {
      throw new Error(`Sign in failed: ${signInResponse.status}`);
    }

    const { access_token } = await signInResponse.json();
    console.log('✅ Authentication successful');

    // Step 3: Create a test meeting
    console.log('📅 Creating test meeting...');
    const meetingId = uuidv4();
    const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${access_token}`
      }
    });
    const userJson = await userResponse.json();
    if (!userJson.id) {
      console.error('❌ Could not get user ID:', JSON.stringify(userJson, null, 2));
      return;
    }
    const userId = userJson.id;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const createMeetingResponse = await fetch(`${SUPABASE_URL}/rest/v1/meetings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${access_token}`
      },
      body: JSON.stringify({
        id: meetingId,
        title: 'Test Meeting',
        user_id: userId,
        date: today
      })
    });
    if (!createMeetingResponse.ok) {
      const errorData = await createMeetingResponse.json();
      console.log('Meeting creation response:', errorData);
    } else {
      console.log('✅ Test meeting created');
    }

    // Step 4: Test the process-transcript function with API key in request body
    console.log('📋 Testing process-transcript function...');
    const testTranscript = `
    Meeting: Project Planning Session
    Date: 2024-01-15
    
    John: We need to finalize the project timeline for Q1.
    Sarah: I'll handle the frontend development tasks.
    Mike: I can work on the database schema design.
    John: Great, let's set deadlines. Sarah, can you complete the UI by January 30th?
    Sarah: Yes, I'll have it ready by then.
    Mike: I'll finish the database design by January 25th.
    John: Perfect. We'll review everything on February 1st.
    `;

    const processResponse = await fetch(`${SUPABASE_URL}/functions/v1/process-transcript`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
      body: JSON.stringify({
        meetingId: meetingId,
        transcript: testTranscript,
        openai_api_key: OPENAI_API_KEY
      })
    });

    console.log(`Response status: ${processResponse.status}`);
    
    if (processResponse.ok) {
      const result = await processResponse.json();
      console.log('✅ Process-transcript function successful!');
      console.log('Result:', JSON.stringify(result, null, 2));
    } else {
      const errorData = await processResponse.json();
      console.log('❌ Process-transcript function failed:');
      console.log('Error:', JSON.stringify(errorData, null, 2));
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testProcessTranscriptFunction(); 