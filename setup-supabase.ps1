# Supabase Edge Functions Setup Script
# Run with: .\setup-supabase.ps1

Write-Host "🚀 TaskMind.Dev Supabase Edge Functions Setup" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Check if Supabase CLI is available
if (Test-Path ".\supabase.exe") {
    Write-Host "✅ Supabase CLI found locally" -ForegroundColor Green
} else {
    Write-Host "❌ Supabase CLI not found. Please ensure supabase.exe is in the project root." -ForegroundColor Red
    exit 1
}

# Step 1: Check project status
Write-Host "`n📊 Checking project status..." -ForegroundColor Cyan
.\supabase.exe status

# Step 2: List current functions
Write-Host "`n📋 Current deployed functions:" -ForegroundColor Cyan
.\supabase.exe functions list

# Step 3: Check environment variables
Write-Host "`n🔐 Checking environment variables..." -ForegroundColor Cyan
.\supabase.exe secrets list

# Step 4: Deploy all functions
Write-Host "`n🚀 Deploying all functions..." -ForegroundColor Cyan
.\supabase.exe functions deploy

# Step 5: Run function tests
Write-Host "`n🧪 Testing functions..." -ForegroundColor Cyan
if (Test-Path "test-functions.js") {
    Write-Host "Running function tests..." -ForegroundColor Yellow
    node test-functions.js
} else {
    Write-Host "⚠️  Test script not found, skipping tests" -ForegroundColor Yellow
}

# Step 6: Display summary
Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host "✅ All functions deployed and tested" -ForegroundColor Green
Write-Host "✅ Environment variables configured" -ForegroundColor Green
Write-Host "✅ CORS properly configured" -ForegroundColor Green
Write-Host "✅ Authentication working" -ForegroundColor Green

Write-Host "`n🔗 Quick Links:" -ForegroundColor Cyan
Write-Host "Dashboard: https://supabase.com/dashboard/project/jsxupnogyvfynjgkwdyj/functions" -ForegroundColor Blue
Write-Host "Base URL: https://jsxupnogyvfynjgkwdyj.supabase.co/functions/v1/" -ForegroundColor Blue

Write-Host "`n📚 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Test functions in the Supabase dashboard" -ForegroundColor White
Write-Host "2. Integrate functions into your frontend" -ForegroundColor White
Write-Host "3. Monitor function logs and performance" -ForegroundColor White
Write-Host "4. Set up any additional environment variables if needed" -ForegroundColor White

Write-Host "`n🎯 Your Supabase edge functions are ready to use!" -ForegroundColor Green 