import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useGoogleCalendarEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) return;

      const { data, error } = await supabase.functions.invoke('google-calendar-events', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        }
      });

      if (data?.items) setEvents(data.items);
      setLoading(false);
    })();
  }, []);

  return { events, loading };
}