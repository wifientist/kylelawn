import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { isAuthenticated } from '../utils/auth'

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Check authentication status on mount and after storage changes
    const checkAuth = () => setIsLoggedIn(isAuthenticated())
    checkAuth()

    // Listen for storage events (in case auth changes in another tab)
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  const handleGetQuote = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    if (location.pathname === '/') {
      // Already on home page, just scroll to contact
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Navigate to home page, then scroll to contact
      navigate('/')
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-dark-green">
              Kyle Jones Lawn Maintenance
            </Link>
            <div className="flex gap-6 items-center">
              <Link to="/" className="text-gray-700 hover:text-lawn-green transition-colors">
                Home
              </Link>
              <Link to="/blog" className="text-gray-700 hover:text-lawn-green transition-colors">
                Blog
              </Link>
              {isLoggedIn && (
                <Link to="/admin" className="text-gray-700 hover:text-lawn-green transition-colors">
                  Admin
                </Link>
              )}
              <a href="#contact" onClick={handleGetQuote} className="btn-primary">
                Get Quote
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Kyle Jones Lawn Maintenance</p>
            <p className="text-gray-400">Professional lawn care services you can trust</p>
            <p className="text-gray-500 text-sm mt-4">
              &copy; {new Date().getFullYear()} Kyle Jones Lawn Maintenance. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
