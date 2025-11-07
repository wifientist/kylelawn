-- Add table for tracking all uploaded images (not just blog-related)
CREATE TABLE IF NOT EXISTS uploaded_images (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  content_type TEXT,
  size INTEGER,
  uploaded_by TEXT DEFAULT 'admin',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_uploaded_images_created ON uploaded_images(created_at DESC);
