// src/components/OAuth2CallBack.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have an AuthContext
import { supabase } from '../integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const OAuth2CallBack = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This function will run once when the component mounts
    const exchangeCodeForToken = async () => {
      // 1. Extract the authorization code from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        setError('Authorization code not found in URL.');
        setIsLoading(false);
        return;
      }

      if (!session) {
        setError('User session not found. Please log in again.');
        setIsLoading(false);
        return;
      }

      console.log('Authorization Code:', code);
      console.log('Using Supabase Access Token:', session.access_token);

      try {
        // 2. Call the Supabase function, sending the code in the body
        const { data, error: invokeError } = await supabase.functions.invoke('google-calendar-exchange', {
          body: JSON.stringify({ code }), // <-- CRITICAL: Send the code here
        });

        if (invokeError) {
          // This will catch network errors and 4xx/5xx responses
          console.error('Error invoking Supabase function:', invokeError);
          setError(`Failed to connect Google Calendar: ${invokeError.message}`);
          throw invokeError;
        }
        
        console.log('Successfully exchanged code for token:', data);

        // 3. Redirect the user to the dashboard or calendar page
        navigate('/dashboard/meetings'); // Or wherever they need to go

      } catch (e) {
        // The error is already set by the 'if (invokeError)' block
        console.error('An exception occurred during the exchange:', e);
      } finally {
        setIsLoading(false);
      }
    };

    exchangeCodeForToken();
  }, [session, navigate]);

  return (
    <div>
      {isLoading && <p>Connecting your Google Calendar, please wait...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!isLoading && !error && <p>Connection successful! Redirecting...</p>}
    </div>
  );
};

export default OAuth2CallBack;