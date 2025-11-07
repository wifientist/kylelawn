# Cloudflare Serverless Setup Guide

This guide shows you how to set up D1 database and R2 storage for your blog and image gallery.

## Step 1: Create D1 Database

Create a D1 database for blog posts:

```bash
npx wrangler d1 create kyle-lawn-db
```

This will output something like:
```
✅ Successfully created DB 'kyle-lawn-db'
binding = "DB"
database_name = "kyle-lawn-db"
database_id = "xxxx-xxxx-xxxx-xxxx"
```

**Copy the `database_id`** - you'll need it next.

## Step 2: Update wrangler.toml

Add the D1 binding to your `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "kyle-lawn-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace with your actual ID
```

## Step 3: Initialize Database Schema

Run the schema to create tables:

```bash
npx wrangler d1 execute kyle-lawn-db --file=./schema.sql
```

For local development:
```bash
npx wrangler d1 execute kyle-lawn-db --local --file=./schema.sql
```

## Step 4: Create R2 Bucket for Images

Create an R2 bucket for storing images:

```bash
npx wrangler r2 bucket create kyle-lawn-images
```

## Step 5: Update wrangler.toml for R2

Add R2 binding to your `wrangler.toml`:

```toml
   [[r2_buckets]]
   binding = "IMAGES"
   bucket_name = "kyle-lawn-images"
```

## Step 6: Configure Cloudflare Pages Project

Since you're using GitHub integration, you need to add these bindings in the Cloudflare dashboard:

1. Go to Cloudflare Dashboard → Workers & Pages → kyle-lawn
2. Click **Settings** → **Functions**
3. Add **D1 database binding**:
   - Variable name: `DB`
   - D1 database: Select `kyle-lawn-db`
4. Add **R2 bucket binding**:
   - Variable name: `IMAGES`
   - R2 bucket: Select `kyle-lawn-images`

## Step 7: Test Locally

Your `wrangler.toml` should now look like:

```toml
name = "kyle-lawn"
compatibility_date = "2024-01-01"

pages_build_output_dir = "./dist"

[[d1_databases]]
binding = "DB"
database_name = "kyle-lawn-db"
database_id = "YOUR_DATABASE_ID"

[[r2_buckets]]
binding = "IMAGES"
bucket_name = "kyle-lawn-images"
```

Test with local dev:
```bash
npm run dev:full
```

## Architecture Overview

### Blog Posts Flow:
1. **Create Post** (Admin Dashboard):
   - Admin creates post via web form
   - POST to `/api/blog/posts` → Saves to D1

2. **Upload Images**:
   - Admin uploads images
   - POST to `/api/images/upload` → Stores in R2
   - Returns public URL

3. **Display Posts**:
   - GET `/api/blog/posts` → Fetches from D1
   - Images served from R2 public URLs

### Image Gallery Flow:
1. **Upload**: Client uploads to `/api/images/upload`
2. **Store**: Function saves to R2 bucket
3. **Serve**: R2 generates public URL or use custom domain

## API Endpoints to Create

You'll need these Functions:

### Blog Posts:
- `GET /api/blog/posts` - List all published posts
- `GET /api/blog/posts/:slug` - Get single post
- `POST /api/blog/posts` - Create post (authenticated)
- `PUT /api/blog/posts/:id` - Update post (authenticated)
- `DELETE /api/blog/posts/:id` - Delete post (authenticated)

### Images:
- `POST /api/images/upload` - Upload image to R2 (authenticated)
- `GET /api/images/:postId` - Get all images for a post
- `DELETE /api/images/:id` - Delete image (authenticated)

## Cost Estimate

With Cloudflare's free tier:

**D1 Database:**
- 5 GB storage (plenty for thousands of blog posts)
- 5 million reads/day
- 100,000 writes/day

**R2 Storage:**
- 10 GB storage (hundreds of high-res photos)
- 1 million Class A operations/month (uploads, lists)
- 10 million Class B operations/month (downloads)
- **NO egress fees** (biggest advantage over AWS S3)

**Pages Functions:**
- 100,000 requests/day free
- Then $0.50 per million requests

For a lawn care blog, you'll likely stay **100% free** indefinitely!

## Alternative: Simpler Approach

If you want to start simpler before setting up D1/R2:

### Option A: JSON File in Repository
- Store blog posts as JSON files in `/public/data/posts.json`
- Commit images to `/public/images/`
- Simple but requires redeploy for each post
- Good for getting started quickly

### Option B: External Headless CMS
- Use Contentful, Sanity, or Strapi
- They handle storage and provide APIs
- More features but adds another service

## Recommended: Start with D1 + R2

The D1 + R2 approach is best because:
- ✅ Fully serverless
- ✅ No external dependencies
- ✅ Free tier is generous
- ✅ Fast (Cloudflare's edge network)
- ✅ Complete control over data
- ✅ Can update posts without redeploying code

Want me to implement the API Functions for this setup?
