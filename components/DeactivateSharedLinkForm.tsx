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
      const response = await fetch(
        `/api/compartir/enlaces/${selectedLink.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "deactivate",
          }),
        }
      );

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
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Dejar de compartir con
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Elige una conexión activa y corta la visibilidad compartida cuando
            quieras.
          </p>
        </div>

        <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
          {links.length} activa{links.length === 1 ? "" : "s"}
        </span>
      </div>

      {links.length === 0 ? (
        <div className="mt-5 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-4 text-base font-semibold text-slate-600">
          No tienes conexiones compartidas activas.
        </div>
      ) : (
        <div className="mt-5 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">
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
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {links.map((link) => (
                <option key={link.id} value={link.id}>
                  {link.label}
                </option>
              ))}
            </select>
          </label>

          {selectedLink ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-base font-bold text-slate-900">
                {selectedLink.label}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {selectedLink.description ||
                  "Agenda compartida en solo lectura."}
              </p>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          ) : null}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleDeactivate}
              disabled={loading || !selectedLink}
              className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Dejar de compartir"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}