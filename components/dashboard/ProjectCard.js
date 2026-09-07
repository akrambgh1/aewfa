"use client";

import { useEffect, useState } from "react";
import StatusStamp from "./StatusStamp";

export default function ProjectCard({
  project,
  index,
  onStatusChange,
  onDelete,
  onEdit,
}) {
  const [showConfirm, setShowConfirm] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState("");

  const coverImage =
    project.images?.[0]?.url ||
    project.images?.[0]?.thumbnailUrl ||
    null;

  function openDeleteConfirmation() {
    setDeleteError("");
    setShowConfirm(true);
  }

  function closeDeleteConfirmation() {
    if (deleting) return;

    setDeleteError("");
    setShowConfirm(false);
  }

  async function confirmDelete() {
    try {
      setDeleting(true);
      setDeleteError("");

      await onDelete(project.id);

      setShowConfirm(false);
    } catch (error) {
      console.error(
        "Impossible de supprimer le projet :",
        error
      );

      setDeleteError(
        error?.message ||
          "Impossible de supprimer le projet. Veuillez réessayer."
      );
    } finally {
      setDeleting(false);
    }
  }

  /*
   * Fermer avec Échap
   */

  useEffect(() => {
    if (!showConfirm || deleting) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setShowConfirm(false);
        setDeleteError("");
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [showConfirm, deleting]);

  return (
    <>
      {/* CARD */}

      <article className="group overflow-hidden border border-[#c4956a33] bg-[#f5ede0] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* IMAGE */}

        <div className="relative aspect-[4/3] overflow-hidden bg-[#ede0cc]">
          {coverImage ? (
            <img
              src={coverImage}
              alt={project.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#6b5c4e]">
                Aucune photo
              </span>
            </div>
          )}

          {/* NUMBER */}

          <span className="absolute left-3 top-3 bg-[#1a1410]/90 px-2.5 py-1 text-[8px] uppercase tracking-[0.2em] text-white">
            N° {String(index + 1).padStart(3, "0")}
          </span>

          {/* ACTIONS */}

          <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onEdit(project)}
              aria-label={`Modifier ${project.name}`}
              className="flex h-8 items-center justify-center bg-[#f5ede0] px-3 text-[8px] uppercase tracking-[0.15em] text-[#1a1410] shadow-lg transition hover:bg-[#c4956a] hover:text-white"
            >
              Modifier
            </button>

            <button
              type="button"
              onClick={
                openDeleteConfirmation
              }
              aria-label={`Supprimer ${project.name}`}
              className="flex h-8 w-8 items-center justify-center bg-[#1a1410]/90 text-white transition hover:bg-red-600"
            >
              ✕
            </button>
          </div>

          {/* NUMBER OF PHOTOS */}

          {project.images?.length > 1 && (
            <span className="absolute bottom-3 right-3 bg-[#1a1410]/90 px-2.5 py-1 text-[8px] uppercase tracking-[0.15em] text-white">
              {project.images.length} photos
            </span>
          )}
        </div>

        {/* CONTENT */}

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-serif text-[22px] font-light leading-tight text-[#1a1410]">
                {project.name}
              </h3>

              <p className="mt-1.5 text-xs text-[#6b5c4e]">
                {project.location}
              </p>
            </div>

            {/* MOBILE EDIT */}

            <button
              type="button"
              onClick={() => onEdit(project)}
              className="shrink-0 text-[8px] uppercase tracking-[0.15em] text-[#c4956a] transition hover:text-[#1a1410] sm:hidden"
            >
              Modifier
            </button>
          </div>

          {/* DESCRIPTION */}

          {project.description && (
            <p className="mt-3 line-clamp-3 text-xs leading-5 text-[#6b5c4e]">
              {project.description}
            </p>
          )}

          <div className="my-4 h-px bg-[#c4956a33]" />

          <div className="flex items-center justify-between">
            {/* APPARTEMENTS */}

            <div>
              <span className="block text-[8px] uppercase tracking-[0.2em] text-[#6b5c4e]">
                Appartements
              </span>

              <span className="mt-1 block font-serif text-lg text-[#1a1410]">
                {project.apartments || 0}
              </span>
            </div>

            {/* STATUT */}

            <div className="text-right">
              <span className="mb-1 block text-[8px] uppercase tracking-[0.2em] text-[#6b5c4e]">
                Statut
              </span>

              <StatusStamp
                value={project.status}
                onChange={(status) =>
                  onStatusChange(
                    project.id,
                    status
                  )
                }
              />
            </div>
          </div>
        </div>
      </article>

      {/* DELETE CONFIRMATION */}

      {showConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a1410]/70 px-5 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !deleting
            ) {
              closeDeleteConfirmation();
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-project-title"
            className="w-full max-w-md overflow-hidden border border-[#c4956a55] bg-[#f5ede0] shadow-2xl"
          >
            {/* HEADER */}

            <div className="bg-[#1a1410] px-6 py-6 text-white">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-7 bg-[#c4956a]" />

                <span className="text-[9px] uppercase tracking-[0.3em] text-[#c4956a]">
                  El Rayane Immobilier
                </span>
              </div>

              <h2
                id="delete-project-title"
                className="font-serif text-3xl font-light"
              >
                Supprimer{" "}
                <em className="italic text-[#c4956a]">
                  le projet
                </em>
              </h2>
            </div>

            {/* CONTENT */}

            <div className="px-6 py-6">
              <p className="text-sm leading-relaxed text-[#1a1410]">
                Êtes-vous sûr de vouloir supprimer{" "}
                <strong>{project.name}</strong> ?
              </p>

              <p className="mt-3 text-xs leading-relaxed text-[#6b5c4e]">
                Le projet ainsi que toutes ses photos
                seront définitivement supprimés.
                Cette action est irréversible.
              </p>

              {deleteError && (
                <div className="mt-4 border-l-2 border-red-600 bg-red-500/5 px-4 py-3 text-xs leading-relaxed text-red-700">
                  {deleteError}
                </div>
              )}

              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={
                    closeDeleteConfirmation
                  }
                  disabled={deleting}
                  className="flex-1 border border-[#c4956a66] px-4 py-3 text-[10px] uppercase tracking-[0.25em] text-[#1a1410] transition hover:bg-[#ede0cc] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 bg-[#8f3f32] px-4 py-3 text-[10px] uppercase tracking-[0.25em] text-white transition hover:bg-[#733127] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
                      Suppression...
                    </>
                  ) : (
                    "Supprimer le projet"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}