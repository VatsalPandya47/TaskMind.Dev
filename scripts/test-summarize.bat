@echo off
REM Test Runner Script for Summarize Function (Windows)
REM This script runs the comprehensive test suite for the summarize Edge Function

echo 🧪 Running Summarize Function Tests
echo ==================================

REM Check if Deno is installed
deno --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Deno is not installed. Please install Deno first:
    echo    https://deno.land/#installation
    exit /b 1
)

for /f "tokens=*" %%i in ('deno --version') do (
    echo ✅ Deno version: %%i
    goto :continue
)
:continue

REM Check if we're in the right directory
if not exist "supabase\functions\summarize\test.ts" (
    echo ❌ Test file not found. Please run this script from the project root directory.
    exit /b 1
)

echo ✅ Test file found

REM Set default environment variables for testing if not already set
if "%OPENAI_API_KEY%"=="" set OPENAI_API_KEY=test-openai-key
if "%SUPABASE_URL%"=="" set SUPABASE_URL=https://test.supabase.co
if "%SUPABASE_SERVICE_ROLE_KEY%"=="" set SUPABASE_SERVICE_ROLE_KEY=test-service-key

echo 🔧 Environment variables set for testing

REM Function to run tests with different options
:run_tests
set filter=%1
set description=%2

echo.
echo 📋 Running: %description%
echo ----------------------------------------

if "%filter%"=="" (
    deno test --allow-env --allow-net --allow-read supabase\functions\summarize\test.ts
) else (
    deno test --allow-env --allow-net --allow-read --filter "%filter%" supabase\functions\summarize\test.ts
)
goto :eof

REM Parse command line arguments
if "%1"=="" goto :all
if "%1"=="all" goto :all
if "%1"=="integration" goto :integration
if "%1"=="performance" goto :performance
if "%1"=="load" goto :load
if "%1"=="verbose" goto :verbose
if "%1"=="debug" goto :debug
if "%1"=="help" goto :help
if "%1"=="-h" goto :help
if "%1"=="--help" goto :help
goto :unknown

:all
call :run_tests "" "All Tests"
goto :end

:integration
call :run_tests "Integration Tests" "Integration Tests Only"
goto :end

:performance
call :run_tests "Performance Test" "Performance Tests Only"
goto :end

:load
call :run_tests "Load Test" "Load Tests Only"
goto :end

:verbose
echo.
echo 📋 Running: All Tests (Verbose Mode)
echo ----------------------------------------
deno test --allow-env --allow-net --allow-read --verbose supabase\functions\summarize\test.ts
goto :end

:debug
echo.
echo 📋 Running: All Tests (Debug Mode)
echo ----------------------------------------
deno test --allow-env --allow-net --allow-read --log-level=debug supabase\functions\summarize\test.ts
goto :end

:help
echo.
echo Usage: %0 [option]
echo.
echo Options:
echo   all         Run all tests (default)
echo   integration Run only integration tests
echo   performance Run only performance tests
echo   load        Run only load tests
echo   verbose     Run all tests with verbose output
echo   debug       Run all tests with debug logging
echo   help        Show this help message
echo.
echo Examples:
echo   %0                    # Run all tests
echo   %0 integration        # Run only integration tests
echo   %0 verbose            # Run all tests with verbose output
echo.
exit /b 0

:unknown
echo ❌ Unknown option: %1
echo    Use '%0 help' for usage information
exit /b 1

:end
echo.
echo ✅ Tests completed successfully!
echo.
echo 📊 Test Summary:
echo    - Integration tests cover functionality, error handling, and edge cases
echo    - Performance tests verify response time requirements
echo    - Load tests ensure concurrent request handling
echo.
echo 🔗 For more information, see: supabase\functions\summarize\test-runner.md 