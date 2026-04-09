"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import PasswordField from "@/components/PasswordField";

function getSafeRedirect(value: string | null) {
  if (!value) return "/agenda";
  if (!value.startsWith("/")) return "/agenda";
  if (value.startsWith("//")) return "/agenda";
  return value;
}

function getFriendlyErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid credentials")
  ) {
    return "Email o contraseña incorrectos.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Tu email todavía no está confirmado.";
  }

  return message || "No se pudo iniciar sesión.";
}

function getRecoveryErrorMessage(errorCode: string | null) {
  if (!errorCode) return "";

  if (errorCode === "invalid_recovery_link") {
    return "El enlace de recuperación no es válido o ha caducado. Pide uno nuevo.";
  }

  return "";
}

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const redirectTo = useMemo(
    () => getSafeRedirect(searchParams.get("redirectTo")),
    [searchParams]
  );

  const registered = searchParams.get("registered") === "1";
  const resetSent = searchParams.get("resetSent") === "1";
  const passwordUpdated = searchParams.get("passwordUpdated") === "1";
  const recoveryErrorMessage = getRecoveryErrorMessage(
    searchParams.get("error")
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setInfoMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMessage(getFriendlyErrorMessage(error.message));
      setSubmitting(false);
      return;
    }

    router.replace(redirectTo);
    router.refresh();
  }

  function handleUseAnotherEmail() {
    setEmail("");
    setPassword("");
    setErrorMessage("");
    setInfoMessage("Puedes probar ahora con otro correo.");
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-slate-500 transition hover:text-slate-700"
          >
            ← Volver a la portada
          </Link>

          <div className="mt-6 flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 text-sm font-black text-white shadow-lg shadow-blue-500/20 sm:h-14 sm:w-14 sm:text-base">
              AA
            </div>

            <div className="min-w-0">
              <p className="text-xl font-black leading-none text-slate-950 sm:text-lg">
                <span className="block sm:inline">Autonomo</span>
                <span className="block sm:ml-1 sm:inline">Agenda</span>
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">
                La agenda más simple para autónomos
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 sm:text-sm">
              Acceso rápido
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Entra en tu cuenta
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base lg:text-lg">
              Accede a tu agenda para ver tus huecos libres, tus trabajos y tu
              organización del día.
            </p>
          </div>

          <div className="mt-6 rounded-3xl border border-sky-200/80 bg-gradient-to-r from-sky-50 to-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Precio previsto
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <span className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                Primer mes 4,90 €
              </span>

              <span className="inline-flex items-center justify-center rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-sky-700">
                Después 11,50 €/mes
              </span>

              <span className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                IVA incluido
              </span>
            </div>
          </div>

          <div className="mt-7 grid gap-3">
            <div className="rounded-3xl border border-sky-200/80 bg-gradient-to-r from-sky-50 to-white p-4">
              <p className="text-sm font-bold text-slate-900">
                Tu usuario es siempre tu email
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                En AutonomoAgenda accedes siempre con el correo con el que te
                registraste.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-white p-4">
              <p className="text-sm font-bold text-slate-900">
                Pensado para trabajar rápido
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Una agenda sencilla para usar desde móvil, tablet o escritorio
                sin complicarte más de la cuenta.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-4">
              <p className="text-sm font-bold text-slate-900">
                ¿Todavía no tienes cuenta?
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Regístrate con tu email para crear tu acceso y entrar después a
                tu agenda.
              </p>
              <Link
                href="/registro"
                className="mt-3 inline-flex items-center text-sm font-semibold text-slate-900 underline underline-offset-4"
              >
                Ir al registro
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 sm:text-sm">
              Acceso
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Entrar
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Introduce tus datos para acceder a AutonomoAgenda.
            </p>
          </div>

          {registered ? (
            <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium leading-6 text-emerald-800">
              Cuenta creada correctamente. Ya puedes entrar.
            </div>
          ) : null}

          {resetSent ? (
            <div className="mb-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium leading-6 text-sky-800">
              Revisa tu correo. Te hemos enviado las instrucciones para
              recuperar la contraseña.
            </div>
          ) : null}

          {passwordUpdated ? (
            <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium leading-6 text-emerald-800">
              Contraseña actualizada correctamente. Ya puedes entrar.
            </div>
          ) : null}

          {recoveryErrorMessage ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700">
              {recoveryErrorMessage}
            </div>
          ) : null}

          {infoMessage ? (
            <div className="mb-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium leading-6 text-sky-800">
              {infoMessage}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrorMessage("");
                  setInfoMessage("");
                }}
                className="w-full rounded-2xl border border-slate-300/90 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                placeholder="tuemail@ejemplo.com"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <PasswordField
                id="password"
                label="Contraseña"
                value={password}
                onChange={(value) => {
                  setPassword(value);
                  setErrorMessage("");
                  setInfoMessage("");
                }}
                placeholder="Tu contraseña"
                autoComplete="current-password"
                required
                disabled={submitting}
              />

              <div className="mt-2 flex justify-end">
                <Link
                  href="/recuperar-contrasena"
                  className="text-sm font-semibold text-slate-700 underline underline-offset-4 transition hover:text-slate-900"
                >
                  He olvidado mi contraseña
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-base font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Entrando..." : "Entrar"}
            </button>

            <button
              type="button"
              onClick={handleUseAnotherEmail}
              disabled={submitting}
              className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Usar otro email
            </button>
          </form>

          <div className="mt-5 rounded-3xl border border-slate-200/80 bg-gradient-to-r from-slate-50 to-white px-4 py-4 text-sm leading-6 text-slate-600">
            Tu usuario es el{" "}
            <span className="font-semibold text-slate-900">
              email con el que te registraste
            </span>
            . Si no recuerdas cuál era, prueba con tus correos habituales o usa
            la recuperación de contraseña.
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white px-4 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p className="leading-6">
              ¿Todavía no tienes cuenta?{" "}
              <Link
                href="/registro"
                className="font-semibold text-slate-900 underline underline-offset-4"
              >
                Regístrate aquí
              </Link>
            </p>

            <div className="text-sm text-slate-500">
              Soporte:{" "}
              <a
                href="mailto:alber.ambroj@gmail.com"
                className="font-semibold break-all text-slate-700"
              >
                alber.ambroj@gmail.com
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}