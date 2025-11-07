const portfolioImages = [
  {
    id: 1,
    title: 'Residential Lawn Transformation',
    description: 'Complete lawn renovation with fresh sod and landscape design',
    imageUrl: 'https://placehold.co/600x400/4CAF50/white?text=Lawn+1'
  },
  {
    id: 2,
    title: 'Commercial Property Maintenance',
    description: 'Weekly maintenance for commercial property in pristine condition',
    imageUrl: 'https://placehold.co/600x400/2E7D32/white?text=Lawn+2'
  },
  {
    id: 3,
    title: 'Spring Clean-Up',
    description: 'Before and after spring cleanup and fertilization',
    imageUrl: 'https://placehold.co/600x400/4CAF50/white?text=Lawn+3'
  },
  {
    id: 4,
    title: 'Landscape Design',
    description: 'Custom landscape design with native plants and mulching',
    imageUrl: 'https://placehold.co/600x400/2E7D32/white?text=Lawn+4'
  }
]

export default function Portfolio() {
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
          {portfolioImages.map((item) => (
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
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
