"use client";

export default function Hero() {
  return (
    // h-full instead of h-screen — fills whatever parent gives it.
    // When used in CinematicScroll the parent is absolute inset-0 (= 100vh).
    // When used in MobileLayout the parent is a normal flow section (h-screen via min-h).
    <section className="relative h-full w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex h-full items-center justify-center">
        <h1 className="text-7xl font-light text-white">Luxury Living</h1>
      </div>
    </section>
  );
}