"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function ShareAgendaInviteForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [alias, setAlias] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/compartir/invitaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invitee_email: email,
          alias_for_inviter: alias,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "No se pudo enviar la invitación.");
      }

      setEmail("");
      setAlias("");
      setSuccess("Invitación creada correctamente.");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo enviar la invitación.";
      setError(message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Compartir con otro profesional
        </h2>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Escribe el correo del otro autónomo. Si acepta la invitación,
          <span className="font-semibold text-slate-800">
            {" "}
            ambas cuentas podrán ver la agenda de la otra en solo lectura
          </span>
          . Nadie podrá editar la agenda ajena.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">
            Email del compañero
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="compañero@email.com"
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">
            Cómo quieres identificarlo tú (opcional)
          </span>
          <input
            type="text"
            value={alias}
            onChange={(event) => setAlias(event.target.value)}
            placeholder="Ejemplo: Fontanero Juan"
            maxLength={60}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
          />
          <p className="text-xs text-slate-500">
            Este nombre te servirá a ti para ver mejor su agenda luego.
          </p>
        </label>

        <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
          Al aceptar la invitación, la conexión será mutua:
          <span className="font-semibold">
            {" "}
            tú verás su agenda y él verá la tuya
          </span>
          , siempre en solo lectura.
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Esta conexión
          <span className="font-semibold">
            {" "}
            seguirá activa aunque cerréis sesión y volváis otro día
          </span>
          . Solo se corta cuando uno de los dos pulsa{" "}
          <span className="font-semibold">“Dejar de compartir”</span>.
        </div>

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
            type="submit"
            disabled={sending}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "Enviando..." : "Enviar invitación"}
          </button>
        </div>
      </form>
    </div>
  );
}