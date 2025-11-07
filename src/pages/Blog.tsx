import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { BlogPost } from '../types/blog'

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog/posts')
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts || [])
        } else {
          console.error('Failed to fetch posts')
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const filteredPosts = filter === 'all'
    ? posts
    : posts.filter(post => post.category === filter)

  if (loading) {
    return (
      <div className="section-container flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-gray-600">Loading posts...</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-br from-lawn-green to-dark-green text-white py-16">
        <div className="section-container">
          <h1 className="text-5xl font-bold mb-4">Lawn Care Blog</h1>
          <p className="text-xl text-green-50">
            Tips, tricks, and showcase of our latest lawn care projects
          </p>
        </div>
      </div>

      <div className="section-container">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-lawn-green text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Posts
          </button>
          <button
            onClick={() => setFilter('tips')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'tips'
                ? 'bg-lawn-green text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Tips & Tricks
          </button>
          <button
            onClick={() => setFilter('portfolio')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'portfolio'
                ? 'bg-lawn-green text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Portfolio
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-lawn-green/10 text-dark-green rounded">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-2 text-gray-900 hover:text-lawn-green transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No posts found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
