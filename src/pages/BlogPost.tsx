import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { BlogPost } from '../types/blog'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setPost(data.post)
        } else {
          console.error('Failed to fetch post')
        }
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPost()
    }
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
      <div className="relative h-96 bg-gray-900">
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="section-container text-white">
            <Link to="/blog" className="text-white/80 hover:text-white mb-4 inline-block">
              ← Back to Blog
            </Link>
            <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
            <div className="flex gap-4 items-center text-white/90">
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
