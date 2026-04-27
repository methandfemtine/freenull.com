#!/bin/bash

echo "🚀 Cloudflare Setup Script"
echo "=========================="
echo ""

# Install dependencies
echo "📦 Installing Cloudflare dependencies..."
npm install -D wrangler @cloudflare/next-on-pages

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Login to Cloudflare:"
echo "   wrangler login"
echo ""
echo "2. Create D1 database:"
echo "   wrangler d1 create mod-sales"
echo ""
echo "3. Create R2 bucket:"
echo "   wrangler r2 bucket create mod-sales-files"
echo ""
echo "4. Update wrangler.toml with IDs from steps 2 & 3"
echo ""
echo "5. Push code to GitHub"
echo ""
echo "6. Deploy:"
echo "   npm run deploy"
echo ""
echo "For detailed instructions, see CLOUDFLARE_DEPLOY.md"
