// src/components/OAuth2Callback.tsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client'; // Import your Supabase client

const OAuth2Callback = () => {
  const [status, setStatus] = useState("Finalizing connection, please wait...");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const processToken = async () => {
      const params = new URLSearchParams(location.search);
      const authorizationCode = params.get('code');

      if (authorizationCode) {
        try {
          // ✅ Call a new backend function to exchange the code for a refresh token
          const { error } = await supabase.functions.invoke('google-exchange-code', {
            body: { code: authorizationCode },
          });

          // ✅ Throw an error if the function call fails
          if (error) {
            throw new Error(error.message);
          }

          setStatus("Connection successful! Redirecting...");
          setTimeout(() => {
            navigate('/calendar'); // Redirect to the calendar page
          }, 2000);

        } catch (error: any) {
          console.error("Error during token exchange:", error);
          // ✅ Display a more specific error message
          setStatus(`Connection failed: ${error.message || "An unknown error occurred."} Please try again.`);
        }
      } else {
        setStatus("Authorization code not found. Please try connecting again.");
      }
    };

    processToken();
  }, [location, navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#111827',
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <p>{status}</p>
        {/* You could add a spinner animation here */}
      </div>
    </div>
  );
};

export default OAuth2Callback;