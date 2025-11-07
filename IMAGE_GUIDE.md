# Image Handling Guide

## Current Setup

Your blog supports images via URLs. Here are your options:

## Option 1: Use External Image URLs (Easiest - Current)

Just paste image URLs from any public source:

### Free Image Sources:
- **Unsplash**: https://unsplash.com (free high-quality photos)
- **Pexels**: https://pexels.com
- **Pixabay**: https://pixabay.com

### Example URLs:
```
https://images.unsplash.com/photo-lawn-care?w=800
https://images.pexels.com/photos/lawn-grass-green.jpg
```

## Option 2: Cloudflare R2 Upload (Best for production)

### Setup R2 Public Access:

1. **Enable Public Access:**
   ```bash
   npx wrangler r2 bucket domain add kyle-lawn-images
   ```

2. **Or use R2.dev subdomain:**
   - Go to Cloudflare Dashboard → R2 → kyle-lawn-images
   - Settings → Public Access → "Allow Access"
   - Copy your public URL: `https://pub-xxxxx.r2.dev`

3. **Add to environment:**
   - Add `R2_PUBLIC_ID` to your `.dev.vars`:
     ```
     R2_PUBLIC_ID=your-public-id-here
     ```
   - Add to Cloudflare Pages environment variables

4. **Upload via Admin Dashboard:**
   - The upload button will now work
   - Images stored in R2
   - Automatic URL generation

## Option 3: Cloudflare Images (Premium but best)

Cloudflare Images ($5/month for 100k images):
- Automatic resizing
- CDN delivery
- Image transformations
- Better performance

### Setup:
1. Enable Cloudflare Images in dashboard
2. Update upload function to use Images API
3. Get automatic variants (thumbnail, full-size, etc.)

## Option 4: Use Your Own Hosting

Upload images to:
- Your web server
- AWS S3
- Google Cloud Storage
- Any CDN

Then paste the public URLs in the admin dashboard.

## Current Workflow (Recommended for now):

1. **Find or take a photo** of your lawn work
2. **Upload to Unsplash, Imgur, or your own hosting**
3. **Copy the direct image URL**
4. **Paste into blog post form** in admin dashboard

Example flow:
1. Go to https://imgur.com/upload
2. Upload your lawn photo
3. Right-click → "Copy image address"
4. Paste URL in your blog post: `https://i.imgur.com/abc123.jpg`

## For Production:

I recommend using Cloudflare R2 with public access once you're ready to deploy. For now, using external URLs (Unsplash, Imgur, etc.) works perfectly fine!

## Quick Image URLs for Testing:

Lawn Care themed:
```
https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800
https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?w=800
https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800
```
