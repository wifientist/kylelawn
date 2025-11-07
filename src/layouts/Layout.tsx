import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
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
              <a href="#contact" className="btn-primary">
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
