
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
          title: "Error",
          description: `Zoom authorization failed: ${error}`,
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      if (!code) {
        toast({
          title: "Error",
          description: "No authorization code received from Zoom",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      // Verify state parameter
      const storedState = localStorage.getItem('zoom_oauth_state');
      if (state !== storedState) {
        console.error('State mismatch:', { received: state, stored: storedState });
        toast({
          title: "Error",
          description: "Invalid state parameter. Possible security issue.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      try {
        const redirectUri = `${window.location.origin}/zoom-callback`;
        console.log('Exchanging code for tokens with redirect URI:', redirectUri);

        // Call the edge function to exchange code for tokens
        const { data, error } = await supabase.functions.invoke('zoom-oauth-callback', {
          body: { 
            code,
            redirect_uri: redirectUri
          },
        });

        console.log('OAuth callback response:', { data, error });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Zoom account connected successfully!",
        });

        // Clean up state
        localStorage.removeItem('zoom_oauth_state');
        
        // Navigate back to the meetings page
        navigate('/?tab=meetings');
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to connect Zoom account",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    handleCallback();
  }, [searchParams, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Connecting your Zoom account...</p>
      </div>
    </div>
  );
};

export default ZoomCallback;
