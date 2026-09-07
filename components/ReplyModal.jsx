"use client";

import { useState, useEffect } from "react";

export default function ReplyModal({ open, onClose, message }) {
  const [draft, setDraft] = useState({ to: "", subject: "", body: "" });
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (message && open) {
      setDraft({
        to: message.email || "",
        subject: message.subject
          ? `Re: ${message.subject}`
          : "Réponse à votre demande - El Rayane Immobilier",
        body: `Bonjour ${message.name || ""},\n\nMerci de nous avoir contactés.\n\n\n-------------------\nMessage original:\n"${message.message || ""}"`,
      });
      setStatusMessage({ type: "", text: "" });
    }
  }, [message, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: draft.to,
          subject: draft.subject,
          body: draft.body,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatusMessage({ type: "success", text: "Email envoyé avec succès !" });
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setStatusMessage({ type: "error", text: data.error || "Une erreur est survenue." });
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "Impossible de se connecter au serveur." });
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#f5ede0] border border-[#c4956a66] shadow-2xl">
        <div className="flex items-center justify-between bg-[#1a1410] px-6 py-4 text-white">
          <h3 className="font-serif text-lg text-[#c4956a]">Répondre au message</h3>
          <button onClick={onClose} disabled={sending} className="text-white/70 hover:text-[#c4956a]">✕</button>
        </div>

        <form onSubmit={handleSend} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6b5c4e] mb-1">À (Destinataire)</label>
            <input
              type="email"
              required
              value={draft.to}
              onChange={(e) => setDraft({ ...draft, to: e.target.value })}
              className="w-full border-b border-[#c4956a66] bg-transparent py-2 text-sm text-[#1a1410] outline-none focus:border-[#c4956a]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6b5c4e] mb-1">Sujet</label>
            <input
              type="text"
              required
              value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              className="w-full border-b border-[#c4956a66] bg-transparent py-2 text-sm text-[#1a1410] outline-none focus:border-[#c4956a]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6b5c4e] mb-1">Brouillon de réponse</label>
            <textarea
              rows={8}
              required
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              className="w-full border border-[#c4956a33] bg-[#ede0cc]/50 p-3 text-sm text-[#1a1410] outline-none focus:border-[#c4956a] resize-none"
            />
          </div>

          {statusMessage.text && (
            <div className={`p-3 text-xs ${statusMessage.type === "success" ? "bg-green-500/10 text-green-800 border-l-2 border-green-500" : "bg-red-500/10 text-red-800 border-l-2 border-red-500"}`}>
              {statusMessage.text}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-[#c4956a33]">
            <button type="button" onClick={onClose} disabled={sending} className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#6b5c4e]">Annuler</button>
            <button type="submit" disabled={sending} className="bg-[#1a1410] px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-white hover:bg-[#c4956a] transition disabled:opacity-50">
              {sending ? "Envoi en cours..." : "Envoyer l'e-mail"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}