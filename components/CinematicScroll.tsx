"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Hero from "./Hero";
import FeaturedProperties from "./FeaturedProperties";
import InteriorSlider from "./InteriorSlider";
import About from "./About";

gsap.registerPlugin(ScrollTrigger);

function MobileLayout() {
  return (
    <div className="flex flex-col w-full bg-black">
      <section className="w-full"><Hero /></section>
      <section className="w-full"><FeaturedProperties /></section>
      <section className="w-full"><InteriorSlider /></section>
      <section className="w-full"><About /></section>
    </div>
  );
}

function DesktopLayout() {
  const pinWrap = useRef<HTMLDivElement>(null);
  const sec2    = useRef<HTMLDivElement>(null);
  const sec3    = useRef<HTMLDivElement>(null);
  const sec4    = useRef<HTMLDivElement>(null);
  const sec5    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Pause Lenis while this component is alive so it doesn't fight ST pinning
    // We dispatch a custom event that SmoothScroll listens to
    window.dispatchEvent(new CustomEvent("lenis:pause"));

    gsap.set(sec2.current, { yPercent: 100 });
    gsap.set(sec3.current, { xPercent: -100 });
    gsap.set(sec4.current, { xPercent: 100 });
    gsap.set(sec5.current, { yPercent: 100 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinWrap.current,
        start: "top top",
        end: "+=400%",
        scrub: true,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    tl.to(sec2.current, { yPercent: 0, ease: "none", duration: 1 });
    tl.to(sec3.current, { xPercent: 0, ease: "none", duration: 1 });
    tl.to(sec4.current, { xPercent: 0, ease: "none", duration: 1 });
    tl.to(sec5.current, { yPercent: 0, ease: "none", duration: 1 });

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      window.dispatchEvent(new CustomEvent("lenis:resume"));
    };
  }, []);

  return (
    <div
      ref={pinWrap}
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
        <Hero />
      </div>

      <div ref={sec2} style={{ position: "absolute", inset: 0, zIndex: 20, background: "#000",  }}>
        <FeaturedProperties />
      </div>

      <div ref={sec3} style={{ position: "absolute", inset: 0, zIndex: 30, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* sec3 content */}
      </div>

      <div ref={sec4} style={{ position: "absolute", inset: 0, zIndex: 40, background: "#000" }}>
        <InteriorSlider />
      </div>

      <div ref={sec5} style={{ position: "absolute", inset: 0, zIndex: 50, background: "#000", overflowY: "auto" }}>
        <About />
      </div>
    </div>
  );
}

export default function CinematicScroll() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (isMobile === null) return null;
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}