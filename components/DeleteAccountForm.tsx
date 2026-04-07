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
        throw new Error(
          result?.error || "No se pudo eliminar la cuenta."
        );
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
    <section className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
            Zona sensible
          </p>

          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            Eliminar mi cuenta
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-red-900 sm:text-base">
            Esta acción es irreversible. Se eliminará tu acceso, se borrarán tus
            trabajos guardados, se cortarán las agendas compartidas activas y se
            limpiarán invitaciones relacionadas con tu cuenta.
          </p>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-red-900 sm:text-base">
            La cancelación del cobro mensual todavía no está conectada aquí
            porque Stripe aún no está montado en HuecoPro.
          </p>
        </div>

        <span className="inline-flex items-center rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700">
          Irreversible
        </span>
      </div>

      <div className="mt-5 rounded-3xl border border-red-200 bg-white p-4 sm:p-5">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Para confirmar, escribe exactamente:
          <span className="ml-2 font-bold">{CONFIRM_TEXT}</span>
        </div>

        <div className="mt-4 grid gap-2">
          <label
            htmlFor="delete-account-confirmation"
            className="text-sm font-medium text-slate-700"
          >
            Confirmación manual
          </label>

          <input
            id="delete-account-confirmation"
            type="text"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder={CONFIRM_TEXT}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
            disabled={loading}
          />
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDelete}
            disabled={!isConfirmationValid || loading}
            className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Eliminando cuenta..." : "Eliminar mi cuenta definitivamente"}
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