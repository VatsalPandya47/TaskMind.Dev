import fetch from 'node-fetch';

async function testJWT() {
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzeHVwbm9neXZmeW5qZ2t3ZHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MDUxODQsImV4cCI6MjA2NTM4MTE4NH0.GM-u3tU60Dy9dZUYbvXrYB-YMypx7f7TOu1-pAgZ62s';
  
  try {
    console.log('Testing with anon key...');
    const response = await fetch('https://jsxupnogyvfynjgkwdyj.supabase.co/functions/v1/memory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`
      },
      body: JSON.stringify({
        action: 'test'
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ Test successful! Now testing search...');
      
      const searchResponse = await fetch('https://jsxupnogyvfynjgkwdyj.supabase.co/functions/v1/memory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`
        },
        body: JSON.stringify({
          action: 'search',
          query: 'test meeting',
          threshold: 0.7,
          limit: 5
        })
      });

      const searchData = await searchResponse.json();
      console.log('Search response status:', searchResponse.status);
      console.log('Search response data:', JSON.stringify(searchData, null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testJWT(); 