
"use client";

import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    document.addEventListener("mousemove", move);

    let animationFrame: number;

    const loop = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${cx}px`;
        cursorRef.current.style.top = `${cy}px`;
      }

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const offsetX = cx - centerX;
      const offsetY = cy - centerY;

      const scrollY = window.scrollY;

      if (heroImageRef.current) {
        heroImageRef.current.style.transform = `translate3d(
          ${offsetX * 0.008}px,
          ${offsetY * 0.008 + scrollY * 0.025}px,
          0
        ) scale(1.06)`;
      }

      animationFrame = requestAnimationFrame(loop);
    };

    loop();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add(
                "!opacity-100",
                "!translate-y-0"
              );
            }, i * 120);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      document.removeEventListener("mousemove", move);
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, []);

  return (
    <PageTransition>
      <main className="overflow-x-hidden bg-[#f5ede0] text-[#1a1410] selection:bg-[#c4956a] selection:text-white">

        {/* GRAIN */}
        <div className="pointer-events-none fixed inset-0 z-[9998] opacity-30">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
            }}
          />
        </div>

        {/* CURSOR */}
        <div
          ref={cursorRef}
          className="pointer-events-none fixed z-[9999] hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c4956a] mix-blend-difference lg:block"
        />

        {/* NAVBAR */}
       

        {/* ====================================================== */}
        {/* HERO */}
        {/* ====================================================== */}

        <section className="relative flex h-screen items-end overflow-hidden bg-[#1a1410]">

          {/* REAL PHOTO */}
          <div
            ref={heroImageRef}
            className="absolute -inset-8 will-change-transform"
            style={{
              backgroundImage: "url('/images/hero-residence.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/35" />

          {/* WARM OVERLAY */}
          <div className="absolute inset-0 bg-[#1a1410]/15 mix-blend-multiply" />

          {/* TOP GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

          {/* BOTTOM GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1410] via-[#1a1410]/50 to-transparent" />

          {/* DECORATION */}
          <div className="absolute right-12 top-12 hidden h-[120px] w-[120px] rotate-45 border border-[#c4956a66] animate-[spin_20s_linear_infinite] lg:block">
            <div className="absolute inset-5 border border-[#c4956a33]" />
          </div>

          {/* HERO CONTENT */}
          <div className="relative z-10 w-full px-6 pb-14 lg:px-12">

            <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-[#c4956a]">
              <span className="h-px w-8 bg-[#c4956a]" />
              Promotion immobilière haut standing — Alger
            </div>

            <h1 className="font-serif text-[4rem] leading-[0.9] text-white md:text-[6rem] lg:text-[9rem]">
              Des
              <br />
              <em className="italic text-[#c4956a]">
                résidences
              </em>
              <br />
              modernes
            </h1>

            <div className="mt-10 flex flex-col gap-8 border-t border-white/10 pt-6 lg:flex-row lg:items-end lg:justify-between">

              <p className="max-w-md text-sm leading-8 tracking-wide text-white/70">
                El Rayane Immobilier développe des résidences élégantes et
                sécurisées au cœur d&apos;Alger.
              </p>

              <div className="flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/50">
                Défiler

                <div className="h-14 w-px animate-pulse bg-gradient-to-b from-[#c4956a] to-transparent" />
              </div>

            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* TICKER */}
        {/* ====================================================== */}

        <section className="overflow-hidden bg-[#c4956a] py-3">
          <div className="flex whitespace-nowrap animate-[ticker_22s_linear_infinite]">

            {Array(2)
              .fill([
                "Appartements Haut Standing",
                "Résidences sécurisées",
                "Emplacements privilégiés",
                "Design contemporain",
                "Qualité de vie exceptionnelle",
              ])
              .flat()
              .map((item, i) => (
                <div
                  key={i}
                  className="flex items-center text-[11px] uppercase tracking-[0.25em] text-white"
                >
                  <span className="px-8">{item}</span>
                  <span className="text-white/40">✦</span>
                </div>
              ))}

          </div>
        </section>

        {/* ====================================================== */}
        {/* STATS */}
        {/* ====================================================== */}

        <section className="grid border-b border-[#c4956a33] md:grid-cols-3">

          {[
            ["03", "Résidences"],
            ["120+", "Appartements"],
            ["100%", "Haut standing"],
          ].map(([num, label]) => (
            <div
              key={label}
              className="reveal translate-y-8 border-r border-[#c4956a33] px-8 py-12 opacity-0 transition-all duration-700 last:border-r-0"
            >
              <div className="font-serif text-6xl font-light text-[#c4956a]">
                {num}
              </div>

              <div className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[#6b5c4e]">
                {label}
              </div>
            </div>
          ))}

        </section>

        {/* ====================================================== */}
        {/* PROJECT HEADER */}
        {/* ====================================================== */}

        <section className="flex flex-col items-start justify-between gap-6 px-6 py-20 lg:flex-row lg:items-end lg:px-12">

          <div className="reveal translate-y-8 opacity-0 transition-all duration-700">

            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-[#c4956a]">
              Nos résidences
            </p>

            <h2 className="font-serif text-5xl font-light leading-tight lg:text-7xl">
              Des projets
              <br />
              <em className="italic text-[#c4956a]">
                pensés avec élégance
              </em>
            </h2>

          </div>

        </section>

        {/* ====================================================== */}
        {/* PROJECTS */}
        {/* ====================================================== */}

        <section className="px-6 pb-24 lg:px-12">

          <div className="grid gap-6">

            {/* MAIN PROJECT */}

            <div className="reveal grid translate-y-8 overflow-hidden bg-[#ede0cc] opacity-0 transition-all duration-700 lg:grid-cols-[1.1fr_1fr]">

              <div className="relative min-h-[500px] overflow-hidden bg-gradient-to-br from-[#8b5e3c] via-[#c4956a] to-[#a97a52]">

                <div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: 'url("/images/residence3.jpg")' }}
/>

                <div className="absolute left-5 top-5 bg-[#1a1410] px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-white">
                  Nouveau projet
                </div>

              </div>

              <div className="flex flex-col justify-center p-10">

                <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-[#c4956a]">
                  Alger — 
                </p>

                <h3 className="font-serif text-5xl font-light">
                  Résidence 
                </h3>

                <p className="mt-5 max-w-lg text-sm leading-8 text-[#6b5c4e]">
                  Une résidence moderne conçue pour offrir confort, sécurité
                  et raffinement dans un cadre résidentiel privilégié.
                </p>

                <div className="mt-6 flex flex-wrap gap-6 text-sm text-[#6b5c4e]">
                  <span>F2 à F5</span>
                  <span>Parking sous-sol</span>
                  <span>Résidence sécurisée</span>
                </div>

                <div className="mt-10 border-t border-[#c4956a33] pt-6">

                  <small className="block text-[10px] uppercase tracking-[0.2em] text-[#6b5c4e]">
                    Disponibilités
                  </small>

                  <div className="font-serif text-5xl font-light text-[#c4956a]">
                    Ouvertes
                  </div>

                </div>
              </div>

            </div>

            {/* SMALL PROJECT CARDS */}

            <div className="grid gap-6 lg:grid-cols-2">

              {[
                {
                  title: "Résidence 1",
                  city: "Alger — ",
                  img: "/images/diar-el-rayane.png",
                  status: "Livraison 2026",
                  from: "#1a1410",
                  to: "#3a2c1e",
                },
                {
                  title: "Résidence 2",
                  city: "Alger — ",
                  img: "/images/residence2.jpg",
                  status: "Quelques appartements disponibles",
                  from: "#6b5c4e",
                  to: "#8b5e3c",
                },
              ].map((card) => (

                <div
                  key={card.title}
                  className="reveal translate-y-8 overflow-hidden bg-white opacity-0 transition-all duration-700"
                >

                  <div
                    className="relative aspect-[4/3] overflow-hidden"
                    style={{
                      background: `url(${card.img}) center/cover no-repeat, linear-gradient(to bottom right, ${card.from}, ${card.to})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

                  <div className="p-8">

                    <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-[#c4956a]">
                      {card.city}
                    </p>

                    <h3 className="font-serif text-4xl font-light">
                      {card.title}
                    </h3>

                    <div className="mt-6 border-t border-[#c4956a33] pt-5">

                      <small className="block text-[10px] uppercase tracking-[0.2em] text-[#6b5c4e]">
                        Statut
                      </small>

                      <div className="font-serif text-2xl font-light leading-snug text-[#c4956a]">
                        {card.status}
                      </div>

                    </div>
                  </div>

                </div>

              ))}

            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* CTA */}
        {/* ====================================================== */}

        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#1a1410] text-center">

          <div className="absolute inset-0 bg-gradient-to-b from-[#241b13] via-[#1a1410] to-[#241b13]" />

          <div className="relative z-10 max-w-4xl px-6">

            <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-[#c4956a]">
              El Rayane Immobilier
            </p>

            <h2 className="font-serif text-6xl font-light leading-[0.95] text-white lg:text-8xl">
              Trouvez votre
              <br />
              <em className="italic text-[#c4956a]">
                futur appartement
              </em>
            </h2>

            <p className="mx-auto mt-8 max-w-xl text-sm leading-8 text-white/65">
              Découvrez des résidences modernes pensées pour votre confort et
              votre qualité de vie.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

              <a
                href="#"
                className="bg-[#c4956a] px-8 py-4 text-[11px] uppercase tracking-[0.25em] text-white transition hover:bg-[#8b5e3c]"
              >
                Découvrir nos projets
              </a>

              <a
                href="#"
                className="border border-white/20 px-8 py-4 text-[11px] uppercase tracking-[0.25em] text-white/70 transition hover:border-[#c4956a] hover:text-[#c4956a]"
              >
                Nous contacter
              </a>

            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* FOOTER */}
        {/* ====================================================== */}

        <footer className="border-t border-[#c4956a33] bg-[#f5ede0] px-6 py-10 lg:px-12">

          <div className="flex flex-col gap-4 text-[10px] uppercase tracking-[0.2em] text-[#6b5c4e] md:flex-row md:items-center md:justify-between">

            <span>© 2026 El Rayane Immobilier</span>

            <span>Alger, Algérie</span>

          </div>
        </footer>

        {/* ====================================================== */}
        {/* GLOBAL STYLES */}
        {/* ====================================================== */}

        <style jsx global>{`
          html {
            scroll-behavior: smooth;
          }

          body {
            cursor: none;
            font-family: "Montserrat", sans-serif;
          }

          h1,
          h2,
          h3,
          h4,
          .font-serif {
            font-family: "Cormorant Garamond", serif;
          }

          @keyframes ticker {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(-50%);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            html {
              scroll-behavior: auto;
            }
          }

          @media (max-width: 1024px) {
            body {
              cursor: auto;
            }
          }
        `}</style>

      </main>
    </PageTransition>
  );
}

