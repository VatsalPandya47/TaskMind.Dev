import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = "https://taskmind.dev/oauth2callback";
const SCOPE = "https://www.googleapis.com/auth/calendar.readonly";

export function GoogleCalendarConnectButton() {
  const handleConnect = () => {
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    
    authUrl.searchParams.append("client_id", GOOGLE_CLIENT_ID);
    authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", SCOPE);
    authUrl.searchParams.append("access_type", "offline");
    authUrl.searchParams.append("prompt", "consent");

    window.location.href = authUrl.toString();
  };

  // ✅ Correct placement for the console.log
  console.log("My Google Client ID is:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

  return (
    <Button 
      onClick={handleConnect}
      variant="outline"
      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-2.5 font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
    >
      <Link className="h-4 w-4 mr-2" />
      Connect Google Calendar
    </Button>
  );
}