// src/hooks/useGoogleCalendarEvents.ts

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ✅ Define an async function to fetch the data
const fetchGoogleCalendarEvents = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    // Return null or empty array if not authenticated
    return null;
  }

  // ✅ Invoke the Supabase function
  const { data, error } = await supabase.functions.invoke('google-calendar-events', {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// ✅ Create the hook using useQuery
export function useGoogleCalendarEvents() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['googleCalendarEvents'], // A unique key for this query
    queryFn: fetchGoogleCalendarEvents, // The function that fetches the data
    staleTime: 1000 * 60 * 5, // Optional: Cache data for 5 minutes
  });

  return {
    // The query returns `data`, which might contain an `items` array
    events: data?.items || [],
    isLoading,
    isError,
    error,
  };
}