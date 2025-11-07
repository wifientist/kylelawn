const services = [
  {
    title: 'Lawn Mowing',
    description: 'Regular mowing and edging to keep your lawn looking pristine and well-maintained.',
    icon: '🌱'
  },
  {
    title: 'Fertilization',
    description: 'Custom fertilization programs to promote healthy, lush grass growth year-round.',
    icon: '🌿'
  },
  {
    title: 'Weed Control',
    description: 'Targeted weed control treatments to keep your lawn free of unwanted growth.',
    icon: '🚫'
  },
  {
    title: 'Aeration',
    description: 'Core aeration services to improve soil health and grass root development.',
    icon: '💨'
  },
  {
    title: 'Seasonal Cleanup',
    description: 'Spring and fall cleanup services to prepare your lawn for the changing seasons.',
    icon: '🍂'
  },
  {
    title: 'Landscape Maintenance',
    description: 'Complete landscape care including trimming, mulching, and bed maintenance.',
    icon: '🏡'
  }
]

export default function Services() {
  return (
    <section id="services" className="bg-white">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive lawn care solutions tailored to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-lawn-green transition-colors duration-200"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
