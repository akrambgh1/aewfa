"use client";

import { useEffect, useRef, useState } from "react";
import { STATUSES, getStatus } from "@/lib/dashboard/statuses";

export default function StatusStamp({
  value,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = getStatus(value);

  useEffect(() => {
    function handleClick(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleKey(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClick
    );

    document.addEventListener(
      "keydown",
      handleKey
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClick
      );

      document.removeEventListener(
        "keydown",
        handleKey
      );
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative z-[60]"
    >

      {/* BOUTON STATUT */}

      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`group relative z-[61] flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-[#1a1410] transition-all ${current.border} ${current.bg} ${current.text} hover:brightness-95`}
      >

        <span
          className={`h-1.5 w-1.5 rounded-full ${current.dot}`}
        />

        {current.code}

        <svg
          className={`h-3 w-3 opacity-60 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2.5 4.5 6 8l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

      </button>

      {/* MENU DÉROULANT */}

      {open && (
        <div className="absolute bottom-full right-0 z-[9999] mb-2 w-56 overflow-hidden rounded-lg border border-[#c4956a55] bg-[#f5ede0] shadow-2xl">

          <div className="border-b border-[#c4956a33] bg-[#ede0cc] px-3 py-2">

            <span className="text-[9px] uppercase tracking-[0.2em] text-[#6b5c4e]">
              Statut du projet
            </span>

          </div>

          <ul
            role="listbox"
            aria-label="Statut du projet"
            className="py-1"
          >

            {STATUSES.map((status) => (
              <li key={status.id}>

                <button
                  type="button"
                  role="option"
                  aria-selected={
                    status.id === value
                  }
                  onClick={() => {
                    onChange(status.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#ede0cc] ${
                    status.id === value
                      ? "bg-[#ede0cc]"
                      : ""
                  }`}
                >

                  {/* POINT */}

                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${status.dot}`}
                  />

                  {/* NOM */}

                  <span className="flex-1 text-sm text-[#1a1410]">
                    {status.label}
                  </span>

                  {/* CODE */}

                  <span
                    className={`font-mono text-[9px] ${
                      status.id === value
                        ? "text-[#c4956a]"
                        : "text-[#6b5c4e]"
                    }`}
                  >
                    {status.code}
                  </span>

                  {/* VALIDATION */}

                  {status.id === value && (
                    <svg
                      viewBox="0 0 16 16"
                      className="h-3.5 w-3.5 text-[#c4956a]"
                      fill="none"
                    >
                      <path
                        d="M3 8.5 6.5 12 13 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}

                </button>

              </li>
            ))}

          </ul>
        </div>
      )}

    </div>
  );
}