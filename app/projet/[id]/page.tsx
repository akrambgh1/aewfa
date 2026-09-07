"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/dashboard/firebase"; // Adjust path to match your firebase export

interface ProjectImage {
  fileId?: string;
  filePath?: string;
  name?: string;
  thumbnailUrl?: string;
  url?: string;
}

interface Project {
  id: string;
  name?: string;
  location?: string;
  type?: string;
  description?: string;
  apartments?: number | string;
  status?: string;
  latitude?: number | string;
  longitude?: number | string;
  mapEmbedUrl?: string;
  features?: string[];
  images?: ProjectImage[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    if (!projectId) return;

    const docRef = doc(db, "projects", projectId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        } else {
          setProject(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching project:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [projectId]);

  const images =
    project?.images
      ?.map((img) => img.url || img.thumbnailUrl)
      .filter((url): url is string => Boolean(url)) || [];

  const nextSlide = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getMapEmbedUrl = (): string | null => {
    const lat =
      project?.latitude !== undefined && project?.latitude !== null
        ? Number(project.latitude)
        : null;
    const lng =
      project?.longitude !== undefined && project?.longitude !== null
        ? Number(project.longitude)
        : null;

    if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
      return `https://maps.google.com/maps?q=${lat},${lng}&hl=fr&z=15&output=embed`;
    }

    if (project?.location && project.location.trim() !== "") {
      return `https://maps.google.com/maps?q=${encodeURIComponent(
        project.location
      )}&hl=fr&z=14&output=embed`;
    }

    return project?.mapEmbedUrl || null;
  };

  const dynamicMapUrl = getMapEmbedUrl();

  if (loading) {
    return (
      <main className="flex h-screen items-center justify-center bg-[#f5ede0] text-[#c4956a]">
        <p className="text-xs uppercase tracking-[0.35em]">
          Chargement du projet...
        </p>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex h-screen flex-col items-center justify-center bg-[#f5ede0] text-[#1a1410]">
        <h1 className="font-serif text-4xl font-light">Projet introuvable</h1>
        <Link
          href="/projets"
          className="mt-6 border border-[#c4956a] px-6 py-3 text-xs uppercase tracking-[0.25em] text-[#c4956a]"
        >
          Retour aux projets
        </Link>
      </main>
    );
  }

  return (
    <PageTransition>
      <main className="overflow-x-hidden bg-[#f5ede0] text-[#1a1410]">
        {/* HERO SLIDER */}
        <section className="relative h-screen w-full overflow-hidden bg-[#1a1410]">
          {images.length > 0 ? (
            images.map((src, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentImageIndex ? "z-10 opacity-100" : "z-0 opacity-0"
                }`}
              >
                <Image
                  src={src}
                  alt={`${project.name || "Projet"} - Slide ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  className="object-cover brightness-[0.55]"
                />
              </div>
            ))
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-widest text-white/40">
              Aucune image disponible
            </div>
          )}

          <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#1a1410] via-transparent to-black/30" />

          {/* FLOATING HEADER INFO */}
          <div className="absolute bottom-12 left-6 right-6 z-30 flex flex-col justify-between gap-8 md:flex-row md:items-end lg:left-12 lg:right-12">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#c4956a]">
                {project.type || "Résidence Haut Standing"} — {project.location || "Alger"}
              </p>

              <h1 className="font-serif text-5xl font-light text-white md:text-7xl lg:text-8xl">
                {project.name || "Résidence"}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="border border-[#c4956a]/40 bg-[#1a1410]/80 px-6 py-4 text-center backdrop-blur-md">
                <span className="block font-serif text-3xl font-light text-[#c4956a]">
                  {project.apartments ?? "N/A"}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/70">
                  Appartements
                </span>
              </div>

              <div className="border border-white/20 bg-[#1a1410]/80 px-6 py-4 text-center backdrop-blur-md">
                <span className="block font-serif text-3xl font-light text-white capitalize">
                  {project.status === "sold" ? "Vendu" : project.status || "Disponible"}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/70">
                  Statut
                </span>
              </div>
            </div>
          </div>

          {/* SLIDER BUTTONS */}
          {images.length > 1 && (
            <>
              <div className="absolute right-6 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-4 lg:right-12">
                <button
                  onClick={prevSlide}
                  className="flex h-12 w-12 items-center justify-center border border-white/30 text-white backdrop-blur-md transition hover:border-[#c4956a] hover:bg-[#c4956a]"
                  aria-label="Previous Slide"
                >
                  ↑
                </button>
                <button
                  onClick={nextSlide}
                  className="flex h-12 w-12 items-center justify-center border border-white/30 text-white backdrop-blur-md transition hover:border-[#c4956a] hover:bg-[#c4956a]"
                  aria-label="Next Slide"
                >
                  ↓
                </button>
              </div>

              <div className="absolute left-6 top-12 z-30 text-xs tracking-widest text-white/60 lg:left-12">
                0{currentImageIndex + 1} / 0{images.length}
              </div>
            </>
          )}
        </section>

        {/* DESCRIPTION & FEATURES */}
        <section className="border-b border-[#c4956a20] px-6 py-24 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#c4956a]">
                A propos du projet
              </p>
              <h2 className="font-serif text-4xl font-light leading-tight lg:text-6xl">
                Un cadre de vie d&apos;exception
              </h2>
            </div>

            <div>
              <p className="text-sm leading-9 text-[#6b5c4e]">
                {project.description && project.description.trim() !== ""
                  ? project.description
                  : `La résidence ${project.name} offre un cadre résidentiel moderne situé à ${project.location}. Un projet pensé pour l'élégance, le confort et la sécurité.`}
              </p>

              {project.features && project.features.length > 0 && (
                <div className="mt-10 border-t border-[#c4956a33] pt-8">
                  <h3 className="mb-4 text-xs uppercase tracking-[0.25em] text-[#c4956a]">
                    Prestations & Equipements
                  </h3>
                  <ul className="grid grid-cols-2 gap-4 text-sm text-[#6b5c4e]">
                    {project.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-[#c4956a]">✦</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* MAP SECTION */}
        <section className="px-6 py-24 lg:px-12">
          <div className="mb-12">
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#c4956a]">
              Localisation
            </p>
            <h2 className="font-serif text-4xl font-light lg:text-6xl capitalize">
              {project.location || "Alger"}
            </h2>
          </div>

          <div className="relative h-[10rem] w-full overflow-hidden border border-[#c4956a44] bg-[#ede0cc]">
            {dynamicMapUrl ? (
              <iframe
                src={dynamicMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="brightness-95 contrast-105 filter"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.25em] text-[#6b5c4e]">
                Carte non disponible pour ce projet
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#1a1410] px-6 py-28 text-center text-white lg:px-12">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#c4956a]">
            {project.name}
          </p>
          <h2 className="font-serif text-5xl font-light leading-tight lg:text-7xl">
            Intéressé par cet appartement ?
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="bg-[#c4956a] px-10 py-5 text-xs uppercase tracking-[0.3em] text-white transition hover:bg-[#8b5e3c]"
            >
              Réserver une visite
            </Link>
            <Link
              href="/projets"
              className="border border-white/20 px-10 py-5 text-xs uppercase tracking-[0.3em] text-white transition hover:border-[#c4956a] hover:text-[#c4956a]"
            >
              Voir d&apos;autres projets
            </Link>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}