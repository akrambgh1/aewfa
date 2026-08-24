import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a1410] px-6 py-20 text-white lg:px-12">
      <div className="grid gap-12 border-b border-[#c4956a33] pb-14 lg:grid-cols-4">

        {/* BRAND */}
        <div>
          <div className="font-serif text-4xl font-light">
            Immobilier
          </div>

          <p className="mt-6 max-w-xs text-sm leading-8 text-white/40">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* PROPERTIES */}
        <div>
          <h4 className="mb-6 text-[11px] uppercase tracking-[0.3em] text-[#c4956a]">
            Propriétés
          </h4>

          <ul className="space-y-4">
            <li>
              <Link
                href="/projets"
                className="text-sm text-white/45 transition hover:text-[#c4956a]"
              >
                Appartements
              </Link>
            </li>

            <li>
              <Link
                href="/projets"
                className="text-sm text-white/45 transition hover:text-[#c4956a]"
              >
                Résidences
              </Link>
            </li>

            <li>
              <Link
                href="/projets"
                className="text-sm text-white/45 transition hover:text-[#c4956a]"
              >
                Programmes neufs
              </Link>
            </li>
          </ul>
        </div>

        {/* LOCATIONS (ONLY ALGER + AREAS LOREM) */}
        <div>
          <h4 className="mb-6 text-[11px] uppercase tracking-[0.3em] text-[#c4956a]">
            Localités
          </h4>

          <ul className="space-y-4">
            <li className="text-sm text-white/45">
              Alger — Zone Centre
            </li>

            <li className="text-sm text-white/45">
              Alger — Quartiers Résidentiels
            </li>

            <li className="text-sm text-white/45">
              Alger — Secteurs Modernes
            </li>

            <li className="text-sm text-white/30 italic">
              Lorem ipsum area non définie
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="mb-6 text-[11px] uppercase tracking-[0.3em] text-[#c4956a]">
            Contact
          </h4>

          <ul className="space-y-4">
            <li className="text-sm text-white/45">
              +213 000 000 000
            </li>

            <li className="text-sm text-white/45">
              contact@elrayane-immo.dz
            </li>

            <li className="text-sm text-white/45">
              Alger — Lorem District
            </li>

            <li className="text-sm text-white/30 italic">
              Disponible sur rendez-vous uniquement
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="flex flex-col gap-5 pt-8 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
        <p className="text-xs tracking-wide text-white/25">
          © 2026 Immobilier — Lorem ipsum all rights reserved
        </p>

        <div className="flex justify-center gap-6 lg:justify-end">
          {["Facebook", "Instagram", "LinkedIn"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[11px] uppercase tracking-[0.25em] text-white/30 transition hover:text-[#c4956a]"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}