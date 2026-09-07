
"use client";

import { useState } from "react";
import { useDashboardAuth } from "@/context/dashboard/AuthContext";

export default function AuthGuard({ children }) {
  const { user, loading } = useDashboardAuth();

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5ede0]">
        {/* Grain */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="relative z-10 text-center">
          <div className="mx-auto mb-4 h-px w-8 bg-[#c4956a]" />

          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#6b5c4e]">
            El Rayane Immobilier
          </span>

          <p className="mt-3 font-serif text-2xl font-light text-[#1a1410]">
            Vérification de l&apos;accès…
          </p>

          <div className="mx-auto mt-5 h-1 w-24 overflow-hidden bg-[#c4956a33]">
            <div className="h-full w-1/2 animate-pulse bg-[#c4956a]" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return children;
}

function LoginForm() {
  const { login } = useDashboardAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

 


async function handleSubmit(e) {
  e.preventDefault();

  setError("");

  if (!email.trim()) {
    setError("Veuillez saisir votre adresse e-mail.");
    return;
  }

  if (!password) {
    setError("Veuillez saisir votre mot de passe.");
    return;
  }

  setSubmitting(true);

  try {
    await login(email, password);
  } catch (error) {
    // Intentionally do not console.error().
    setError(
      error?.message ||
        "Adresse e-mail ou mot de passe incorrect."
    );
  } finally {
    setSubmitting(false);
  }
}



  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5ede0] px-6 py-12">
      {/* ===================================================== */}
      {/* BACKGROUND */}
      {/* ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Soft background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5ede0] via-[#f1e5d5] to-[#e8d8c3]" />

        {/* Decorative circle */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-[#c4956a33]" />

        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-[#c4956a22]" />

        {/* Decorative square */}
        <div className="absolute bottom-[-80px] left-[-80px] h-64 w-64 rotate-45 border border-[#c4956a33]" />

        <div className="absolute bottom-[-50px] left-[-50px] h-44 w-44 rotate-45 border border-[#c4956a22]" />

        {/* Grain */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
            }}
          />
        </div>
      </div>

      {/* ===================================================== */}
      {/* LOGIN CARD */}
      {/* ===================================================== */}

      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden border border-[#c4956a55] bg-[#f5ede0] shadow-2xl"
        >
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="relative overflow-hidden bg-[#1a1410] px-7 py-8 text-white sm:px-9">
            {/* Decoration */}
            <div className="absolute right-[-20px] top-[-30px] h-32 w-32 rotate-45 border border-[#c4956a44]">
              <div className="absolute inset-5 border border-[#c4956a22]" />
            </div>

            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-[#c4956a]" />

                <span className="text-[10px] uppercase tracking-[0.3em] text-[#c4956a]">
                  El Rayane Immobilier
                </span>
              </div>

              <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
                Espace privé
              </p>

              <h1 className="font-serif text-5xl font-light leading-[0.9]">
                Bienvenue
                <br />
                <em className="italic text-[#c4956a]">
                  dans votre espace
                </em>
              </h1>

              <p className="mt-5 max-w-xs text-xs leading-6 text-white/50">
                Connectez-vous pour gérer vos projets immobiliers.
              </p>
            </div>
          </div>

          {/* ================================================= */}
          {/* FORM */}
          {/* ================================================= */}

          <div className="px-7 py-8 sm:px-9">
            {/* EMAIL */}

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-[#6b5c4e]">
                Adresse e-mail
              </span>

              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                disabled={submitting}
                className="w-full border-b border-[#c4956a66] bg-transparent px-0 py-3 text-sm text-[#1a1410] outline-none transition placeholder:text-[#6b5c4e]/40 focus:border-[#c4956a] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </label>

            {/* PASSWORD */}

            <label className="mt-7 block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-[#6b5c4e]">
                Mot de passe
              </span>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={submitting}
                className="w-full border-b border-[#c4956a66] bg-transparent px-0 py-3 text-sm tracking-widest text-[#1a1410] outline-none transition placeholder:text-[#6b5c4e]/40 focus:border-[#c4956a] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </label>

            {/* ERROR */}

            {error && (
              <div className="mt-5 border-l-2 border-[#8f3f32] bg-[#8f3f32]/5 px-4 py-3">
                <p className="text-xs leading-relaxed text-[#8f3f32]">
                  {error}
                </p>
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 flex w-full items-center justify-center gap-3 bg-[#1a1410] py-4 text-[10px] uppercase tracking-[0.3em] text-white transition hover:bg-[#c4956a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
                  Connexion…
                </>
              ) : (
                <>
                  <span>Se connecter</span>

                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4"
                    fill="none"
                  >
                    <path
                      d="M4 10h11M11 6l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>

            {/* FOOTER */}

            <div className="mt-7 border-t border-[#c4956a33] pt-5 text-center">
              <p className="text-[10px] uppercase tracking-[0.18em] leading-5 text-[#6b5c4e]">
                Accès privé uniquement
              </p>

              <p className="mt-1 text-[10px] leading-5 text-[#6b5c4e]/60">
                Les comptes sont créés via la console Firebase.
              </p>
            </div>
          </div>
        </form>

        {/* BRAND FOOTER */}

        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="h-px w-6 bg-[#c4956a55]" />

          <span className="text-[9px] uppercase tracking-[0.3em] text-[#6b5c4e]">
            Alger · Immobilier haut standing
          </span>

          <span className="h-px w-6 bg-[#c4956a55]" />
        </div>
      </div>
    </main>
  );
}