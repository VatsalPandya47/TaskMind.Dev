# Hooks Documentation

## useUserSummaries

A React hook for fetching and managing user summaries from the Supabase database.

### Features

- **Automatic Data Fetching**: Fetches summaries ordered by creation date (newest first)
- **Loading States**: Provides loading and error states for better UX
- **Type Safety**: Includes TypeScript interfaces for summary data
- **Real-time Updates**: Automatically refetches when cache is invalidated

### Usage

```tsx
import { useUserSummaries } from "@/hooks/useUserSummaries";

const MyComponent = () => {
  const { summaries, isLoading, error } = useUserSummaries();

  if (isLoading) {
    return <div>Loading summaries...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {summaries.map((summary) => (
        <div key={summary.id}>
          <h3>{summary.audio_name || "Manual Entry"}</h3>
          <p>{summary.summary}</p>
          <small>{new Date(summary.created_at).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
};
```

### Return Value

The hook returns an object with the following properties:

- `summaries`: Array of summary objects
- `isLoading`: Boolean indicating if data is being fetched
- `error`: Error object if the fetch failed

### Summary Object Structure

```typescript
interface Summary {
  id: string;
  user_id: string;
  transcript: string;
  summary: string;
  created_at: string;
  audio_name?: string | null;
}
```

### Integration with Summarize Function

This hook works seamlessly with the `useSummarize` hook. When a new summary is generated using the summarize function, the cache is automatically invalidated, causing this hook to refetch the latest data.

### Example with SummariesTab Component

See `src/components/SummariesTab.tsx` for a complete example of how to use this hook in a full-featured component that includes:

- Summary statistics
- Table view of all summaries
- Detailed view dialog with formatted sections
- Loading and error states
- Empty state handling

### Notes

- The hook automatically handles authentication through Supabase
- Data is ordered by `created_at` in descending order (newest first)
- The hook uses React Query for caching and background updates
- Type definitions will be updated once the database migration is applied and types are regenerated 