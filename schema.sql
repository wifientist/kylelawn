-- Database schema for blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  featured_image TEXT,
  category TEXT NOT NULL CHECK(category IN ('lawn-care', 'tips', 'portfolio')),
  tags TEXT, -- JSON array stored as text
  published INTEGER DEFAULT 0, -- 0 = draft, 1 = published
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_created_at ON blog_posts(created_at DESC);

-- Table for blog post images (gallery)
CREATE TABLE IF NOT EXISTS blog_images (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_post_images ON blog_images(post_id, display_order);
