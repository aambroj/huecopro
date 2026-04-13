"use client";

import { useState } from "react";

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
      });

      const result = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !result.url) {
        throw new Error(result.error || "No se pudo abrir la facturación.");
      }

      window.location.href = result.url;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo abrir la facturación.";
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
        className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-slate-300/90 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Abriendo..." : "Gestionar facturación"}
      </button>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
          {error}
        </div>
      ) : null}
    </div>
  );
}
