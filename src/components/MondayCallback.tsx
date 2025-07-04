import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useMondayAuth } from "@/hooks/useMondayAuth";

const MondayCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { handleOAuthCallback } = useMondayAuth();

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      console.log('Monday.com callback params:', { code: !!code, state, error });

      if (error) {
        toast({
          title: "Authorization Error",
          description: `Monday.com authorization failed: ${error}`,
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      if (!code) {
        toast({
          title: "Missing Authorization Code",
          description: "No authorization code received from Monday.com",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      // Verify state parameter for security
      const storedState = localStorage.getItem('monday_oauth_state');
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
        const redirectUri = `${window.location.origin}/monday-callback`;
        console.log('Processing callback with redirect URI:', redirectUri);

        // Call the OAuth callback handler
        await handleOAuthCallback.mutateAsync({
          code,
          state: state || '',
          redirect_uri: redirectUri
        });

        // Clean up state
        localStorage.removeItem('monday_oauth_state');
        
        // Navigate back to the settings page or dashboard
        navigate('/?tab=settings');
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        // Error handling is done in the hook, so we just navigate away
        navigate('/');
      }
    };

    processCallback();
  }, [searchParams, navigate, toast, handleOAuthCallback]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto"></div>
        <p className="mt-4 text-gray-300">Connecting your Monday.com account...</p>
        <p className="text-sm text-gray-400 mt-2">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
};

export default MondayCallback; 