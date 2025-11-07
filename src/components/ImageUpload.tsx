import { useState } from 'react'
import { getAuthToken } from '../utils/auth'

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void
  postId?: string
}

export default function ImageUpload({ onImageUploaded, postId }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', file)
      if (postId) {
        formData.append('postId', postId)
      }

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        onImageUploaded(data.imageUrl)
      } else {
        setError('Failed to upload image')
      }
    } catch (err) {
      setError('Error uploading image')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload Image
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-lawn-green file:text-white
          hover:file:bg-dark-green
          disabled:opacity-50"
      />
      {uploading && (
        <p className="mt-2 text-sm text-gray-600">Uploading...</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
