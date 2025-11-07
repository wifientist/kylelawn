export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-lawn-green to-dark-green text-white">
      <div className="section-container py-24">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-5xl font-bold mb-6">
            Professional Lawn Care Services
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-50">
            Take your lawn to the next level. Reliable, affordable, and tailored to your needs.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#contact" className="btn-primary bg-white text-dark-green hover:bg-gray-100">
              Get Free Quote
            </a>
            <a href="#portfolio" className="btn-secondary border-white text-dark-green hover:bg-gray-100">
              View Our Work
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
