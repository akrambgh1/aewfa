export default function Contact() {
  return (
    <section
      id="contact"
      className="relative  w-full py-32 px-10 bg-black text-white"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">

        {/* LEFT SIDE - INFO */}
        <div>
          <h2 className="text-5xl font-light">
            Let’s Build Something Cinematic
          </h2>

          <p className="mt-6 text-white/60 text-lg leading-relaxed max-w-lg">
            Whether you’re showcasing a luxury property, building a real estate brand,
            or creating a digital experience — we design immersive, high-end web visuals
            that convert attention into emotion.
          </p>

          <div className="mt-10 space-y-4 text-white/60">
            <p>📍 Global Remote Studio</p>
            <p>📧 contact@cinematicstudio.com</p>
            <p>⏱ Response within 24 hours</p>
          </div>

          {/* decorative glow */}
          <div className="mt-12 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="relative">

          {/* glass card */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 shadow-2xl">

            <h3 className="text-2xl mb-6 font-light">
              Start a Project
            </h3>

            <input
              className="w-full p-4 mb-4 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-white/30 transition"
              placeholder="Your Name"
            />

            <input
              className="w-full p-4 mb-4 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-white/30 transition"
              placeholder="Email Address"
            />

            <textarea
              className="w-full p-4 mb-6 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-white/30 transition"
              rows={5}
              placeholder="Tell us about your project..."
            />

            <button
              className="w-full py-4 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition"
            >
              Send Message
            </button>

            <p className="text-xs text-white/40 mt-4 text-center">
              We usually respond within 24 hours
            </p>

          </div>
        </div>

      </div>
    </section>
  );
}