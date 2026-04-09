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

  const inputClasses =
    "rounded-2xl border border-slate-300/90 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

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
    <div className="rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
          Nueva conexión
        </p>

        <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Compartir con otro profesional
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
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
          <span className="text-sm font-semibold text-slate-700">
            Email del compañero
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="companero@email.com"
            className={inputClasses}
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">
            Cómo quieres identificarlo tú (opcional)
          </span>
          <input
            type="text"
            value={alias}
            onChange={(event) => setAlias(event.target.value)}
            placeholder="Ejemplo: Fontanero Juan"
            maxLength={60}
            className={inputClasses}
          />
          <p className="text-xs font-medium text-slate-500">
            Este nombre te servirá a ti para ver mejor su agenda luego.
          </p>
        </label>

        <div className="rounded-3xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-6 text-sky-800 shadow-sm">
          Al aceptar la invitación, la conexión será mutua:
          <span className="font-semibold">
            {" "}
            tú verás su agenda y él verá la tuya
          </span>
          , siempre en solo lectura.
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900 shadow-sm">
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
            className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "Enviando..." : "Enviar invitación"}
          </button>
        </div>
      </form>
    </div>
  );
}