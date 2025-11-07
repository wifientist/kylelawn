import { useState, useEffect } from 'react'

interface PortfolioItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
}

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('/api/portfolio/items')
        if (response.ok) {
          const data = await response.json()
          setItems(data.items || [])
        }
      } catch (error) {
        console.error('Failed to fetch portfolio items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [])

  if (loading) {
    return (
      <section id="portfolio" className="bg-gray-50">
        <div className="section-container">
          <div className="text-center">
            <p className="text-gray-600">Loading portfolio...</p>
          </div>
        </div>
      </section>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <section id="portfolio" className="bg-gray-50">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Work</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See the results of our professional lawn care services
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
                {item.subtitle && (
                  <p className="text-gray-600">{item.subtitle}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
