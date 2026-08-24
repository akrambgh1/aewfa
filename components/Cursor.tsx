"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const loop = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      }

      requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move);
    loop();

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[99999] hidden lg:block"
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <div className="h-2 w-2 rounded-full bg-[#c4956a]" />
        <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c4956a]" />
      </div>
    </div>
  );
}