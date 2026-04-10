"use client";

import { useMemo, useState } from "react";

const CONFIRM_TEXT = "ELIMINAR MI CUENTA";

export default function DeleteAccountForm() {
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfirmationValid = useMemo(() => {
    return confirmation.trim() === CONFIRM_TEXT;
  }, [confirmation]);

  async function handleDelete() {
    if (!isConfirmationValid || loading) return;

    const confirmed = window.confirm(
      "Esta acción eliminará tu cuenta, tus trabajos y las conexiones compartidas. ¿Quieres continuar?"
    );

    if (!confirmed) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cuenta/eliminar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          confirmation,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "No se pudo eliminar la cuenta.");
      }

      window.location.href = "/login";
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la cuenta.";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <section className="min-w-0 rounded-[2rem] border border-red-200 bg-red-50/95 p-4 shadow-sm sm:p-6">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
            Zona sensible
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            Eliminar mi cuenta
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-red-900 sm:text-base">
            Esta acción es irreversible. Se eliminará tu acceso, se borrarán tus
            trabajos guardados, se cortarán las agendas compartidas activas y se
            limpiarán invitaciones relacionadas con tu cuenta.
          </p>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-red-900 sm:text-base">
            La cancelación del cobro mensual todavía no está conectada aquí
            porque Stripe aún no está montado en AutonomoAgenda.
          </p>
        </div>

        <span className="inline-flex items-center self-start rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm">
          Irreversible
        </span>
      </div>

      <div className="mt-5 min-w-0 rounded-[2rem] border border-red-200 bg-white/92 p-4 shadow-sm sm:p-5">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          <span>Para confirmar, escribe exactamente:</span>
          <span className="mt-2 block font-bold sm:mt-0 sm:ml-2 sm:inline">
            {CONFIRM_TEXT}
          </span>
        </div>

        <div className="mt-4 grid min-w-0 gap-2">
          <label
            htmlFor="delete-account-confirmation"
            className="text-sm font-semibold text-slate-700"
          >
            Confirmación manual
          </label>

          <input
            id="delete-account-confirmation"
            type="text"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder={CONFIRM_TEXT}
            className="w-full min-w-0 rounded-2xl border border-slate-300/90 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            disabled={loading}
          />
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-5 flex min-w-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDelete}
            disabled={!isConfirmationValid || loading}
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading
              ? "Eliminando cuenta..."
              : "Eliminar mi cuenta definitivamente"}
          </button>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          Esta acción elimina la cuenta de acceso actual. Si más adelante añades
          Stripe, aquí conectaremos también la cancelación automática de la
          suscripción.
        </p>
      </div>
    </section>
  );
}