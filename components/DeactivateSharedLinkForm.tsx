"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ActiveLinkOption = {
  id: string;
  label: string;
  description?: string | null;
};

type DeactivateSharedLinkFormProps = {
  links: ActiveLinkOption[];
};

export default function DeactivateSharedLinkForm({
  links,
}: DeactivateSharedLinkFormProps) {
  const router = useRouter();
  const [selectedLinkId, setSelectedLinkId] = useState(links[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!links.length) {
      setSelectedLinkId("");
      return;
    }

    const stillExists = links.some((link) => link.id === selectedLinkId);

    if (!stillExists) {
      setSelectedLinkId(links[0]?.id ?? "");
    }
  }, [links, selectedLinkId]);

  const selectedLink = useMemo(() => {
    return links.find((link) => link.id === selectedLinkId) ?? null;
  }, [links, selectedLinkId]);

  const inputClasses =
    "w-full min-w-0 rounded-2xl border border-slate-300/90 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60";

  async function handleDeactivate() {
    if (!selectedLink) return;

    const confirmed = window.confirm(
      `¿Quieres dejar de compartir la agenda con "${selectedLink.label}"? Ambos dejaréis de ver la agenda del otro.`
    );

    if (!confirmed) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/compartir/enlaces/${selectedLink.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "deactivate",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "No se pudo dejar de compartir.");
      }

      setSuccess("La conexión compartida se ha desactivado correctamente.");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo dejar de compartir.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
            Gestión de conexión
          </p>

          <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
            Dejar de compartir con
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Elige una conexión activa y corta la visibilidad compartida cuando
            quieras.
          </p>
        </div>

        <span className="inline-flex items-center self-start rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm sm:self-auto">
          {links.length} activa{links.length === 1 ? "" : "s"}
        </span>
      </div>

      {links.length === 0 ? (
        <div className="mt-5 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-4 text-base font-semibold text-slate-600">
          No tienes conexiones compartidas activas.
        </div>
      ) : (
        <div className="mt-5 grid gap-4">
          <label className="grid min-w-0 gap-2">
            <span className="text-sm font-semibold text-slate-700">
              Profesional conectado
            </span>

            <select
              value={selectedLinkId}
              onChange={(event) => {
                setSelectedLinkId(event.target.value);
                setError(null);
                setSuccess(null);
              }}
              disabled={loading}
              className={inputClasses}
            >
              {links.map((link) => (
                <option key={link.id} value={link.id}>
                  {link.label}
                </option>
              ))}
            </select>
          </label>

          {selectedLink ? (
            <div className="min-w-0 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white px-4 py-4 shadow-sm">
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="break-words text-base font-bold text-slate-900">
                    {selectedLink.label}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {selectedLink.description ||
                      "Agenda compartida en solo lectura."}
                  </p>
                </div>

                <span className="inline-flex items-center self-start rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm sm:self-auto">
                  Acción reversible
                </span>
              </div>
            </div>
          ) : null}

          <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900 shadow-sm">
            Al dejar de compartir,
            <span className="font-semibold">
              {" "}
              ambos dejaréis de ver la agenda del otro
            </span>
            . Más adelante podréis volver a conectaros enviando una nueva
            invitación.
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
              {success}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleDeactivate}
              disabled={loading || !selectedLink}
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Guardando..." : "Dejar de compartir"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}