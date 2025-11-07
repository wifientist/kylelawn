#!/bin/bash
# Simple production database initialization script
# Run this after setting CLOUDFLARE_API_TOKEN in your environment

set -e

echo "🔍 Checking for CLOUDFLARE_API_TOKEN..."
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "❌ Error: CLOUDFLARE_API_TOKEN environment variable is not set"
  echo ""
  echo "Please set it first:"
  echo "  export CLOUDFLARE_API_TOKEN='your-token-here'"
  echo ""
  echo "Or run this script with the token:"
  echo "  CLOUDFLARE_API_TOKEN='your-token' ./init-prod-simple.sh"
  exit 1
fi

echo "✅ Token found"
echo ""
echo "⚠️  This will initialize your PRODUCTION database on Cloudflare"
echo "   Database: kyle-lawn-db"
echo "   Project: kylelawn"
echo ""
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

echo ""
echo "📋 Step 1/2: Creating main tables (blog_posts, blog_images)..."
npx wrangler d1 execute kyle-lawn-db --remote --file=./schema.sql

echo ""
echo "📋 Step 2/2: Adding uploaded_images table..."
npx wrangler d1 execute kyle-lawn-db --remote --file=./schema-update-images.sql

echo ""
echo "✅ Production database initialized successfully!"
echo ""
echo "📊 Verifying tables..."
npx wrangler d1 execute kyle-lawn-db --remote --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"

echo ""
echo "🎉 All done! Your production database is ready."
echo ""
echo "Next steps:"
echo "  1. Try creating a blog post again at https://kylejoneslawn.com/admin/dashboard"
echo "  2. Upload images"
echo "  3. Check logs to verify everything works"
