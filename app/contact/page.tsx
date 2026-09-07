
"use client";

import Image from "next/image";
import { useState } from "react";
import type {
  ChangeEvent,
  FormEvent,
} from "react";

import PageTransition from "@/components/PageTransition";
import { addContactMessage } from "@/lib/contact";

type ContactForm = {
  name: string;
  email: string;
  message: string;
};

type ContactField = keyof ContactForm;

export default function ContactPage() {
  const [form, setForm] =
    useState<ContactForm>({
      name: "",
      email: "",
      message: "",
    });

  const [sending, setSending] =
    useState<boolean>(false);

  const [success, setSuccess] =
    useState<string>("");

  const [error, setError] =
    useState<string>("");

  function updateField(
    field: ContactField,
    value: string
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (!form.name.trim()) {
      setError("Veuillez entrer votre nom.");
      return;
    }

    if (!form.email.trim()) {
      setError(
        "Veuillez entrer votre adresse e-mail."
      );
      return;
    }

    if (!form.message.trim()) {
      setError(
        "Veuillez écrire votre message."
      );
      return;
    }

    try {
      setSending(true);

      await addContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });

      setForm({
        name: "",
        email: "",
        message: "",
      });

      setSuccess(
        "Votre message a bien été envoyé. Notre équipe vous répondra rapidement."
      );
    } catch (err: unknown) {
      console.error(
        "Contact form error:",
        err
      );

      setError(
        "Impossible d'envoyer votre message. Veuillez réessayer."
      );
    } finally {
      setSending(false);
    }
  }

  function handleNameChange(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    updateField(
      "name",
      event.target.value
    );
  }

  function handleEmailChange(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    updateField(
      "email",
      event.target.value
    );
  }

  function handleMessageChange(
    event: ChangeEvent<HTMLTextAreaElement>
  ): void {
    updateField(
      "message",
      event.target.value
    );
  }

  return (
    <PageTransition>
      <main className="flex min-h-screen flex-col bg-[#f5ede0] lg:flex-row">

        {/* LEFT SIDE - FORM */}

        <div className="flex flex-1 items-center justify-center px-6 py-24 lg:px-16">
          <div className="w-full max-w-xl">

            <p className="text-xs uppercase tracking-[0.35em] text-[#c4956a]">
              Contact
            </p>

            <h1 className="mt-4 font-serif text-5xl leading-tight text-[#1a1410] lg:text-7xl">
              Parlons de votre
              <br />
              futur appartement
            </h1>

            <p className="mt-6 text-sm leading-8 text-[#6b5c4e]">
              Notre équipe El Rayane Immobilier vous répond rapidement
              pour vous accompagner dans votre projet.
            </p>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-12 space-y-5"
            >

              <input
                type="text"
                placeholder="Nom complet"
                value={form.name}
                onChange={handleNameChange}
                disabled={sending}
                className="w-full border border-[#c4956a30] bg-white/40 px-5 py-4 text-[#1a1410] placeholder:text-[#6b5c4e] backdrop-blur focus:border-[#c4956a] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleEmailChange}
                disabled={sending}
                className="w-full border border-[#c4956a30] bg-white/40 px-5 py-4 text-[#1a1410] placeholder:text-[#6b5c4e] backdrop-blur focus:border-[#c4956a] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />

              <textarea
                placeholder="Votre message"
                value={form.message}
                onChange={handleMessageChange}
                disabled={sending}
                className="h-40 w-full resize-none border border-[#c4956a30] bg-white/40 px-5 py-4 text-[#1a1410] placeholder:text-[#6b5c4e] backdrop-blur focus:border-[#c4956a] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />

              {/* ERROR */}

              {error && (
                <div className="border-l-2 border-red-600 bg-red-500/5 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {success && (
                <div className="border-l-2 border-[#7a8b68] bg-[#7a8b68]/10 px-4 py-3 text-sm text-[#536143]">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="flex w-full items-center justify-center gap-3 bg-[#c4956a] py-4 text-xs uppercase tracking-[0.25em] text-white transition hover:bg-[#8b5e3c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer le message"
                )}
              </button>

            </form>

          </div>
        </div>

        {/* RIGHT SIDE - IMAGE */}

        <div className="relative hidden flex-1 lg:block">

          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=90"
            alt="Appartement de luxe"
            fill
            className="object-cover brightness-[0.65]"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1410]/80 via-[#1a1410]/40 to-[#1a1410]/20" />

          <div className="absolute bottom-16 left-12 max-w-md text-white">

            <p className="text-xs uppercase tracking-[0.35em] text-[#c4956a]">
              El Rayane Immobilier
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight">
              Des appartements
              <br />
              d’exception à Alger
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/70">
              Un accompagnement personnalisé pour votre projet immobilier.
            </p>

          </div>

        </div>

      </main>
    </PageTransition>
  );
}

