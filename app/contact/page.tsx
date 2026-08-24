"use client";

import Image from "next/image";
import PageTransition from "@/components/PageTransition";

export default function ContactPage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-[#f5ede0] flex flex-col lg:flex-row">
        
        {/* LEFT SIDE - FORM */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-16 py-24">
          <div className="w-full max-w-xl">
            
            <p className="text-[#c4956a] uppercase tracking-[0.35em] text-xs">
              Contact
            </p>

            <h1 className="font-serif text-5xl lg:text-7xl mt-4 text-[#1a1410] leading-tight">
              Parlons de votre
              <br />
              futur appartement
            </h1>

            <p className="mt-6 text-[#6b5c4e] leading-8 text-sm">
              Notre équipe  Immobilier vous répond rapidement pour vous accompagner dans votre projet.
            </p>

            {/* FORM */}
            <div className="mt-12 space-y-5">
              <input
                placeholder="Nom complet"
                className="w-full border border-[#c4956a30] bg-white/40 backdrop-blur px-5 py-4 text-[#1a1410] placeholder:text-[#6b5c4e] focus:outline-none focus:border-[#c4956a]"
              />

              <input
                placeholder="Email"
                className="w-full border border-[#c4956a30] bg-white/40 backdrop-blur px-5 py-4 text-[#1a1410] placeholder:text-[#6b5c4e] focus:outline-none focus:border-[#c4956a]"
              />

              <textarea
                placeholder="Votre message"
                className="w-full border border-[#c4956a30] bg-white/40 backdrop-blur px-5 py-4 h-40 text-[#1a1410] placeholder:text-[#6b5c4e] focus:outline-none focus:border-[#c4956a]"
              />

              <button className="w-full bg-[#c4956a] text-white py-4 uppercase tracking-[0.25em] text-xs hover:bg-[#8b5e3c] transition">
                Envoyer le message
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - IMAGE */}
        <div className="flex-1 relative hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=90"
            alt="Luxury building"
            fill
            className="object-cover brightness-[0.65]"
          />

          {/* DARK OVERLAY FOR TEXT CONTRAST */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1410]/80 via-[#1a1410]/40 to-[#1a1410]/20" />

          {/* FLOATING TEXT */}
          <div className="absolute bottom-16 left-12 text-white max-w-md">
            <p className="text-xs uppercase tracking-[0.35em] text-[#c4956a]">
             Immobilier
            </p>

            <h2 className="font-serif text-4xl mt-4 leading-tight">
              Des appartements
              <br />
              d’exception à Alger
            </h2>

            <p className="mt-4 text-white/70 text-sm leading-7">
              cite • cite • cite
            </p>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}