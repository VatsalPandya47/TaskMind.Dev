#!/bin/bash

# Test Runner Script for Summarize Function
# This script runs the comprehensive test suite for the summarize Edge Function

set -e  # Exit on any error

echo "🧪 Running Summarize Function Tests"
echo "=================================="

# Check if Deno is installed
if ! command -v deno &> /dev/null; then
    echo "❌ Deno is not installed. Please install Deno first:"
    echo "   https://deno.land/#installation"
    exit 1
fi

echo "✅ Deno version: $(deno --version | head -n 1)"

# Check if we're in the right directory
if [ ! -f "supabase/functions/summarize/test.ts" ]; then
    echo "❌ Test file not found. Please run this script from the project root directory."
    exit 1
fi

echo "✅ Test file found"

# Set default environment variables for testing if not already set
export OPENAI_API_KEY=${OPENAI_API_KEY:-"test-openai-key"}
export SUPABASE_URL=${SUPABASE_URL:-"https://test.supabase.co"}
export SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY:-"test-service-key"}

echo "🔧 Environment variables set for testing"

# Function to run tests with different options
run_tests() {
    local filter=$1
    local description=$2
    
    echo ""
    echo "📋 Running: $description"
    echo "----------------------------------------"
    
    if [ -n "$filter" ]; then
        deno test --allow-env --allow-net --allow-read --filter "$filter" supabase/functions/summarize/test.ts
    else
        deno test --allow-env --allow-net --allow-read supabase/functions/summarize/test.ts
    fi
}

# Parse command line arguments
case "${1:-all}" in
    "all")
        run_tests "" "All Tests"
        ;;
    "integration")
        run_tests "Integration Tests" "Integration Tests Only"
        ;;
    "performance")
        run_tests "Performance Test" "Performance Tests Only"
        ;;
    "load")
        run_tests "Load Test" "Load Tests Only"
        ;;
    "verbose")
        echo ""
        echo "📋 Running: All Tests (Verbose Mode)"
        echo "----------------------------------------"
        deno test --allow-env --allow-net --allow-read --verbose supabase/functions/summarize/test.ts
        ;;
    "debug")
        echo ""
        echo "📋 Running: All Tests (Debug Mode)"
        echo "----------------------------------------"
        deno test --allow-env --allow-net --allow-read --log-level=debug supabase/functions/summarize/test.ts
        ;;
    "help"|"-h"|"--help")
        echo ""
        echo "Usage: $0 [option]"
        echo ""
        echo "Options:"
        echo "  all         Run all tests (default)"
        echo "  integration Run only integration tests"
        echo "  performance Run only performance tests"
        echo "  load        Run only load tests"
        echo "  verbose     Run all tests with verbose output"
        echo "  debug       Run all tests with debug logging"
        echo "  help        Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0                    # Run all tests"
        echo "  $0 integration        # Run only integration tests"
        echo "  $0 verbose            # Run all tests with verbose output"
        echo ""
        exit 0
        ;;
    *)
        echo "❌ Unknown option: $1"
        echo "   Use '$0 help' for usage information"
        exit 1
        ;;
esac

echo ""
echo "✅ Tests completed successfully!"
echo ""
echo "📊 Test Summary:"
echo "   - Integration tests cover functionality, error handling, and edge cases"
echo "   - Performance tests verify response time requirements"
echo "   - Load tests ensure concurrent request handling"
echo ""
echo "🔗 For more information, see: supabase/functions/summarize/test-runner.md" 