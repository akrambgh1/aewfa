"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

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

  return (
    <nav
      ref={navRef}
      className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-all duration-300 lg:px-12"
    >
      <Link href="/" className="group">
        <div className="font-serif text-3xl font-light tracking-wider">
         Immobilier
        </div>

        <div className="mt-1 text-[10px] uppercase tracking-[0.4em] text-[#c4956a]">
          Immobilier de Luxe — الجزائر
        </div>
      </Link>

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
            href="/localites"
            className="text-[11px] uppercase tracking-[0.25em] text-[#6b5c4e] transition hover:text-[#c4956a]"
          >
            Localités
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

      <Link
        href="/contact"
        className="border border-[#c4956a] bg-[#c4956a] px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-white transition hover:bg-[#8b5e3c]"
      >
        Nous contacter
      </Link>
    </nav>
  );
}