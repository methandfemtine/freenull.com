@echo off
REM Windows Deployment Script

cls
echo.
echo 🚀 AUTOMATED CLOUDFLARE DEPLOYMENT
echo ===================================
echo.
echo This script will:
echo   1. Check prerequisites
echo   2. Create Cloudflare D1 database
echo   3. Create Cloudflare R2 bucket
echo   4. Update configuration
echo   5. Push to GitHub
echo   6. Deploy to Cloudflare
echo.
echo You'll only need to copy 2-3 things from Cloudflare.
echo.
pause

REM Check if wrangler exists
wrangler --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Wrangler not found. Installing...
    npm install -g wrangler
)

echo ✅ Prerequisites OK
echo.
echo STEP 1: Login to Cloudflare
echo A browser window will open. Approve the login.
echo.
pause

call wrangler login

echo.
echo ✅ Logged in!
echo.
echo STEP 2: Getting your Account ID...

for /f "tokens=*" %%i in ('wrangler whoami') do set WHOAMI=%%i
echo %WHOAMI%

echo.
echo STEP 3: Creating D1 Database...
call wrangler d1 create mod-sales

echo.
echo ⚠️  YOU NEED TO COPY THE DATABASE ID
echo Look at the output above - find "database_id"
echo It looks like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
echo.
set /p DATABASE_ID="Paste your Database ID here: "

echo.
echo STEP 4: Creating R2 Bucket...
call wrangler r2 bucket create mod-sales-files

echo.
echo ✅ R2 Bucket created!
echo.
echo STEP 5: Updating configuration files...

REM Update wrangler.toml with Account ID and Database ID
echo Please manually edit wrangler.toml:
echo   - Find: account_id = ""
echo   - Replace with your Account ID from wrangler whoami
echo   - Find: database_id = ""
echo   - Replace with: %DATABASE_ID%
echo.
pause

echo STEP 6: Committing changes...
git add wrangler.toml
git commit -m "Update Cloudflare IDs"

echo.
echo STEP 7: Push to GitHub
echo.
echo YOU NEED TO DO THIS ONCE:
echo 1. Go to https://github.com/new
echo 2. Create a repo called "mod-sales"
echo 3. Copy the GitHub URL (https://github.com/YOUR/mod-sales.git)
echo.
set /p GITHUB_URL="Paste GitHub repo URL: "

git remote remove origin 2>nul
git remote add origin %GITHUB_URL%
git branch -M main
git push -u origin main

echo.
echo STEP 8: Deploying to Cloudflare...
call npm run deploy

cls
echo.
echo ════════════════════════════════════════
echo ✅ DEPLOYMENT COMPLETE!
echo ════════════════════════════════════════
echo.
echo Your app is deploying to Cloudflare...
echo.
echo NEXT STEPS:
echo 1. Go to Namecheap ^> freenull.com ^> Nameservers
echo 2. Change to:
echo    iris.ns.cloudflare.com
echo    nash.ns.cloudflare.com
echo 3. Wait 5-10 minutes
echo 4. Visit: https://freenull.com
echo.
echo ⚠️  IMPORTANT: Change admin password!
echo.
pause
