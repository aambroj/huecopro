"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

function getFriendlyErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid email")) {
    return "Introduce un email válido.";
  }

  if (
    normalized.includes("email rate limit exceeded") ||
    normalized.includes("rate limit")
  ) {
    return "Has hecho demasiados intentos. Espera un poco y vuelve a probar.";
  }

  return message || "No se pudo enviar el correo de recuperación.";
}

function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin.replace(/\/$/, "");
  }

  return "";
}

export default function RecuperarContrasenaPageClient() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const baseUrl = getBaseUrl();

      if (!baseUrl) {
        throw new Error(
          "No se pudo preparar la recuperación de contraseña."
        );
      }

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${baseUrl}/reset-password`,
        }
      );

      if (error) {
        throw error;
      }

      setSuccessMessage(
        "Te hemos enviado un correo para recuperar la contraseña. Revisa tu bandeja de entrada y el spam."
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? getFriendlyErrorMessage(error.message)
          : "No se pudo enviar el correo de recuperación.";

      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-8">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-semibold text-slate-500 transition hover:text-slate-700"
          >
            ← Volver al acceso
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 text-base font-black text-white shadow-lg shadow-blue-500/20">
              AA
            </div>

            <div className="min-w-0">
              <p className="text-lg font-black leading-none text-slate-950">
                <span className="block sm:inline">Autonomo</span>
                <span className="block sm:ml-1 sm:inline">Agenda</span>
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">
                La agenda más simple para autónomos
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
              Recuperación de acceso
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Recupera tu contraseña
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Introduce el email con el que te registraste y te enviaremos un
              enlace para crear una contraseña nueva.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            <div className="rounded-3xl border border-sky-200/80 bg-gradient-to-r from-sky-50 to-white p-4">
              <p className="text-sm font-bold text-slate-900">
                Tu usuario siempre es tu email
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Usa el mismo correo con el que creaste tu cuenta en
                AutonomoAgenda.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-white p-4">
              <p className="text-sm font-bold text-slate-900">
                Revisión rápida del correo
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Después de enviarlo, revisa tanto la bandeja de entrada como la
                carpeta de spam.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-4">
              <p className="text-sm font-bold text-slate-900">
                ¿Ya recuerdas tu contraseña?
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Puedes volver a la pantalla de acceso y entrar directamente.
              </p>
              <Link
                href="/login"
                className="mt-3 inline-flex items-center text-sm font-semibold text-slate-900 underline underline-offset-4"
              >
                Ir al acceso
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Enviar enlace
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Recuperar contraseña
            </h2>

            <p className="mt-3 text-base leading-7 text-slate-600">
              Te mandaremos un enlace para que puedas crear una contraseña nueva.
            </p>
          </div>

          {errorMessage ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              {successMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email de acceso
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="w-full rounded-2xl border border-slate-300/90 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                placeholder="tuemail@ejemplo.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 inline-flex min-h-[54px] items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-base font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Enviando..." : "Enviar enlace de recuperación"}
            </button>
          </form>

          <div className="mt-5 rounded-3xl border border-slate-200/80 bg-gradient-to-r from-slate-50 to-white px-4 py-4 text-sm leading-6 text-slate-600">
            En AutonomoAgenda tu usuario es siempre el{" "}
            <span className="font-semibold text-slate-900">
              email con el que te registraste
            </span>
            . Si no recuerdas cuál era, prueba con tus correos habituales.
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white px-4 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              ¿Ya la recuerdas?{" "}
              <Link
                href="/login"
                className="font-semibold text-slate-900 underline underline-offset-4"
              >
                Volver a entrar
              </Link>
            </p>

            <div className="text-sm text-slate-500">
              Soporte:{" "}
              <a
                href="mailto:alber.ambroj@gmail.com"
                className="font-semibold text-slate-700"
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