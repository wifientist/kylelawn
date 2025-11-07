import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, removeAuthToken, getAuthToken } from '../utils/auth'
import type { BlogPost, CreateBlogPost } from '../types/blog'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<CreateBlogPost>({
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    images: [],
    category: 'tips',
    tags: [],
    published: false,
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login')
      return
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog/posts?drafts=true', {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts || [])
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      }
    }

    fetchPosts()
  }, [navigate])

  const handleLogout = () => {
    removeAuthToken()
    navigate('/admin/login')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          featured_image: formData.imageUrl,
          category: formData.category,
          tags: formData.tags,
          published: formData.published
        })
      })

      if (response.ok) {
        // Refetch posts
        const postsResponse = await fetch('/api/blog/posts?drafts=true', {
          headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        })
        if (postsResponse.ok) {
          const postsData = await postsResponse.json()
          setPosts(postsData.posts || [])
        }

        setIsCreating(false)
        setFormData({
          title: '',
          content: '',
          excerpt: '',
          imageUrl: '',
          images: [],
          category: 'tips',
          tags: [],
          published: false,
        })
      } else {
        console.error('Failed to create post')
      }
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      })

      if (response.ok) {
        setPosts(posts.filter(p => p.slug !== slug))
      } else {
        console.error('Failed to delete post')
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="btn-primary"
          >
            {isCreating ? 'Cancel' : 'Create New Post'}
          </button>
        </div>

        {isCreating && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawn-green focus:border-transparent"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  required
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawn-green focus:border-transparent"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (Markdown supported)
                </label>
                <textarea
                  required
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawn-green focus:border-transparent font-mono text-sm"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawn-green focus:border-transparent"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawn-green focus:border-transparent"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                >
                  <option value="tips">Tips & Tricks</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="lawn-care">Lawn Care</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawn-green focus:border-transparent"
                  placeholder="spring, lawn-care, tips"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  className="h-4 w-4 text-lawn-green focus:ring-lawn-green border-gray-300 rounded"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                  Publish immediately
                </label>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn-primary">
                  Create Post
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Blog Posts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {posts.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No posts yet. Create your first post!
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.title}</h3>
                    <p className="text-sm text-gray-600">{post.excerpt}</p>
                    <div className="mt-2 flex gap-2 items-center text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded text-xs ${post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(post.slug)}
                      className="text-red-600 hover:text-red-800 px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
