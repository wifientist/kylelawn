# Cloudflare Pages Deployment Guide

This guide will walk you through deploying your lawn care website to Cloudflare Pages with serverless functions.

## Prerequisites

- Cloudflare account (free tier works fine)
- Wrangler CLI (already installed in this project)

## Deployment Steps

### 1. Login to Cloudflare

First, authenticate with Cloudflare:

```bash
npx wrangler login
```

This will open a browser window for you to authorize Wrangler with your Cloudflare account.

### 2. Build Your Project

Build the production version of your site:

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### 3. Initial Deployment

Deploy to Cloudflare Pages for the first time:

```bash
npx wrangler pages deploy ./dist --project-name=kyle-lawn
```

You'll be prompted to:
- Confirm the project name (or change it)
- Choose a production branch (default: main)

### 4. Set Environment Variables

After the initial deployment, set your admin password as a secret:

```bash
npx wrangler pages secret put ADMIN_PASSWORD --project-name=kyle-lawn
```

When prompted, enter your desired admin password.

### 5. Subsequent Deployments

For future deployments, simply run:

```bash
npm run pages:deploy
```

This command builds and deploys in one step.

## Alternative: GitHub Integration (Recommended for Production)

For automatic deployments on git push:

### 1. Push to GitHub

Initialize git and push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kyle-lawn.git
git push -u origin main
```

### 2. Connect Cloudflare Pages to GitHub

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click "Workers & Pages" in the sidebar
3. Click "Create application" → "Pages" → "Connect to Git"
4. Authorize Cloudflare to access your GitHub
5. Select your repository (`kyle-lawn`)
6. Configure build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
7. Add environment variable:
   - **Variable name**: `ADMIN_PASSWORD`
   - **Value**: Your admin password
8. Click "Save and Deploy"

### 3. Automatic Deployments

Now every time you push to `main`, Cloudflare will automatically:
- Build your site
- Deploy the new version
- Provide a unique preview URL

## Custom Domain Setup

### Option 1: Using a Cloudflare-managed domain

1. Go to your Pages project settings
2. Click "Custom domains"
3. Click "Set up a custom domain"
4. Enter your domain (e.g., `kylelawn.com`)
5. Cloudflare will automatically configure DNS

### Option 2: External domain

1. Go to your Pages project settings
2. Click "Custom domains"
3. Add your domain
4. Update your DNS provider with the CNAME record Cloudflare provides:
   - Type: `CNAME`
   - Name: `@` (or `www`)
   - Value: `kyle-lawn.pages.dev`

## Project Structure for Cloudflare

Your project is already configured correctly:

```
kylelawn/
├── functions/              # Cloudflare Pages Functions
│   └── api/
│       └── auth/
│           └── login.ts    # Auth endpoint at /api/auth/login
├── public/
│   └── _routes.json        # Routes configuration
├── dist/                   # Build output (auto-generated)
└── src/                    # React source code
```

### How Pages Functions Work

- Files in `functions/` become serverless endpoints
- `functions/api/auth/login.ts` → `/api/auth/login`
- Each file exports `onRequest`, `onRequestGet`, `onRequestPost`, etc.
- Functions run on Cloudflare's edge network

## Environment Variables

Set these in Cloudflare Pages dashboard or via Wrangler:

### Production
- `ADMIN_PASSWORD` - Your admin dashboard password

### Setting via Dashboard
1. Go to Workers & Pages
2. Select your project
3. Go to Settings → Environment variables
4. Add variables for Production and/or Preview

### Setting via Wrangler
```bash
npx wrangler pages secret put ADMIN_PASSWORD --project-name=kyle-lawn
```

## Testing Locally with Functions

To test with Cloudflare Pages Functions locally:

```bash
npm run pages:dev
```

This runs Vite dev server with Wrangler Pages dev environment.

## Monitoring & Logs

View function logs and analytics:

1. Go to Cloudflare Dashboard
2. Workers & Pages → Your project
3. Click "Logs" or "Analytics"

## Troubleshooting

### Build Fails
- Check that `npm run build` works locally
- Verify Node.js version (use Node 18+)
- Check build logs in Cloudflare dashboard

### Functions Not Working
- Verify `functions/` directory structure
- Check function syntax (must export onRequest handlers)
- View function logs in dashboard

### 404 Errors
- Ensure `_routes.json` is in `public/` directory
- Check that React Router is configured for client-side routing
- Add `_redirects` file if needed

### Environment Variables Not Available
- Make sure variables are set in the correct environment (Production vs Preview)
- Restart deployment after adding variables

## Next Steps

1. **Add D1 Database**: For persistent blog storage
   ```bash
   npx wrangler d1 create kyle-lawn-db
   ```

2. **Add R2 Storage**: For image uploads
   ```bash
   npx wrangler r2 bucket create kyle-lawn-images
   ```

3. **Email Integration**: Use Cloudflare Email Workers for contact form

4. **Analytics**: Enable Cloudflare Web Analytics in dashboard

## Useful Commands

```bash
# Build locally
npm run build

# Deploy
npm run pages:deploy

# Test locally with functions
npm run pages:dev

# View deployment list
npx wrangler pages deployments list --project-name=kyle-lawn

# Rollback to previous deployment
npx wrangler pages deployment tail --project-name=kyle-lawn
```

## Cost

Cloudflare Pages is **FREE** for:
- Unlimited static requests
- Unlimited bandwidth
- 500 builds per month
- 100,000 Pages Functions requests per day

Perfect for a lawn care website!
