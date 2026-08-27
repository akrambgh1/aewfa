"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (!navRef.current) return;

      if (window.scrollY > 80) {
        navRef.current.classList.add(
          "bg-[#f5ede0]/90",
          "backdrop-blur-xl",
          "border-b",
          "border-[#c4956a4d]",
          "py-4"
        );
      } else {
        navRef.current.classList.remove(
          "bg-[#f5ede0]/90",
          "backdrop-blur-xl",
          "border-b",
          "border-[#c4956a4d]",
          "py-4"
        );
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className="fixed left-0 right-0 top-0 z-50 px-6 py-6 transition-all duration-300 lg:px-12"
    >
      {/* Main Navbar */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group" onClick={closeMenu}>
          <div className="font-serif text-2xl font-light tracking-wider sm:text-3xl">
            El Rayane Immobilier
          </div>

          <div className="mt-1 text-[8px] uppercase tracking-[0.3em] text-[#c4956a] sm:text-[10px] sm:tracking-[0.4em]">
            Immobilier de Luxe — Algérie
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-10 lg:flex">
          <li>
            <Link
              href="/projets"
              className="text-[11px] uppercase tracking-[0.25em] text-[#6b5c4e] transition hover:text-[#c4956a]"
            >
              Projets
            </Link>
          </li>

         

          <li>
            <Link
              href="/about"
              className="text-[11px] uppercase tracking-[0.25em] text-[#6b5c4e] transition hover:text-[#c4956a]"
            >
              Notre approche
            </Link>
          </li>

          <li>
            <Link
              href="/contact"
              className="text-[11px] uppercase tracking-[0.25em] text-[#6b5c4e] transition hover:text-[#c4956a]"
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Desktop Contact Button */}
        <Link
          href="/contact"
          className="hidden border border-[#c4956a] bg-[#c4956a] px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-white transition hover:bg-[#8b5e3c] lg:block"
        >
          Nous contacter
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-[60] flex h-11 w-11 items-center justify-center lg:hidden"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
        >
          <div className="flex w-6 flex-col gap-[6px]">
            <span
              className={`h-[1px] w-full bg-[#6b5c4e] transition-all duration-300 ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />

            <span
              className={`h-[1px] w-full bg-[#6b5c4e] transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />

            <span
              className={`h-[1px] w-full bg-[#6b5c4e] transition-all duration-300 ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
     {/* Mobile Menu */}
<div
  className={`absolute left-0 right-0 top-full overflow-hidden bg-white transition-all duration-500 ease-in-out lg:hidden ${
    menuOpen ? "max-h-[500px] opacity-100 shadow-lg" : "max-h-0 opacity-0"
  }`}
>
  <div className="border-t border-[#c4956a4d] px-6 pb-8 pt-4">
    <ul className="flex flex-col">
      <li>
        <Link
          href="/projets"
          onClick={closeMenu}
          className="block border-b border-[#c4956a26] py-4 text-[12px] uppercase tracking-[0.25em] text-[#6b5c4e] transition hover:text-[#c4956a]"
        >
          Projets
        </Link>
      </li>

      

      <li>
        <Link
          href="/about"
          onClick={closeMenu}
          className="block border-b border-[#c4956a26] py-4 text-[12px] uppercase tracking-[0.25em] text-[#6b5c4e] transition hover:text-[#c4956a]"
        >
          Notre approche
        </Link>
      </li>

      <li>
        <Link
          href="/contact"
          onClick={closeMenu}
          className="block border-b border-[#c4956a26] py-4 text-[12px] uppercase tracking-[0.25em] text-[#6b5c4e] transition hover:text-[#c4956a]"
        >
          Contact
        </Link>
      </li>
    </ul>

    <Link
      href="/contact"
      onClick={closeMenu}
      className="mt-6 block w-full border border-[#c4956a] bg-[#c4956a] px-6 py-4 text-center text-[11px] uppercase tracking-[0.2em] text-white transition hover:bg-[#8b5e3c]"
    >
      Nous contacter
    </Link>
  </div>
</div>
    </nav>
  );
}