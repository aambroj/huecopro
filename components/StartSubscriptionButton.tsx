"use client";

import { useState } from "react";

export default function StartSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
      });

      const result = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !result.url) {
        throw new Error(result.error || "No se pudo abrir el pago.");
      }

      window.location.href = result.url;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo abrir el pago.";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Abriendo pago..." : "Activar suscripción"}
      </button>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
          {error}
        </div>
      ) : null}
    </div>
  );
}
