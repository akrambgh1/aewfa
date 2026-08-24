"use client";

import PageTransition from "@/components/PageTransition";
import Image from "next/image";

import koubaImage2 from "@/public/kouba2.jpeg";
import koubaImage3 from "@/public/kouba3.jpeg";
import koubaImage4 from "@/public/kouba.jpeg";

const locations = [
  {
    city: "lorem",
    areas: [
      "Lorem Area I",
      "Ipsum District",
      "Dolor Residences",
    ],
    image:
      koubaImage3 ,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    city: "Alger",
    areas: [
      "Sit Amet Zone",
      "Consectetur Heights",
      "Adipiscing Villas",
    ],
    image:
      koubaImage2,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    city: "ipsum",
    areas: [
      "Elit Quarter",
      "Sed Do Residences",
      "Eiusmod Living",
    ],
    image:
      koubaImage2,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    city: "dolor",
    areas: [
      "Tempor District",
      "Incididunt Zone",
      "Ut Labore Heights",
    ],
    image:
      koubaImage4 ,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
  },
];

export default function LocalitesPage() {
  return (
    <PageTransition>
      <main className="bg-[#f5ede0] text-[#1a1410] overflow-hidden">
        {/* HERO */}
        <section className="relative flex min-h-screen items-end">
          <div className="absolute inset-0">
            <Image
  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
  alt="Résidence moderne"
  fill
  priority
  sizes="100vw"
  className="object-cover scale-105 brightness-[0.6] contrast-110"
/>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1410]/90 via-[#1a1410]/50 to-transparent" />

          <div className="relative z-10 px-6 pb-20 lg:px-12">
            <p className="text-[#c4956a] text-xs tracking-[0.35em] uppercase mb-6">
              Zones d’intervention
            </p>

            <h1 className="font-serif text-6xl lg:text-[8rem] text-white leading-[0.9]">
              Nos
              <br />
              <span className="italic text-[#c4956a]">localités</span>
            </h1>

            <p className="mt-8 max-w-xl text-white/70 text-sm leading-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </section>

        {/* INTRO */}
        <section className="px-6 py-24 lg:px-12 border-b border-[#c4956a33]">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-[#c4956a] text-xs uppercase tracking-[0.35em] mb-4">
                Stratégie immobilière
              </p>

              <h2 className="font-serif text-5xl lg:text-7xl leading-tight">
                Une sélection
                <br />
                de zones clés.
              </h2>
            </div>

            <div className="flex items-end">
              <p className="text-[#6b5c4e] leading-9 text-sm max-w-xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Integer posuere erat a ante venenatis dapibus posuere velit
                aliquet. Maecenas faucibus mollis interdum.
              </p>
            </div>
          </div>
        </section>

        {/* LOCATIONS */}
        <section className="px-6 py-24 lg:px-12 space-y-32">
          {locations.map((loc, i) => (
            <div
              key={loc.city}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                i % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* IMAGE */}
              <div className="relative aspect-[3/4] h-[40rem] overflow-hidden">
                <Image
                  src={loc.image}
                  alt={loc.city}
                  fill
                  className=" brightness-[0.7] hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* TEXT */}
              <div>
                <p className="text-[#c4956a] text-xs uppercase tracking-[0.3em] mb-3">
                  Région
                </p>

                <h3 className="font-serif text-5xl lg:text-6xl">
                  {loc.city}
                </h3>

                <p className="mt-4 text-sm text-[#6b5c4e] leading-8">
                  {loc.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {loc.areas.map((a) => (
                    <span
                      key={a}
                      className="text-xs uppercase tracking-[0.25em] border border-[#c4956a40] px-3 py-2 text-[#6b5c4e]"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="relative min-h-[60vh] flex items-center justify-center text-center">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop"
              alt="Contact"
              fill
              className="object-cover brightness-[0.45]"
            />
          </div>

          <div className="absolute inset-0 bg-[#1a1410]/80" />

          <div className="relative z-10 px-6 max-w-3xl">
            <p className="text-[#c4956a] text-xs uppercase tracking-[0.35em] mb-5">
              El Rayane Immobilier
            </p>

            <h2 className="font-serif text-5xl lg:text-7xl text-white">
              Trouvez votre
              <br />
              localisation idéale
            </h2>

            <p className="mt-6 text-white/70 text-sm leading-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <a
              href="/contact"
              className="inline-block mt-10 bg-[#c4956a] px-8 py-4 text-xs uppercase tracking-[0.3em] text-white hover:bg-[#8b5e3c]"
            >
              Nous contacter
            </a>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}