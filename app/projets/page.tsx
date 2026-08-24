"use client";

import PageTransition from "@/components/PageTransition";
import Image from "next/image";

const residences = [
  {
    name: "AZURÉA",
    city: "Hydra, Alger",
    type: "Résidence Haut Standing",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1800&auto=format&fit=crop",
    description:
      "Résidence moderne composée d’appartements F2 à F5 avec vues dégagées, sécurité 24/7 et parking sous-sol.",
  },
  {
    name: "MONTEVIA",
    city: "Dely Ibrahim, Alger",
    type: "Résidence Premium",
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1800&auto=format&fit=crop",
    description:
      "Architecture contemporaine, grandes baies vitrées et finitions haut standing dans un environnement résidentiel calme.",
  },
  {
    name: "NOVA PARK",
    city: "Chéraga, Alger",
    type: "Résidence Moderne",
    image:
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?q=80&w=1800&auto=format&fit=crop",
    description:
      "Un ensemble résidentiel urbain pensé pour les familles modernes avec espaces verts et commodités intégrées.",
  },
];

export default function CollectionPage() {
    return (
     
   <>    
      <PageTransition>
   
    <main className="bg-[#f5ede0] text-[#1a1410] overflow-x-hidden">
      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2000&auto=format&fit=crop"
            alt="Résidences El Rayane"
            fill
            priority
            className="object-cover brightness-[0.45]"
          />
        </div>

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1410]/90 via-[#1a1410]/60 to-transparent" />

        <div className="relative z-10 max-w-5xl px-6 lg:px-12">
          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#c4956a]">
            Collection Résidentielle —  Immobilier
          </p>

          <h1 className="font-serif text-6xl font-light leading-[0.9] text-white lg:text-[8rem]">
            L’immobilier
            <br />
            <span className="italic text-[#c4956a]">haut standing</span>
            <br />
            à Alger
          </h1>

          <p className="mt-10 max-w-xl text-sm leading-8 text-white/70">
            Des résidences modernes exclusivement composées d’appartements,
            pensées pour le confort, la sécurité et l’élégance architecturale.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="border-b border-[#c4956a20] px-6 py-24 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.35em] text-[#c4956a]">
              Notre Vision
            </p>

            <h2 className="font-serif text-5xl font-light leading-tight lg:text-7xl">
              Concevoir des
              <br />
              résidences
              <br />
              modernes.
            </h2>
          </div>

          <div className="flex items-end">
            <p className="max-w-xl text-sm leading-9 text-[#6b5c4e]">
              El Rayane Immobilier développe des résidences composées
              exclusivement d’appartements haut standing à Alger.
              Chaque projet est pensé avec une architecture moderne,
              des matériaux durables et une localisation stratégique.
            </p>
          </div>
        </div>
      </section>

      {/* RESIDENCES */}
      <section className="px-6 py-24 lg:px-12">
        <div className="mb-20 flex items-end justify-between">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#c4956a]">
              Projets disponibles
            </p>

            <h2 className="font-serif text-5xl font-light lg:text-7xl">
              Nos résidences
            </h2>
          </div>
        </div>

        <div className="space-y-32">
          {residences.map((item, index) => (
            <div
              key={item.name}
              className={`grid items-center gap-14 lg:grid-cols-2 ${
                index % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* IMAGE */}
              <div className="relative overflow-hidden aspect-[4/5]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover brightness-[0.7] transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* TEXT */}
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#c4956a]">
                  {item.type}
                </p>

                <h3 className="font-serif text-6xl font-light">
                  {item.name}
                </h3>

                <p className="mt-3 text-sm uppercase tracking-[0.2em] text-[#6b5c4e]">
                  {item.city}
                </p>

                <p className="mt-8 max-w-lg text-sm leading-9 text-[#6b5c4e]">
                  {item.description}
                </p>

                <button className="mt-10 border border-[#c4956a] px-8 py-4 text-xs uppercase tracking-[0.3em] text-[#c4956a] transition hover:bg-[#c4956a] hover:text-white">
                  Explorer le projet
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NUMBERS */}
      <section className="bg-[#1a1410] px-6 py-24 text-white lg:px-12">
        <div className="grid gap-12 md:grid-cols-3">
          {[
            ["03", "Résidences actives"],
            ["120+", "Appartements"],
            ["100%", "Haut standing"],
          ].map(([number, label]) => (
            <div key={label}>
              <div className="font-serif text-7xl font-light text-[#c4956a]">
                {number}
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/50">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-28 lg:px-12 text-center">
        <p className="mb-5 text-xs uppercase tracking-[0.35em] text-[#c4956a]">
          El Rayane Immobilier
        </p>

        <h2 className="font-serif text-5xl font-light leading-tight lg:text-8xl">
          Trouvez votre
          <br />
          futur appartement
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-sm leading-9 text-[#6b5c4e]">
          Nous vous accompagnons dans l’acquisition d’un appartement
          haut standing dans les meilleures résidences d’Alger.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <button className="bg-[#c4956a] px-10 py-5 text-xs uppercase tracking-[0.3em] text-white transition hover:bg-[#8b5e3c]">
            Prendre contact
          </button>

          <button className="border border-[#1a1410] px-10 py-5 text-xs uppercase tracking-[0.3em] transition hover:border-[#c4956a] hover:text-[#c4956a]">
            Voir les projets
          </button>
        </div>
      </section>
        </main>
    </PageTransition > </>
  );
}