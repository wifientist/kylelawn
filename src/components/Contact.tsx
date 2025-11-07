export default function Contact() {
  return (
    <section id="contact" className="bg-white">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to transform your lawn? Contact us today for a free consultation and quote.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="tel:+15555551234"
              className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
            >
              <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
                📞
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                <p className="text-lawn-green text-lg font-medium">(912) 555-5555</p>
              </div>
            </a>

            <a
              href="mailto:contact@kylelawn.com"
              className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
            >
              <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
                📧
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                <p className="text-lawn-green text-lg font-medium">kyle@kylejoneslawn.com</p>
              </div>
            </a>
          </div>

          <div className="mt-8 p-6 bg-lawn-green/5 rounded-lg border border-lawn-green/20">
            <p className="text-center text-gray-700">
              <span className="font-semibold">Service Area:</span> We proudly serve the greater Effingham area
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
