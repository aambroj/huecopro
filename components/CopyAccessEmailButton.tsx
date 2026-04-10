"use client";

import { useState } from "react";

type CopyAccessEmailButtonProps = {
  email: string;
};

export default function CopyAccessEmailButton({
  email,
}: CopyAccessEmailButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setError(false);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setError(true);

      window.setTimeout(() => {
        setError(false);
      }, 2200);
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto"
      >
        {copied ? "Email copiado" : "Copiar email"}
      </button>

      {error ? (
        <span className="min-w-0 text-sm font-medium text-red-700">
          No se pudo copiar automáticamente.
        </span>
      ) : null}
    </div>
  );
}