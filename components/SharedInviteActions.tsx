"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SharedInviteActionsProps = {
  inviteId: string;
  variant: "received" | "sent";
};

export default function SharedInviteActions({
  inviteId,
  variant,
}: SharedInviteActionsProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<
    "accept" | "reject" | "cancel" | null
  >(null);
  const [aliasForInvitee, setAliasForInvitee] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function runAction(action: "accept" | "reject" | "cancel") {
    setLoadingAction(action);
    setError(null);

    try {
      const response = await fetch(`/api/compartir/invitaciones/${inviteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          alias_for_invitee: aliasForInvitee,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "No se pudo actualizar la invitación.");
      }

      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la invitación.";
      setError(message);
    } finally {
      setLoadingAction(null);
    }
  }

  if (variant === "sent") {
    return (
      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          onClick={() => runAction("cancel")}
          disabled={loadingAction !== null}
          className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
        >
          {loadingAction === "cancel" ? "Cancelando..." : "Cancelar invitación"}
        </button>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="grid gap-3">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">
            Cómo quieres identificar a este profesional (opcional)
          </span>
          <input
            type="text"
            value={aliasForInvitee}
            onChange={(event) => setAliasForInvitee(event.target.value)}
            placeholder="Ejemplo: Electricista Pedro"
            maxLength={60}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
          />
        </label>

        <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
          Si aceptas,
          <span className="font-semibold">
            {" "}
            se activará la visibilidad mutua entre ambas agendas
          </span>
          . Tú verás su agenda y la otra persona verá la tuya.
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => runAction("accept")}
            disabled={loadingAction !== null}
            className="inline-flex rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingAction === "accept"
              ? "Aceptando..."
              : "Aceptar y compartir ambas agendas"}
          </button>

          <button
            type="button"
            onClick={() => runAction("reject")}
            disabled={loadingAction !== null}
            className="inline-flex rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingAction === "reject" ? "Rechazando..." : "Rechazar"}
          </button>
        </div>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </div>
    </div>
  );
}