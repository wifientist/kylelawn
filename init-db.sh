#!/bin/bash
# Initialize D1 database with schema

echo "Initializing production database..."
npx wrangler d1 execute kyle-lawn-db --file=./schema.sql

echo ""
echo "Initializing local database..."
npx wrangler d1 execute kyle-lawn-db --local --file=./schema.sql

echo ""
echo "Database initialized successfully!"
