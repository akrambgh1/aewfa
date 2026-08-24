"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const images = [
  // 🛋 Living Room (hero space)
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",

  // 🪟 Modern living / sunlight interior
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",

  // 🍽 Luxury kitchen
  "https://images.unsplash.com/photo-1556911220-bff31c812dba",

  // 🛏 Bedroom (minimal luxury)
  "https://images.unsplash.com/photo-1505693314120-0d443867891c",

  // 🚿 Bathroom spa style
  "https://images.unsplash.com/photo-1507652313519-d4e9174996dd",

  // 🌇 Balcony / city view
  "https://images.unsplash.com/photo-1460317442991-0ec209397118",

  // 🌙 Night luxury apartment view
  "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6"
];

export default function InteriorSlider() {
  const track = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    gsap.to(track.current, {
      x: `-${index * 100}%`,
      duration: 1,
      ease: "power3.inOut"
    });
  }, [index]);

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">

      {/* VIEWPORT FRAME */}
      <div className="relative w-[75%] h-[80%] overflow-hidden rounded-2xl shadow-2xl">

        {/* TRACK */}
        <div
          ref={track}
          className="flex w-full h-full"
          
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="w-full h-full flex-shrink-0"
            >
              <img
                src={img}
                className="w-full h-full "
              />
            </div>
          ))}
        </div>

        {/* LEFT BUTTON */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2
                     bg-black/40 hover:bg-black/70
                     text-white w-10 h-10 rounded-full
                     flex items-center justify-center backdrop-blur-md"
        >
          ‹
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2
                     bg-black/40 hover:bg-black/70
                     text-white w-10 h-10 rounded-full
                     flex items-center justify-center backdrop-blur-md"
        >
          ›
        </button>

        {/* DOTS */}
        <div className="absolute bottom-4 w-full flex justify-center gap-2 bg-cover">
          {images.map((_, i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full cursor-pointer transition ${
                i === index ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}