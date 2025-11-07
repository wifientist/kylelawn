export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  images?: string[];
  category: 'lawn-care' | 'tips' | 'portfolio';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export interface CreateBlogPost {
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  images?: string[];
  category: 'lawn-care' | 'tips' | 'portfolio';
  tags: string[];
  published: boolean;
}
