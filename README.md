# Kyle's Lawn Care Website

A modern, professional lawn care website built with React, Vite, and Tailwind CSS, deployed on Cloudflare Pages.

## Features

- **Landing Page**: Professional hero section, services overview, portfolio showcase, and contact form
- **Blog System**: Dynamic blog with categories (Tips & Tricks, Portfolio, Lawn Care)
- **Admin Dashboard**: Secure admin login to create and manage blog posts
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **SEO Optimized**: Meta tags and semantic HTML for better search visibility

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Hosting**: Cloudflare Pages
- **Functions**: Cloudflare Workers (for API endpoints)

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

\`\`\`bash
npm install
\`\`\`

### Run Development Server

\`\`\`bash
npm run dev
\`\`\`

The site will be available at `http://localhost:5173`

### Build for Production

\`\`\`bash
npm run build
\`\`\`

## Deployment to Cloudflare Pages

### First Time Setup

1. Install Wrangler CLI globally (if not already installed):
   \`\`\`bash
   npm install -g wrangler
   \`\`\`

2. Login to Cloudflare:
   \`\`\`bash
   wrangler login
   \`\`\`

3. Set environment variable for admin password:
   \`\`\`bash
   wrangler pages secret put ADMIN_PASSWORD
   \`\`\`
   Enter your desired admin password when prompted.

### Deploy

Deploy to Cloudflare Pages:

\`\`\`bash
npm run pages:deploy
\`\`\`

Or deploy manually:

\`\`\`bash
npm run build
wrangler pages deploy ./dist
\`\`\`

### Environment Variables

Set these in Cloudflare Pages dashboard:

- \`ADMIN_PASSWORD\`: Password for admin login

## Admin Access

Access the admin dashboard at `/admin/login` with your configured password.

## Project Structure

\`\`\`
kylelawn/
├── functions/          # Cloudflare Pages Functions (API endpoints)
│   └── api/
│       └── auth/
│           └── login.ts
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── layouts/        # Layout components
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── wrangler.toml       # Cloudflare configuration
└── package.json
\`\`\`

## Customization

### Update Colors

Edit [tailwind.config.js](tailwind.config.js) to customize the lawn-green theme colors:

\`\`\`js
colors: {
  'lawn-green': '#4CAF50',
  'dark-green': '#2E7D32',
}
\`\`\`

### Add Your Content

- Replace placeholder images in [src/components/Portfolio.tsx](src/components/Portfolio.tsx)
- Update services in [src/components/Services.tsx](src/components/Services.tsx)
- Modify hero text in [src/components/Hero.tsx](src/components/Hero.tsx)

## Future Enhancements

- [ ] Cloudflare D1 database for blog post storage
- [ ] Image upload with Cloudflare Images
- [ ] Contact form with email notifications
- [ ] Analytics integration
- [ ] Rich text editor for blog posts
- [ ] Blog post drafts and scheduling

## License

ISC
