
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ZoomCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      console.log('Zoom callback params:', { code: !!code, state, error });

      if (error) {
        toast({
          title: "Authorization Error",
          description: `Zoom authorization failed: ${error}`,
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      if (!code) {
        toast({
          title: "Missing Authorization Code",
          description: "No authorization code received from Zoom",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      // Verify state parameter for security
      const storedState = localStorage.getItem('zoom_oauth_state');
      if (state !== storedState) {
        console.error('State mismatch:', { received: state, stored: storedState });
        toast({
          title: "Security Error",
          description: "Invalid state parameter. Possible security issue.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      try {
        // Get current origin for redirect URI
        const redirectUri = `${window.location.origin}/zoom-callback`;
        console.log('Exchanging code for tokens with redirect URI:', redirectUri);

        // Call the edge function to exchange code for tokens
        const { data, error: callbackError } = await supabase.functions.invoke('zoom-oauth-callback', {
          body: { 
            code,
            redirect_uri: redirectUri
          },
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log('OAuth callback response:', { data, error: callbackError });

        if (callbackError) {
          throw new Error(callbackError.message || 'Failed to exchange authorization code');
        }

        if (!data?.success) {
          throw new Error(data?.error || 'Unknown error occurred during authorization');
        }

        toast({
          title: "Success! 🎉",
          description: "Zoom account connected successfully!",
        });

        // Clean up state
        localStorage.removeItem('zoom_oauth_state');
        
        // Navigate back to the meetings page
        navigate('/?tab=meetings');
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        toast({
          title: "Connection Failed",
          description: error.message || "Failed to connect Zoom account. Please try again.",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    handleCallback();
  }, [searchParams, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Connecting your Zoom account...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
};

export default ZoomCallback;
