"use client";

import Image from "next/image";
import PageTransition from "@/components/PageTransition";

export default function ResidencesPage() {
  const items = [
    "EL RAYANE",
    "NARCISSE",
    "AMÉTHYSTE",
  ];

  return (
    <PageTransition>
      <main className="bg-[#f5ede0] pt-32 px-6 lg:px-12">
        <h1 className="font-serif text-6xl">Projets en cours</h1>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {items.map((name) => (
            <div key={name} className="group">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=90"
                  alt={name}
                  fill
                  className="object-cover brightness-[0.7] group-hover:scale-105 transition"
                />
              </div>

              <h3 className="mt-4 font-serif text-2xl">{name}</h3>
              <p className="text-sm text-[#6b5c4e]">Appartement haut standing</p>
            </div>
          ))}
        </div>
      </main>
    </PageTransition>
  );
}