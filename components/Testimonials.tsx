export default function Testimonials() {
  return (
    <section className="px-10 py-32 bg-white/5">
      <h2 className="text-4xl mb-10">Testimonials</h2>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-6 bg-black/40 rounded-xl">
          “Feels like a luxury Apple product.”
        </div>
        <div className="p-6 bg-black/40 rounded-xl">
          “Insane UI and smooth experience.”
        </div>
        <div className="p-6 bg-black/40 rounded-xl">
          “Best real estate website I’ve seen.”
        </div>
      </div>
    </section>
  );
}