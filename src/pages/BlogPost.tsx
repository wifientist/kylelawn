import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { BlogPost } from '../types/blog'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call to Cloudflare Workers
    const mockPost: BlogPost = {
      id: '1',
      title: 'Spring Lawn Care Tips: Get Your Lawn Ready',
      slug: 'spring-lawn-care-tips',
      content: `
# Spring is the Perfect Time for Lawn Care

Spring is the most critical time of year for lawn care. As temperatures rise and grass begins to grow actively, it's essential to establish a solid foundation for a healthy, lush lawn throughout the growing season.

## Essential Spring Lawn Care Steps

### 1. Rake and Clean Up
Remove dead leaves, twigs, and debris that accumulated over winter. This allows sunlight and air to reach the grass and prevents disease.

### 2. Soil Testing
Test your soil pH and nutrient levels to determine what your lawn needs. Most grasses prefer a pH between 6.0 and 7.0.

### 3. Aeration
Core aeration helps reduce soil compaction and allows water, nutrients, and air to penetrate deep into the soil.

### 4. Fertilization
Apply a slow-release fertilizer to provide essential nutrients. Nitrogen is particularly important for promoting green, healthy growth.

### 5. Weed Prevention
Apply pre-emergent herbicide to prevent crabgrass and other annual weeds before they germinate.

## Pro Tips from the Experts

- **Don't cut too short**: Set your mower to 3-4 inches for most grass types
- **Water deeply but less frequently**: This encourages deeper root growth
- **Sharpen your mower blades**: Clean cuts prevent disease and stress

Following these steps will set your lawn up for success throughout the growing season!
      `,
      excerpt: 'Learn essential spring lawn care tips to prepare your lawn for the growing season.',
      imageUrl: 'https://placehold.co/1200x600/4CAF50/white?text=Spring+Lawn+Care',
      category: 'tips',
      tags: ['spring', 'fertilization', 'maintenance'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: true
    }

    setTimeout(() => {
      setPost(mockPost)
      setLoading(false)
    }, 300)
  }, [slug])

  if (loading) {
    return (
      <div className="section-container flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-gray-600">Loading post...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="section-container text-center py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-lawn-green hover:text-dark-green">
          Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <article className="bg-gray-50 min-h-screen">
      <div className="relative h-96 bg-gradient-to-br from-lawn-green to-dark-green">
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 flex items-center">
          <div className="section-container text-white">
            <Link to="/blog" className="text-green-100 hover:text-white mb-4 inline-block">
              ← Back to Blog
            </Link>
            <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
            <div className="flex gap-4 items-center text-green-100">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="capitalize">{post.category}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg -mt-16 relative z-10 p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>
              } else if (paragraph.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{paragraph.slice(3)}</h2>
              } else if (paragraph.startsWith('### ')) {
                return <h3 key={index} className="text-xl font-semibold mt-4 mb-2">{paragraph.slice(4)}</h3>
              } else if (paragraph.startsWith('- ')) {
                return <li key={index} className="ml-6">{paragraph.slice(2)}</li>
              } else if (paragraph.trim()) {
                return <p key={index} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>
              }
              return null
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-lawn-green/10 text-dark-green text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
