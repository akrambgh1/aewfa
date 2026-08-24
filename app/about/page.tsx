"use client";

import PageTransition from "@/components/PageTransition";
import Image from "next/image";

export default function ApprochePage() {
  return (
    <PageTransition>
      <main className="bg-[#f5ede0] text-[#1a1410]">

        {/* HERO */}
        <section className="relative flex min-h-[90vh] items-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2000&auto=format&fit=crop"
            alt="Architecture moderne"
            fill
            className="object-cover brightness-[0.55]"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1410]/90 via-[#1a1410]/60 to-transparent" />

          <div className="relative z-10 px-6 lg:px-12 max-w-4xl">
            <p className="mb-6 text-[11px] uppercase tracking-[0.35em] text-[#c4956a]">
              El Rayane Immobilier
            </p>

            <h1 className="font-serif text-6xl leading-[0.95] text-white lg:text-[7rem]">
              Notre
              <br />
              <em className="italic text-[#c4956a]">approche</em>
            </h1>

            <p className="mt-10 max-w-xl text-sm leading-8 text-white/70">
              Nous concevons des résidences haut standing basées sur la
              qualité, la durabilité et le confort de vie.
            </p>
          </div>
        </section>

        {/* PRINCIPLES */}
        <section className="px-6 py-28 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-3">

            {[
              {
                title: "Qualité architecturale",
                text:
                  "Chaque projet est pensé avec des architectes expérimentés pour garantir élégance et durabilité.",
              },
              {
                title: "Emplacements stratégiques",
                text:
                  "Nous sélectionnons uniquement les quartiers les plus demandés d’Alger pour maximiser la valeur.",
              },
              {
                title: "Confort moderne",
                text:
                  "Nos résidences intègrent des espaces optimisés, lumineux et adaptés au mode de vie actuel.",
              },
            ].map((item) => (
              <div key={item.title}>
                <div className="h-px w-12 bg-[#c4956a] mb-6" />

                <h3 className="font-serif text-3xl mb-4">
                  {item.title}
                </h3>

                <p className="text-sm leading-8 text-[#6b5c4e]">
                  {item.text}
                </p>
              </div>
            ))}

          </div>
        </section>

        {/* IMAGE SPLIT */}
        <section className="grid lg:grid-cols-2">
          <div className="relative min-h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop"
              alt="Construction"
              fill
              className="object-cover brightness-[0.7]"
            />
          </div>

          <div className="flex items-center p-10 lg:p-20">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#c4956a] mb-4">
                Vision
              </p>

              <h2 className="font-serif text-5xl leading-tight mb-6">
                Construire des lieux de vie,
                <br />
                pas seulement des bâtiments.
              </h2>

              <p className="text-sm leading-8 text-[#6b5c4e]">
                Notre objectif est de créer des espaces où les familles
                peuvent s’épanouir durablement, avec un haut niveau de
                finition et une identité architecturale forte.
              </p>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="px-6 py-28 lg:px-12">
          <div className="mb-16">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#c4956a] mb-4">
              Processus
            </p>

            <h2 className="font-serif text-5xl lg:text-7xl">
              De l’idée à la livraison
            </h2>
          </div>

          <div className="grid gap-10 lg:grid-cols-4">

            {[
              ["01", "Sélection du terrain"],
              ["02", "Conception architecturale"],
              ["03", "Construction haut standing"],
              ["04", "Livraison & suivi"],
            ].map(([num, title]) => (
              <div key={title}>
                <div className="font-serif text-6xl text-[#c4956a]">
                  {num}
                </div>
                <div className="mt-3 text-sm uppercase tracking-[0.25em]">
                  {title}
                </div>
              </div>
            ))}

          </div>
        </section>

        {/* CTA */}
        <section className="relative min-h-[60vh] flex items-center justify-center text-center px-6">
          <Image
            src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2000&auto=format&fit=crop"
            alt="Luxury building"
            fill
            className="object-cover brightness-[0.45]"
          />

          <div className="absolute inset-0 bg-[#1a1410]/75" />

          <div className="relative z-10 max-w-3xl">
            <h2 className="font-serif text-6xl text-white">
              Construisons ensemble
              <br />
              votre futur projet
            </h2>

            <p className="mt-6 text-white/70 text-sm leading-8">
              Contactez El Rayane Immobilier pour découvrir nos résidences
              disponibles.
            </p>

            <button className="mt-10 bg-[#c4956a] px-10 py-4 text-xs uppercase tracking-[0.3em] text-white">
              Nous contacter
            </button>
          </div>
        </section>

      </main>
    </PageTransition>
  );
}