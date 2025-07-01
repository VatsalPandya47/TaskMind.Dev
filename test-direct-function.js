// Test script to call the function directly without authentication
import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';

async function testDirectFunction() {
  console.log('Testing function directly without authentication...');
  
  try {
    // Read the audio file
    const audioPath = 'C:/Users/Vatsal/Downloads/example-audio.m4a';
    const audioBuffer = fs.readFileSync(audioPath);
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', audioBuffer, {
      filename: 'example-audio.m4a',
      contentType: 'audio/x-m4a'
    });
    
    // Call the function directly
    const response = await fetch('https://jsxupnogyvfynjgkwdyj.supabase.co/functions/v1/transcribe-audio', {
      method: 'POST',
      body: formData,
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ Transcription successful:', data.transcript);
      } catch (e) {
        console.log('Response is not JSON:', responseText);
      }
    } else {
      console.log('❌ Function failed with status:', response.status);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testDirectFunction(); 