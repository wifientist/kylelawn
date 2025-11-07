import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, removeAuthToken, getAuthToken } from '../utils/auth'
import type { BlogPost, CreateBlogPost } from '../types/blog'
import ImageUpload from '../components/ImageUpload'

interface PortfolioItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  displayOrder: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'posts' | 'images' | 'portfolio'>('posts')
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [uploadedImages, setUploadedImages] = useState<Array<{url: string, name: string}>>([])
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [portfolioForm, setPortfolioForm] = useState({ title: '', subtitle: '', imageUrl: '' })
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

    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images/list', {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setUploadedImages(data.images.map((img: any) => ({
            url: img.url,
            name: img.filename
          })))
        }
      } catch (error) {
        console.error('Failed to fetch images:', error)
      }
    }

    const fetchPortfolio = async () => {
      try {
        const response = await fetch('/api/portfolio/items')
        if (response.ok) {
          const data = await response.json()
          setPortfolioItems(data.items || [])
        }
      } catch (error) {
        console.error('Failed to fetch portfolio items:', error)
      }
    }

    fetchPosts()
    fetchImages()
    fetchPortfolio()
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

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      imageUrl: post.imageUrl || '',
      images: post.images || [],
      category: post.category,
      tags: post.tags,
      published: post.published,
    })
    setIsCreating(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPost) return

    try {
      const response = await fetch(`/api/blog/${editingPost.slug}`, {
        method: 'PUT',
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
        setEditingPost(null)
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
        console.error('Failed to update post')
      }
    } catch (error) {
      console.error('Failed to update post:', error)
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

  const handleDeleteImage = async (filename: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await fetch(`/api/images/delete/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      })

      if (response.ok) {
        setUploadedImages(uploadedImages.filter(img => img.name !== filename))
      } else {
        console.error('Failed to delete image')
      }
    } catch (error) {
      console.error('Failed to delete image:', error)
    }
  }

  const handleCreatePortfolioItem = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/portfolio/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          title: portfolioForm.title,
          subtitle: portfolioForm.subtitle,
          image_url: portfolioForm.imageUrl
        })
      })

      if (response.ok) {
        // Refetch portfolio items
        const itemsResponse = await fetch('/api/portfolio/items')
        if (itemsResponse.ok) {
          const data = await itemsResponse.json()
          setPortfolioItems(data.items || [])
        }

        setPortfolioForm({ title: '', subtitle: '', imageUrl: '' })
      } else {
        console.error('Failed to create portfolio item')
      }
    } catch (error) {
      console.error('Failed to create portfolio item:', error)
    }
  }

  const handleDeletePortfolioItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return

    try {
      const response = await fetch('/api/portfolio/items', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        setPortfolioItems(portfolioItems.filter(item => item.id !== id))
      } else {
        console.error('Failed to delete portfolio item')
      }
    } catch (error) {
      console.error('Failed to delete portfolio item:', error)
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
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`${
                activeTab === 'posts'
                  ? 'border-lawn-green text-lawn-green'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Blog Posts
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`${
                activeTab === 'images'
                  ? 'border-lawn-green text-lawn-green'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Images
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`${
                activeTab === 'portfolio'
                  ? 'border-lawn-green text-lawn-green'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Portfolio
            </button>
          </nav>
        </div>

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <>
            <div className="mb-6">
              <button
                onClick={() => {
                  if (isCreating) {
                    setIsCreating(false)
                    setEditingPost(null)
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
                    setIsCreating(true)
                  }
                }}
                className="btn-primary"
              >
                {isCreating ? 'Cancel' : 'Create New Post'}
              </button>
            </div>

        {isCreating && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>
            <form onSubmit={editingPost ? handleUpdate : handleSubmit} className="space-y-4">
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
                <ImageUpload
                  onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="max-w-xs rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove image
                    </button>
                  </div>
                )}
                <p className="mt-2 text-sm text-gray-500">Or enter a URL manually:</p>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawn-green focus:border-transparent"
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
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false)
                    setEditingPost(null)
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
                  }}
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
                      onClick={() => handleEdit(post)}
                      className="text-lawn-green hover:text-dark-green px-3 py-1 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.slug)}
                      className="text-red-600 hover:text-red-800 px-3 py-1 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
          </>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
              <ImageUpload
                onImageUploaded={(url) => {
                  setUploadedImages(prev => [...prev, { url, name: url.split('/').pop() || 'image' }])
                }}
              />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Before/After Image Comparison</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  To add a before/after comparison slider in your blog post, use this syntax:
                </p>
                <code className="block bg-white px-3 py-2 rounded text-sm text-gray-800 font-mono">
                  [compare: BEFORE_IMAGE_URL | AFTER_IMAGE_URL]
                </code>
                <p className="text-xs text-gray-600 mt-2">
                  Example: [compare: https://your-site.com/before.jpg | https://your-site.com/after.jpg]
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Uploaded Images</h2>
              {uploadedImages.length === 0 ? (
                <p className="text-gray-500">No images uploaded yet. Upload your first image above!</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-2 bg-gray-50">
                        <p className="text-xs text-gray-600 truncate mb-2">{image.name}</p>
                        <input
                          type="text"
                          value={image.url}
                          readOnly
                          onClick={(e) => {
                            e.currentTarget.select()
                            navigator.clipboard.writeText(image.url).then(() => {
                              alert('✓ URL copied!')
                            }).catch(() => {
                              alert('✓ URL selected - press Ctrl+C to copy')
                            })
                          }}
                          className="w-full text-xs px-2 py-1 mb-2 border border-gray-300 rounded text-gray-600 cursor-pointer hover:border-lawn-green"
                          title="Click to copy URL"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(image.url)
                                alert('✓ URL copied to clipboard!')
                              } catch (err) {
                                alert('URL: ' + image.url)
                              }
                            }}
                            className="text-xs text-lawn-green hover:text-dark-green font-semibold flex-1"
                          >
                            Copy URL
                          </button>
                          <button
                            onClick={() => handleDeleteImage(image.name)}
                            className="text-xs text-red-600 hover:text-red-800 font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500 mt-4">
                Upload images here and copy their URLs to use in blog posts or portfolio section.
              </p>
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Add Portfolio Item</h2>
              <form onSubmit={handleCreatePortfolioItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawn-green focus:border-transparent"
                    value={portfolioForm.title}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawn-green focus:border-transparent"
                    value={portfolioForm.subtitle}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, subtitle: e.target.value })}
                  />
                </div>

                <div>
                  <ImageUpload
                    onImageUploaded={(url) => setPortfolioForm({ ...portfolioForm, imageUrl: url })}
                  />
                  {portfolioForm.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={portfolioForm.imageUrl}
                        alt="Preview"
                        className="max-w-xs rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                  <p className="mt-2 text-sm text-gray-500">Or enter a URL manually:</p>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/image.jpg"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawn-green focus:border-transparent"
                    value={portfolioForm.imageUrl}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, imageUrl: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-primary">
                  Add Portfolio Item
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Portfolio Items</h2>
              {portfolioItems.length === 0 ? (
                <p className="text-gray-500">No portfolio items yet. Add your first item above!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolioItems.map((item) => (
                    <div key={item.id} className="border rounded-lg overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        {item.subtitle && (
                          <p className="text-sm text-gray-600 mt-1">{item.subtitle}</p>
                        )}
                        <button
                          onClick={() => handleDeletePortfolioItem(item.id)}
                          className="mt-3 text-sm text-red-600 hover:text-red-800 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
