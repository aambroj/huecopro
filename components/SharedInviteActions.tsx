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

  const inputClasses =
    "rounded-2xl border border-slate-300/90 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

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
      <div className="flex flex-col items-start gap-3">
        <button
          type="button"
          onClick={() => runAction("cancel")}
          disabled={loadingAction !== null}
          className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-slate-300/90 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingAction === "cancel" ? "Cancelando..." : "Cancelar invitación"}
        </button>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="grid gap-3">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">
            Cómo quieres identificar a este profesional (opcional)
          </span>
          <input
            type="text"
            value={aliasForInvitee}
            onChange={(event) => setAliasForInvitee(event.target.value)}
            placeholder="Ejemplo: Electricista Pedro"
            maxLength={60}
            className={inputClasses}
          />
        </label>

        <div className="rounded-3xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-6 text-sky-800 shadow-sm">
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
            className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingAction === "accept"
              ? "Aceptando..."
              : "Aceptar y compartir ambas agendas"}
          </button>

          <button
            type="button"
            onClick={() => runAction("reject")}
            disabled={loadingAction !== null}
            className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-slate-300/90 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingAction === "reject" ? "Rechazando..." : "Rechazar"}
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}