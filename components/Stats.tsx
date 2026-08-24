export default function Stats() {
  return (
    <section className="grid md:grid-cols-4 gap-10 px-10 py-20 text-center z-10000 bg-black">
      <div>
        <h3 className="text-4xl">250+</h3>
        <p className="opacity-60">Properties</p>
      </div>
      <div>
        <h3 className="text-4xl">40+</h3>
        <p className="opacity-60">Cities</p>
      </div>
      <div>
        <h3 className="text-4xl">15y</h3>
        <p className="opacity-60">Experience</p>
      </div>
      <div>
        <h3 className="text-4xl">99%</h3>
        <p className="opacity-60">Satisfaction</p>
      </div>
    </section>
  );
}