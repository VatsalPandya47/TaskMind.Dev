# Unit Tests for React Hooks

This directory contains comprehensive unit tests for the custom React hooks used in the TaskMind application.

## Test Files

### `useTasks.test.ts`
Comprehensive unit tests for the `useTasks` hook covering:
- ✅ Fetching tasks from Supabase
- ✅ Creating new tasks with authentication
- ✅ Updating existing tasks
- ✅ Deleting tasks
- ✅ Error handling for all operations
- ✅ Slack integration notifications
- ✅ State management and loading states
- ✅ Toast notifications

### `useMemory.test.ts`
Comprehensive unit tests for the `useMemory` hook covering:
- ✅ Memory search functionality with natural language queries
- ✅ Retry logic with exponential backoff
- ✅ Authentication error handling
- ✅ Embedding updates
- ✅ Memory statistics retrieval
- ✅ Error handling for different error types
- ✅ Loading states and user feedback
- ✅ Rate limiting and API key error scenarios

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (for development)
```bash
npm run test
```

### Run tests once (for CI/CD)
```bash
npm run test:run
```

### Run tests with UI
```bash
npm run test:ui
```

### Run specific test file
```bash
npm run test:run src/hooks/__tests__/useTasks.test.ts
```

### Run tests with coverage
```bash
npm run test:run -- --coverage
```

## Test Structure

Each test file follows this structure:
1. **Setup & Mocking**: Mock external dependencies (Supabase, toast notifications, etc.)
2. **Helper Functions**: Create test wrappers for React Query
3. **Test Groups**: Organized by functionality (CRUD operations, error handling, etc.)
4. **Assertions**: Verify both success and error scenarios

## Mocked Dependencies

The test setup automatically mocks:
- ✅ Supabase client (`@/integrations/supabase/client`)
- ✅ Toast notifications (`@/hooks/use-toast`)
- ✅ Slack service (`@/lib/slackService`)
- ✅ Console methods (to reduce test noise)

## Test Coverage

The tests cover:
- ✅ **Happy Path**: All operations working correctly
- ✅ **Error Handling**: Database errors, authentication failures
- ✅ **Edge Cases**: Network failures, retry logic, rate limiting
- ✅ **Integration**: Slack notifications, toast messages
- ✅ **State Management**: Loading states, mutation states
- ✅ **Type Safety**: All TypeScript interfaces and types

## Configuration

- **Framework**: Vitest (fast Vite-native testing)
- **Environment**: jsdom (for DOM simulation)
- **Testing Library**: React Testing Library (for React hooks)
- **Mocking**: vi (Vitest's built-in mocking)

## Benefits

1. **Confidence**: Ensures hooks work correctly before deployment
2. **Regression Prevention**: Catches breaking changes automatically
3. **Documentation**: Tests serve as living examples of hook usage
4. **Refactoring Safety**: Makes it safe to improve code structure
5. **CI/CD Integration**: Automated testing in deployment pipeline

## Next Steps

These tests can be extended to include:
- Integration tests with real Supabase (using test database)
- Performance testing for large datasets
- End-to-end testing with real UI components
- Visual regression testing
- Accessibility testing 