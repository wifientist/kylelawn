#!/bin/bash
# Initialize production database with all schemas

echo "⚠️  This will initialize your PRODUCTION database on Cloudflare"
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

echo ""
echo "1. Creating main tables (blog_posts, blog_images)..."
npx wrangler d1 execute kyle-lawn-db --remote --file=./schema.sql

echo ""
echo "2. Adding uploaded_images table..."
npx wrangler d1 execute kyle-lawn-db --remote --file=./schema-update-images.sql

echo ""
echo "3. Optionally seeding with sample data..."
echo "Do you want to add sample blog posts? (y/n)"
read -r response
if [[ "$response" == "y" ]]; then
  npx wrangler d1 execute kyle-lawn-db --remote --file=./seed-db.sql
  echo "✓ Sample data added"
else
  echo "✓ Skipped sample data"
fi

echo ""
echo "✅ Production database initialized successfully!"
echo ""
echo "Next steps:"
echo "1. Configure environment variables in Cloudflare Pages dashboard"
echo "2. Add D1 and R2 bindings"
echo "3. Redeploy your site"
