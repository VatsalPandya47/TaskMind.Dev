const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = "https://taskmind.dev/oauth2callback";
const SCOPE = "https://www.googleapis.com/auth/calendar.readonly";

export function GoogleCalendarConnectButton() {
  const handleConnect = () => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=code&scope=${encodeURIComponent(
      SCOPE
    )}&access_type=offline&prompt=consent`;
    window.location.href = url;
  };

  return (
    <button onClick={handleConnect}>
      Connect Google Calendar
    </button>
  );
}