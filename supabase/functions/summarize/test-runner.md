# Summarize Function Test Runner

This document explains how to run the comprehensive test suite for the summarize Edge Function.

## Prerequisites

1. **Deno installed**: Make sure you have Deno installed on your system
   ```bash
   # Check if Deno is installed
   deno --version
   
   # Install Deno if needed (Windows)
   # Download from https://deno.land/#installation
   ```

2. **Supabase CLI**: Ensure you have the Supabase CLI installed
   ```bash
   npm install --save-dev supabase
   ```

## Running the Tests

### 1. Basic Test Run

```bash
# Navigate to the project root
cd TaskMind.Dev

# Run all summarize function tests
deno test --allow-env --allow-net supabase/functions/summarize/test.ts
```

### 2. Run with Verbose Output

```bash
# Run tests with detailed output
deno test --allow-env --allow-net --verbose supabase/functions/summarize/test.ts
```

### 3. Run Specific Test Categories

```bash
# Run only integration tests
deno test --allow-env --allow-net --filter "Integration Tests" supabase/functions/summarize/test.ts

# Run only performance tests
deno test --allow-env --allow-net --filter "Performance Test" supabase/functions/summarize/test.ts

# Run only load tests
deno test --allow-env --allow-net --filter "Load Test" supabase/functions/summarize/test.ts
```

### 4. Run Individual Test Steps

```bash
# Run a specific test step
deno test --allow-env --allow-net --filter "should handle valid transcript successfully" supabase/functions/summarize/test.ts
```

## Test Scenarios Covered

### ✅ Integration Tests

1. **Valid Transcript Processing**
   - Tests successful summarization of a realistic meeting transcript
   - Verifies correct response format and data
   - Checks that summary is generated and saved

2. **Input Validation**
   - Empty transcript handling
   - Missing transcript parameter
   - Missing meeting ID

3. **Authentication & Authorization**
   - Unauthorized access (no token)
   - Invalid authentication token
   - Meeting ownership verification

4. **Dry Run Mode**
   - Tests dry_run functionality
   - Verifies summary generation without database save

5. **OpenAI API Error Handling**
   - Rate limiting (429 errors)
   - Invalid API key (401 errors)
   - Server errors (500+ errors)
   - Missing API key configuration

6. **Database Operations**
   - Meeting not found scenarios
   - Database update failures

7. **CORS Support**
   - Preflight request handling
   - CORS headers verification

8. **Edge Cases**
   - Very short transcripts
   - Invalid AI responses

### ⚡ Performance Tests

1. **Response Time**
   - Verifies function completes within reasonable time (< 5 seconds)
   - Tests with simulated processing delays

### 🔄 Load Tests

1. **Concurrent Requests**
   - Tests handling of multiple simultaneous requests
   - Verifies all requests complete successfully
   - Performance under load (< 10 seconds for 5 concurrent requests)

## Expected Test Output

### Successful Run
```
🧪 Summarize function tests ready to run!
test Summarize Function Integration Tests ...
  Setup test environment ... ok (2ms)
  should handle valid transcript successfully ... ok (150ms)
  should handle empty transcript ... ok (5ms)
  should handle missing transcript ... ok (3ms)
  should handle unauthorized access ... ok (4ms)
  should handle invalid auth token ... ok (3ms)
  should handle dry_run mode ... ok (120ms)
  should handle OpenAI API rate limiting ... ok (8ms)
  should handle OpenAI API invalid key ... ok (6ms)
  should handle OpenAI API server error ... ok (5ms)
  should handle missing OpenAI API key ... ok (4ms)
  should handle meeting not found ... ok (3ms)
  should handle CORS preflight request ... ok (2ms)
  should handle very short transcript ... ok (5ms)
  Teardown test environment ... ok (1ms)
ok (15 steps, 320ms)

test Summarize Function Performance Test ...
  should complete within reasonable time ... ok (150ms)
ok (1 step, 150ms)

test Summarize Function Load Test ...
  should handle multiple concurrent requests ... ok (300ms)
ok (1 step, 300ms)

test result: ok. 17 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (770ms)
```

### Failed Test Example
```
test Summarize Function Integration Tests ...
  should handle valid transcript successfully ... FAILED (150ms)
    AssertionError: Values are not equal:
    
    [Diff] Actual / Expected
    - 200
    + 500
    
    at assertEquals (https://deno.land/std@0.168.0/testing/asserts.ts:xxx:xx)
    at file:///path/to/test.ts:xxx:xx
```

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   ```bash
   # Make sure you're running with the correct permissions
   deno test --allow-env --allow-net --allow-read supabase/functions/summarize/test.ts
   ```

2. **Module Not Found Errors**
   ```bash
   # Ensure you're running from the project root
   cd TaskMind.Dev
   deno test --allow-env --allow-net supabase/functions/summarize/test.ts
   ```

3. **Environment Variable Issues**
   ```bash
   # Check if environment variables are set
   deno eval "console.log(Deno.env.get('OPENAI_API_KEY'))"
   ```

4. **Network Issues**
   ```bash
   # If you're behind a proxy, configure Deno
   export HTTP_PROXY=http://proxy.example.com:8080
   export HTTPS_PROXY=http://proxy.example.com:8080
   ```

### Debug Mode

```bash
# Run with debug output
deno test --allow-env --allow-net --log-level=debug supabase/functions/summarize/test.ts
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Test Summarize Function

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Deno
      uses: denoland/setup-deno@v1
      with:
        deno-version: v1.x
    
    - name: Run Tests
      run: deno test --allow-env --allow-net supabase/functions/summarize/test.ts
      env:
        OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

## Test Coverage

The test suite provides comprehensive coverage of:

- ✅ **Functionality**: All core features tested
- ✅ **Error Handling**: All error scenarios covered
- ✅ **Authentication**: Security and authorization tested
- ✅ **Performance**: Response time and load testing
- ✅ **Edge Cases**: Boundary conditions and unusual inputs
- ✅ **Integration**: End-to-end workflow testing

## Adding New Tests

To add new test cases:

1. Add a new test step in the main test suite:
   ```typescript
   await t.step("should handle new scenario", async () => {
     // Test implementation
   });
   ```

2. Follow the existing patterns:
   - Use `createTestRequest()` helper
   - Mock external dependencies
   - Assert expected outcomes
   - Clean up after tests

3. Run the new test:
   ```bash
   deno test --allow-env --allow-net --filter "should handle new scenario" supabase/functions/summarize/test.ts
   ```

## Performance Benchmarks

| Test Type | Expected Duration | Success Criteria |
|-----------|------------------|------------------|
| Integration Tests | < 1 second | All assertions pass |
| Performance Test | < 5 seconds | Response time acceptable |
| Load Test (5 concurrent) | < 10 seconds | All requests succeed |

## Security Testing

The test suite includes security validation:

- ✅ Authentication token validation
- ✅ User authorization checks
- ✅ Meeting ownership verification
- ✅ Input sanitization
- ✅ CORS policy compliance 