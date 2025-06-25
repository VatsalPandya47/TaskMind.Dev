import { useEffect, useState } from "react";

// Replace this with your real fetching logic (from backend or Google API)
export function useGoogleCalendarEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // TODO: Replace with real logic
    // Simulate fetching events after connecting
    const connected = localStorage.getItem("google_calendar_connected") === "true";
    setIsConnected(connected);

    if (connected) {
      setEvents([
        {
          id: "1",
          summary: "Google Event: Project Kickoff",
          start: { dateTime: new Date(Date.now() + 86400000).toISOString() }, // tomorrow
          htmlLink: "https://calendar.google.com/",
        },
        {
          id: "2",
          summary: "Google Event: Team Sync",
          start: { dateTime: new Date(Date.now() + 2 * 86400000).toISOString() }, // in 2 days
          htmlLink: "https://calendar.google.com/",
        },
      ]);
    }
  }, []);

  return { events, isConnected };
}