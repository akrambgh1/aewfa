"use client";

import {
  useEffect,
  useMemo,
  useState,
  useRef,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { STATUSES } from "@/lib/dashboard/statuses";
import { upload } from "@imagekit/next";

const LocationPicker = dynamic(
  () => import("./LocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[300px] items-center justify-center border border-[#c4956a33] bg-[#ede0cc]">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#6b5c4e]">
          Chargement de la carte...
        </span>
      </div>
    ),
  }
);

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface ProjectImage {
  url?: string;
  thumbnailUrl?: string;
  fileId?: string;
  name?: string;
  filePath?: string;
}

interface Project {
  id: string;
  name?: string;
  location?: string;
  description?: string;
  apartments?: string | number;
  status?: string;
  images?: ProjectImage[];
  latitude?: number;
  longitude?: number;
}

interface LocationCoords {
  lat: number;
  lng: number;
}

interface ProjectForm {
  name: string;
  location: string;
  description: string;
  apartments: string;
  status: string;
}

interface ProjectSubmitData {
  [key: string]: unknown;
  id?: string;
  name: string;
  location: string;
  description: string;
  apartments: number;
  status: string;
  images: ProjectImage[];
  latitude: number;
  longitude: number;
}

interface AddProjectDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectSubmitData) => Promise<void>;
  project?: Project | null;
}

/* -------------------------------------------------------------------------- */
/* Initial form                                                               */
/* -------------------------------------------------------------------------- */

const emptyForm: ProjectForm = {
  name: "",
  location: "",
  description: "",
  apartments: "",
  status: "planning",
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function AddProjectDrawer({
  open,
  onClose,
  onSubmit,
  project = null,
}: AddProjectDrawerProps) {
  const isEditing = Boolean(project);

  const [form, setForm] =
    useState<ProjectForm>(emptyForm);

  const [error, setError] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const [uploadProgress, setUploadProgress] =
    useState(0);

  const [images, setImages] =
    useState<File[]>([]);

  const [existingImages, setExistingImages] =
    useState<ProjectImage[]>([]);

  const [locationMode, setLocationMode] =
    useState("map");

  const [mapsUrl, setMapsUrl] =
    useState("");

  const [selectedLocation, setSelectedLocation] =
    useState<LocationCoords | null>(null);

  const [isGeocoding, setIsGeocoding] =
    useState(false);

  const isTypingLocationRef =
    useRef(false);

  /* ------------------------------------------------------------------------ */
  /* Load project when drawer opens                                           */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!open) return;

    if (project) {
      setForm({
        name: project.name || "",
        location: project.location || "",
        description: project.description || "",
        apartments:
          project.apartments !== undefined
            ? String(project.apartments)
            : "",
        status:
          project.status || "planning",
      });

      setExistingImages(
        Array.isArray(project.images)
          ? project.images
          : []
      );

      if (
        typeof project.latitude === "number" &&
        typeof project.longitude === "number"
      ) {
        setSelectedLocation({
          lat: project.latitude,
          lng: project.longitude,
        });
      } else {
        setSelectedLocation(null);
      }
    } else {
      setForm(emptyForm);
      setExistingImages([]);
      setSelectedLocation(null);
    }

    setMapsUrl("");
    setLocationMode("map");
    setImages([]);
    setError("");
    setUploadProgress(0);
  }, [open, project]);

  /* ------------------------------------------------------------------------ */
  /* Image previews                                                           */
  /* ------------------------------------------------------------------------ */

  const previews = useMemo(() => {
    return images.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [images]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [previews]);

  /* ------------------------------------------------------------------------ */
  /* Reverse geocoding                                                        */
  /* ------------------------------------------------------------------------ */

  const reverseGeocode = async (
    coords: LocationCoords
  ) => {
    try {
      setIsGeocoding(true);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`
      );

      if (res.ok) {
        const data = await res.json();

        const address =
          data.address?.city ||
          data.address?.town ||
          data.address?.suburb ||
          data.address?.state ||
          data.display_name?.split(",")[0] ||
          "";

        if (address) {
          setForm((prev) => ({
            ...prev,
            location: address,
          }));
        }
      }
    } catch (err) {
      console.warn(
        "Reverse geocoding failed:",
        err
      );
    } finally {
      setIsGeocoding(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Map location change                                                      */
  /* ------------------------------------------------------------------------ */

  const handleMapLocationChange = async (
    coords: LocationCoords | null
  ) => {
    setSelectedLocation(coords);

    if (!coords) return;

    if (isTypingLocationRef.current) {
      isTypingLocationRef.current = false;
      return;
    }

    await reverseGeocode(coords);
  };

  /* ------------------------------------------------------------------------ */
  /* Google Maps URL                                                           */
  /* ------------------------------------------------------------------------ */

  const handleMapsUrlChange = async (
    url: string
  ) => {
    setMapsUrl(url);
    setError("");

    if (!url.trim()) return;

    try {
      setIsGeocoding(true);

      const res = await fetch(
        "/api/resolve-map-link",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: url.trim(),
          }),
        }
      );

      const data = await res.json();

      if (
        res.ok &&
        typeof data.lat === "number" &&
        typeof data.lng === "number"
      ) {
        const coords: LocationCoords = {
          lat: data.lat,
          lng: data.lng,
        };

        setSelectedLocation(coords);

        await reverseGeocode(coords);
      } else {
        setError(
          data.error ||
            "Impossible d'extraire la position depuis ce lien."
        );
      }
    } catch (err) {
      console.error(
        "Google Maps link error:",
        err
      );

      setError(
        "Erreur lors de la lecture du lien Google Maps."
      );
    } finally {
      setIsGeocoding(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Forward geocoding                                                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      !form.location.trim() ||
      !open ||
      locationMode === "link"
    ) {
      return;
    }

    const timeoutId = setTimeout(
      async () => {
        try {
          setIsGeocoding(true);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              form.location
            )}`
          );

          if (res.ok) {
            const data = await res.json();

            if (
              data &&
              data.length > 0
            ) {
              isTypingLocationRef.current =
                true;

              setSelectedLocation({
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
              });
            }
          }
        } catch (err) {
          console.warn(
            "Forward geocoding failed:",
            err
          );
        } finally {
          setIsGeocoding(false);
        }
      },
      800
    );

    return () =>
      clearTimeout(timeoutId);
  }, [
    form.location,
    open,
    locationMode,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Form update                                                              */
  /* ------------------------------------------------------------------------ */

  function update(
    field: keyof ProjectForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /* ------------------------------------------------------------------------ */
  /* Image selection                                                          */
  /* ------------------------------------------------------------------------ */

  function handleImages(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    const imageFiles =
      selectedFiles.filter((file) =>
        file.type.startsWith("image/")
      );

    if (imageFiles.length === 0) {
      setError(
        "Veuillez sélectionner des fichiers image valides."
      );

      event.target.value = "";

      return;
    }

    const totalExisting =
      existingImages.length +
      images.length;

    const remaining = Math.max(
      0,
      10 - totalExisting
    );

    if (remaining === 0) {
      setError(
        "Vous ne pouvez pas avoir plus de 10 photos."
      );

      event.target.value = "";

      return;
    }

    setImages((current) => [
      ...current,
      ...imageFiles.slice(
        0,
        remaining
      ),
    ]);

    setError("");

    event.target.value = "";
  }

  /* ------------------------------------------------------------------------ */
  /* Remove new image                                                         */
  /* ------------------------------------------------------------------------ */

  function removeNewImage(
    index: number
  ) {
    setImages((current) =>
      current.filter(
        (_, i) => i !== index
      )
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Remove existing image                                                    */
  /* ------------------------------------------------------------------------ */

  function removeExistingImage(
    index: number
  ) {
    setExistingImages((current) =>
      current.filter(
        (_, i) => i !== index
      )
    );
  }

  /* ------------------------------------------------------------------------ */
  /* ImageKit authentication                                                  */
  /* ------------------------------------------------------------------------ */

  async function getImageKitAuth() {
    const response = await fetch(
      "/api/upload-auth"
    );

    if (!response.ok) {
      throw new Error(
        "Impossible d'authentifier l'envoi des photos."
      );
    }

    return response.json();
  }

  /* ------------------------------------------------------------------------ */
  /* Upload one image                                                         */
  /* ------------------------------------------------------------------------ */

  async function uploadImage(
    file: File,
    index: number,
    total: number
  ): Promise<ProjectImage> {
    const auth =
      await getImageKitAuth();

    const result = await upload({
      file,
      fileName: `${Date.now()}-${file.name}`,
      publicKey: auth.publicKey,
      token: auth.token,
      expire: auth.expire,
      signature: auth.signature,
      folder: "/projects",
      useUniqueFileName: true,

      onProgress: (event) => {
        if (!event.total) return;

        const currentFileProgress =
          event.loaded / event.total;

        const overallProgress =
          ((index +
            currentFileProgress) /
            total) *
          100;

        setUploadProgress(
          Math.min(
            99,
            Math.round(
              overallProgress
            )
          )
        );
      },
    });

    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name,
      filePath: result.filePath,
      thumbnailUrl:
        result.thumbnailUrl ||
        result.url,
    };
  }

  /* ------------------------------------------------------------------------ */
  /* Upload all images                                                        */
  /* ------------------------------------------------------------------------ */

  async function uploadImagesToImageKit(): Promise<
    ProjectImage[]
  > {
    if (images.length === 0) {
      return [];
    }

    const uploadedImages: ProjectImage[] =
      [];

    for (
      let index = 0;
      index < images.length;
      index++
    ) {
      const uploaded =
        await uploadImage(
          images[index],
          index,
          images.length
        );

      uploadedImages.push(uploaded);
    }

    setUploadProgress(100);

    return uploadedImages;
  }

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                   */
  /* ------------------------------------------------------------------------ */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError(
        "Veuillez saisir le nom du projet."
      );
      return;
    }

    if (!form.location.trim()) {
      setError(
        "Veuillez saisir l'emplacement du projet."
      );
      return;
    }

    if (
      !form.apartments ||
      Number(form.apartments) < 0
    ) {
      setError(
        "Veuillez saisir le nombre d'appartements."
      );
      return;
    }

    if (!selectedLocation) {
      setError(
        "Veuillez définir une position sur la carte ou via un lien."
      );
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const newImages =
        await uploadImagesToImageKit();

      const allImages = [
        ...existingImages,
        ...newImages,
      ];

      await onSubmit({
        ...(isEditing && project
          ? { id: project.id }
          : {}),

        name: form.name.trim(),

        location:
          form.location.trim(),

        description:
          form.description.trim(),

        apartments:
          Number(form.apartments) || 0,

        status: form.status,

        images: allImages,

        latitude:
          selectedLocation.lat,

        longitude:
          selectedLocation.lng,
      });

      setForm(emptyForm);
      setImages([]);
      setExistingImages([]);
      setSelectedLocation(null);
      setMapsUrl("");
      setUploadProgress(0);
      setError("");

      onClose();
    } catch (err: unknown) {
      console.error(
        "Impossible d'enregistrer le projet :",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer le projet. Veuillez réessayer."
      );
    } finally {
      setUploading(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Close                                                                    */
  /* ------------------------------------------------------------------------ */

  function handleClose() {
    if (uploading) return;

    setError("");
    onClose();
  }

  const totalImages =
    existingImages.length +
    images.length;

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-[62] bg-[#1a1410]/70 backdrop-blur-sm transition-opacity duration-300 ${
          open
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-[63] flex h-full w-full max-w-xl flex-col bg-[#f5ede0] shadow-2xl transition-transform duration-500 ${
          open
            ? "translate-x-0"
            : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}

        <div className="relative overflow-hidden bg-[#1a1410] px-6 py-8 text-white sm:px-8">
          <div className="absolute right-8 top-6 h-20 w-20 rotate-45 border border-[#c4956a44]">
            <div className="absolute inset-4 border border-[#c4956a22]" />
          </div>

          <div className="relative z-10 flex items-start justify-between gap-6">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-7 bg-[#c4956a]" />

                <span className="text-[10px] uppercase tracking-[0.3em] text-[#c4956a]">
                  El Rayane Immobilier
                </span>
              </div>

              <h2 className="font-serif text-4xl font-light leading-[0.9] sm:text-5xl">
                {isEditing ? (
                  <>
                    Modifier
                    <br />

                    <em className="italic text-[#c4956a]">
                      le projet
                    </em>
                  </>
                ) : (
                  <>
                    Ajouter
                    <br />

                    <em className="italic text-[#c4956a]">
                      un projet
                    </em>
                  </>
                )}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={uploading}
              className="relative z-20 border border-white/20 px-3 py-2 text-xs text-white/70 transition hover:border-[#c4956a] hover:text-[#c4956a] disabled:opacity-40"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-8 overflow-y-auto px-6 py-8 sm:px-8">
            {/* Name */}

            <Field label="Nom du projet">
              <input
                autoFocus
                value={form.name}
                onChange={(e) =>
                  update(
                    "name",
                    e.target.value
                  )
                }
                placeholder="Résidence El Rayane"
                className={inputClass}
                disabled={uploading}
              />
            </Field>

            {/* Description */}

            <Field
              label={
                <>
                  Description

                  <span className="ml-2 text-[#c4956a]">
                    Optionnel
                  </span>
                </>
              }
            >
              <textarea
                value={form.description}
                onChange={(e) =>
                  update(
                    "description",
                    e.target.value
                  )
                }
                placeholder="Présentez brièvement le projet, son architecture, ses prestations..."
                rows={5}
                className={`${inputClass} resize-none border border-[#c4956a33] px-3 py-3`}
                disabled={uploading}
              />
            </Field>

            {/* Location */}

            <Field
              label={
                <div className="flex items-center justify-between">
                  <span>
                    Emplacement (Nom de la ville)
                  </span>

                  {isGeocoding && (
                    <span className="text-[9px] lowercase text-[#c4956a]">
                      recherche...
                    </span>
                  )}
                </div>
              }
            >
              <input
                value={form.location}
                onChange={(e) =>
                  update(
                    "location",
                    e.target.value
                  )
                }
                placeholder="Hydra, Alger"
                className={inputClass}
                disabled={uploading}
              />
            </Field>

            {/* Geolocation */}

            <div>
              <span className="mb-3 block text-[10px] uppercase tracking-[0.25em] text-[#6b5c4e]">
                Méthode de géolocalisation
              </span>

              <div className="grid grid-cols-2 gap-2 border border-[#c4956a33] bg-[#ede0cc] p-1">
                <button
                  type="button"
                  onClick={() =>
                    setLocationMode("map")
                  }
                  className={`py-2 text-[10px] uppercase tracking-[0.2em] transition ${
                    locationMode === "map"
                      ? "bg-[#1a1410] text-white"
                      : "text-[#6b5c4e] hover:text-[#1a1410]"
                  }`}
                >
                  Carte Interactive
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setLocationMode("link")
                  }
                  className={`py-2 text-[10px] uppercase tracking-[0.2em] transition ${
                    locationMode === "link"
                      ? "bg-[#1a1410] text-white"
                      : "text-[#6b5c4e] hover:text-[#1a1410]"
                  }`}
                >
                  Lien Google Maps
                </button>
              </div>

              {locationMode === "link" && (
                <div className="mt-4 space-y-3">
                  <Field label="Coller le lien Google Maps">
                    <input
                      type="text"
                      value={mapsUrl}
                      onChange={(e) =>
                        handleMapsUrlChange(
                          e.target.value
                        )
                      }
                      placeholder="https://maps.app.goo.gl/DNzCEmvSkwRfGRyC7"
                      className={inputClass}
                      disabled={uploading}
                    />
                  </Field>
                </div>
              )}

              {/* Map */}

              <div className="mt-4">
                <p className="mb-2 text-xs text-[#6b5c4e]/70">
                  Vérifiez le point sur la carte ci-dessous avant d'enregistrer :
                </p>

                <div className="overflow-hidden border border-[#c4956a55]">
                  <LocationPicker
                    value={selectedLocation}
                    onChange={
                      handleMapLocationChange
                    }
                  />
                </div>
              </div>

              {/* Coordinates */}

              {selectedLocation && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="border border-[#c4956a33] bg-[#ede0cc] p-3">
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-[#6b5c4e]">
                      Latitude
                    </span>

                    <span className="mt-1 block font-mono text-xs font-bold text-[#1a1410]">
                      {selectedLocation.lat}
                    </span>
                  </div>

                  <div className="border border-[#c4956a33] bg-[#ede0cc] p-3">
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-[#6b5c4e]">
                      Longitude
                    </span>

                    <span className="mt-1 block font-mono text-xs font-bold text-[#1a1410]">
                      {selectedLocation.lng}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Apartments */}

            <Field label="Nombre d'appartements">
              <input
                type="number"
                min="0"
                value={form.apartments}
                onChange={(e) =>
                  update(
                    "apartments",
                    e.target.value
                  )
                }
                placeholder="24"
                className={inputClass}
                disabled={uploading}
              />
            </Field>

            {/* Status */}

            <Field label="Statut du projet">
              <select
                value={form.status}
                onChange={(e) =>
                  update(
                    "status",
                    e.target.value
                  )
                }
                className={inputClass}
                disabled={uploading}
              >
                {STATUSES.map((status) => (
                  <option
                    key={status.id}
                    value={status.id}
                  >
                    {status.label}
                  </option>
                ))}
              </select>
            </Field>

            {/* Images */}

            <div>
              <div className="mb-4">
                <span className="block text-[10px] uppercase tracking-[0.25em] text-[#6b5c4e]">
                  Photos du projet
                </span>

                <p className="mt-1 text-xs text-[#6b5c4e]/70">
                  {isEditing
                    ? "Gérez les photos existantes ou ajoutez-en de nouvelles."
                    : "Téléchargez jusqu'à 10 photos."}
                </p>
              </div>

              {/* Existing images */}

              {existingImages.length > 0 && (
                <div className="mb-5">
                  <span className="mb-3 block text-[9px] uppercase tracking-[0.2em] text-[#6b5c4e]">
                    Photos actuelles
                  </span>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {existingImages.map(
                      (
                        image,
                        index
                      ) => (
                        <div
                          key={
                            image.fileId ||
                            image.url ||
                            index
                          }
                          className="group relative aspect-square overflow-hidden border border-[#c4956a33] bg-[#ede0cc]"
                        >
                          <img
                            src={
                              image.thumbnailUrl ||
                              image.url
                            }
                            alt={`Photo actuelle ${
                              index + 1
                            }`}
                            className="h-full w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeExistingImage(
                                index
                              )
                            }
                            disabled={
                              uploading
                            }
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-[#8f3f32] text-white opacity-0 transition group-hover:opacity-100"
                          >
                            ✕
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Upload button */}

              {totalImages < 10 && (
                <label
                  className={`flex cursor-pointer flex-col items-center justify-center border border-dashed border-[#c4956a66] bg-[#ede0cc]/50 px-6 py-8 transition hover:border-[#c4956a] hover:bg-[#ede0cc] ${
                    uploading
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="mb-3 h-7 w-7 text-[#c4956a]"
                    fill="none"
                  >
                    <path
                      d="M12 16V4M7 9l5-5 5 5M5 20h14"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#1a1410]">
                    Ajouter des photos
                  </span>

                  <span className="mt-2 text-xs text-[#6b5c4e]">
                    JPG, PNG, WEBP ·{" "}
                    {totalImages}/10
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImages}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}

              {/* New image previews */}

              {previews.length > 0 && (
                <div className="mt-5">
                  <span className="mb-3 block text-[9px] uppercase tracking-[0.2em] text-[#6b5c4e]">
                    Nouvelles photos
                  </span>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {previews.map(
                      (
                        preview,
                        index
                      ) => (
                        <div
                          key={`${preview.file.name}-${index}`}
                          className="group relative aspect-square overflow-hidden border border-[#c4956a33] bg-[#ede0cc]"
                        >
                          <img
                            src={preview.url}
                            alt={`Aperçu de la photo ${
                              index + 1
                            }`}
                            className="h-full w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeNewImage(
                                index
                              )
                            }
                            disabled={
                              uploading
                            }
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-[#1a1410] text-white opacity-0 transition hover:bg-[#c4956a] group-hover:opacity-100"
                          >
                            ✕
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Upload progress */}

              {uploading &&
                images.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-[9px] uppercase tracking-[0.2em] text-[#6b5c4e]">
                      <span>
                        Téléchargement des photos
                      </span>

                      <span>
                        {uploadProgress}%
                      </span>
                    </div>

                    <div className="h-1 bg-[#c4956a33]">
                      <div
                        className="h-full bg-[#c4956a] transition-all duration-200"
                        style={{
                          width: `${uploadProgress}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
            </div>

            {/* Error */}

            {error && (
              <div className="border-l-2 border-red-500 bg-red-500/5 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}

          <div className="border-t border-[#c4956a33] bg-[#ede0cc] px-6 py-5 sm:px-8">
            <button
              type="submit"
              disabled={uploading}
              className="flex w-full items-center justify-center gap-3 bg-[#1a1410] py-4 text-[10px] uppercase tracking-[0.3em] text-white transition hover:bg-[#c4956a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />

                  Enregistrement{" "}
                  {uploadProgress}%
                </>
              ) : isEditing ? (
                "Enregistrer les modifications"
              ) : (
                "Ajouter le projet"
              )}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared styles                                                              */
/* -------------------------------------------------------------------------- */

const inputClass =
  "w-full border-b border-[#c4956a66] bg-transparent px-0 py-3 text-sm text-[#1a1410] outline-none transition placeholder:text-[#6b5c4e]/50 focus:border-[#c4956a] disabled:cursor-not-allowed disabled:opacity-50";

/* -------------------------------------------------------------------------- */
/* Field                                                                      */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-[#6b5c4e]">
        {label}
      </span>

      {children}
    </label>
  );
}