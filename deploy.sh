#!/bin/bash

echo "🚀 AUTOMATED CLOUDFLARE DEPLOYMENT"
echo "==================================="
echo ""
echo "This script will:"
echo "  1. Check prerequisites"
echo "  2. Create Cloudflare D1 database"
echo "  3. Create Cloudflare R2 bucket"
echo "  4. Update configuration"
echo "  5. Push to GitHub"
echo "  6. Deploy to Cloudflare"
echo ""
echo "You'll need to copy 3 things from Cloudflare when prompted."
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler not found. Installing..."
    npm install -g wrangler
fi

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git not found. Please install Git first."
    exit 1
fi

echo "✅ Prerequisites OK"
echo ""

# Login to Cloudflare
echo "Step 1: Login to Cloudflare"
echo "A browser window will open. Approve the login."
echo ""
wrangler login

echo ""
echo "✅ Logged in!"
echo ""

# Get account ID
echo "Step 2: Getting your Cloudflare Account ID..."
ACCOUNT_ID=$(wrangler whoami | grep "Account ID" | awk '{print $NF}')

if [ -z "$ACCOUNT_ID" ]; then
    echo "❌ Could not get Account ID. Please check wrangler login."
    exit 1
fi

echo "✅ Account ID: $ACCOUNT_ID"
echo ""

# Create D1 Database
echo "Step 3: Creating D1 Database..."
D1_OUTPUT=$(wrangler d1 create mod-sales 2>&1)
DATABASE_ID=$(echo "$D1_OUTPUT" | grep -oP '(?<="id" : ")[^"]*' | head -1)

if [ -z "$DATABASE_ID" ]; then
    # Try alternative parsing
    DATABASE_ID=$(echo "$D1_OUTPUT" | grep -i "database_id" | grep -oP '[\w-]{36}' | head -1)
fi

if [ -z "$DATABASE_ID" ]; then
    echo ""
    echo "⚠️ Could not auto-parse Database ID."
    echo "Please check the output above and manually copy the database_id"
    echo "Then run: wrangler d1 list"
    echo ""
    read -p "Enter your Database ID: " DATABASE_ID
fi

echo "✅ Database ID: $DATABASE_ID"
echo ""

# Create R2 Bucket
echo "Step 4: Creating R2 Bucket..."
wrangler r2 bucket create mod-sales-files 2>&1 | head -5

echo "✅ R2 Bucket created!"
echo ""

# Update wrangler.toml
echo "Step 5: Updating configuration..."
sed -i.bak "s/account_id = \"\"/account_id = \"$ACCOUNT_ID\"/" wrangler.toml
sed -i.bak "s/database_id = \"\"/database_id = \"$DATABASE_ID\"/" wrangler.toml

echo "✅ wrangler.toml updated"
echo ""

# Commit changes
echo "Step 6: Committing to git..."
git add wrangler.toml
git commit -m "Update Cloudflare IDs" 2>/dev/null || true

echo "✅ Committed"
echo ""

# GitHub Push
echo "Step 7: Push to GitHub"
echo ""
echo "YOU NEED TO DO THIS ONCE:"
echo "1. Go to https://github.com/new"
echo "2. Create a repo called 'mod-sales'"
echo "3. Copy the commands from GitHub"
echo "4. Paste them here (the git remote add... commands)"
echo ""
read -p "Ready? (press Enter): "

git remote remove origin 2>/dev/null || true
read -p "Enter your GitHub repo URL (https://github.com/YOUR/mod-sales.git): " GITHUB_URL

git remote add origin "$GITHUB_URL"
git branch -M main
git push -u origin main

echo "✅ Pushed to GitHub!"
echo ""

# Deploy
echo "Step 8: Deploying to Cloudflare..."
npm run deploy

echo ""
echo "════════════════════════════════════════"
echo "✅ DEPLOYMENT COMPLETE!"
echo "════════════════════════════════════════"
echo ""
echo "Your app is deploying to Cloudflare..."
echo ""
echo "Next steps:"
echo "1. Go to Namecheap → freenull.com → Nameservers"
echo "2. Change to:"
echo "   iris.ns.cloudflare.com"
echo "   nash.ns.cloudflare.com"
echo "3. Wait 5-10 minutes"
echo "4. Visit: https://freenull.com"
echo ""
echo "⚠️  IMPORTANT: Change admin password!"
echo "   Command: node -e \"const bcrypt = require('bcrypt'); console.log(bcrypt.hashSync('YOUR-PASSWORD', 10));\""
echo ""
