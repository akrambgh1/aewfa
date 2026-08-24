export default function About() {
  return (
    <section
      id="about"
      className="relative w-full py-32 px-10 bg-black text-white"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">

        {/* LEFT: TEXT */}
        <div className="flex-1">
          <h2 className="text-5xl font-light leading-tight">
            About Our Vision
          </h2>

          <p className="mt-6 text-white/60 text-lg leading-relaxed max-w-xl">
            We design cinematic real estate experiences combining architecture,
            motion design, and interactive 3D environments.  
            Our focus is not just showcasing properties — but creating emotional
            spatial storytelling that feels like walking through a film.
          </p>

          <div className="mt-10 flex gap-6 text-sm text-white/50">
            <div>
              <p className="text-white text-xl">10+</p>
              <p>Years Design</p>
            </div>

            <div>
              <p className="text-white text-xl">250+</p>
              <p>Properties</p>
            </div>

            <div>
              <p className="text-white text-xl">40+</p>
              <p>Countries</p>
            </div>
          </div>
        </div>

        {/* RIGHT: IMAGE */}
        <div className="flex-1 relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
              className="w-full h-[500px] object-cover"
              alt="Luxury Architecture"
            />

            {/* overlay for cinematic feel */}
            <div className="absolute inset-0 bg-black/20" />
                  </div>
                    

          {/* floating label */}
          <div className="absolute -bottom-6 left-6 bg-white text-black px-6 py-3 rounded-xl shadow-lg">
            Luxury Architecture Studio
                  </div>
                 
        </div>
 <div className="absolute mt-60 mr-0 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
      </div>
    </section>
  );
}