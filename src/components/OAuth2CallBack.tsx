import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OAuth2Callback = () => {
  const [status, setStatus] = useState("Finalizing connection, please wait...");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // This function runs once when the component loads.
    const processToken = async () => {
      // Use URLSearchParams to easily get the 'code' from the URL.
      const params = new URLSearchParams(location.search);
      const authorizationCode = params.get('code');

      if (authorizationCode) {
        try {
          // ------------------------------------------------------------------
          // TODO: SEND THE `authorizationCode` TO YOUR BACKEND
          // ------------------------------------------------------------------
          // Your backend will exchange this code for an access token.
          // Example:
          // const response = await fetch('/api/google/exchange-code', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ code: authorizationCode }),
          // });
          //
          // if (!response.ok) {
          //   throw new Error('Failed to exchange authorization code.');
          // }
          // ------------------------------------------------------------------

          // If successful, redirect the user to their calendar or dashboard.
          setStatus("Connection successful! Redirecting...");
          setTimeout(() => {
            navigate('/calendar'); // Redirect to the calendar page
          }, 2000); // Wait 2 seconds before redirecting

        } catch (error) {
          console.error(error);
          setStatus("An error occurred. Please try again.");
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
        {/* You can add a spinner or loading animation here */}
      </div>
    </div>
  );
};

export default OAuth2Callback;