# Pages Documentation

## SummaryHistory

A comprehensive page for viewing all AI-generated meeting summaries with detailed formatting and organization.

### Features

- **Complete Summary Display**: Shows all summaries with formatted sections
- **Rich Metadata**: Displays creation date, time, audio file names, and character counts
- **Formatted Sections**: Automatically parses and displays:
  - Key Topics Discussed
  - Important Decisions
  - Action Items
  - Key Insights
  - Next Steps
- **Collapsible Details**: Raw summary and transcript are available in expandable sections
- **Loading States**: Skeleton loading animation while data is being fetched
- **Error Handling**: Proper error display if data loading fails
- **Empty State**: Friendly message when no summaries exist
- **Responsive Design**: Works on desktop and mobile devices

### Route

- **Path**: `/summary-history`
- **Access**: Protected route (requires authentication)
- **Navigation**: Available in the main navigation menu

### Usage

The page automatically loads when accessed and displays all summaries for the authenticated user. No additional configuration is required.

### Integration

- **Data Source**: Uses `useUserSummaries` hook to fetch data
- **Cache Management**: Automatically updates when new summaries are generated
- **Navigation**: Integrated into the main navigation system
- **Styling**: Uses the existing UI component library and design system

### Key Components

1. **Summary Cards**: Each summary is displayed in a card with:
   - Audio file name or "Manual Entry" indicator
   - Creation date and time
   - Character count badges
   - Formatted summary sections

2. **Summary Sections**: Color-coded sections for different types of information:
   - Blue: Key Topics
   - Green: Important Decisions
   - Orange: Action Items
   - Purple: Key Insights
   - Red: Next Steps

3. **Details Section**: Collapsible area showing:
   - Raw AI-generated summary
   - Original transcript (scrollable)

### Styling

- **Container**: Uses the standard page container layout
- **Cards**: Consistent with the existing design system
- **Colors**: Color-coded sections for easy identification
- **Typography**: Follows the established type scale
- **Spacing**: Consistent spacing throughout the page

### Performance

- **Lazy Loading**: Data is fetched only when the page is accessed
- **Caching**: Uses React Query for efficient data management
- **Optimization**: Minimal re-renders with proper React patterns 