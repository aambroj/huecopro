"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import PasswordField from "@/components/PasswordField";

function getFriendlyErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("user already registered")) {
    return "Ese email ya está registrado.";
  }

  if (normalized.includes("password")) {
    return "La contraseña no cumple los requisitos mínimos.";
  }

  return message || "No se pudo crear la cuenta.";
}

export default function RegistroPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setInfoMessage("");

    const cleanDisplayName = displayName.trim();
    const cleanEmail = email.trim();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
    });

    if (error) {
      setErrorMessage(getFriendlyErrorMessage(error.message));
      setSubmitting(false);
      return;
    }

    const createdUserId = data.user?.id;

    if (createdUserId && cleanDisplayName) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: createdUserId,
        display_name: cleanDisplayName,
      });

      if (profileError) {
        setErrorMessage(
          profileError.message ||
            "La cuenta se creó, pero no se pudo guardar el nombre."
        );
        setSubmitting(false);
        return;
      }
    }

    if (data.session) {
      router.replace("/agenda");
      router.refresh();
      return;
    }

    setInfoMessage(
      "Cuenta creada. Revisa tu correo si tienes activada la confirmación por email y después inicia sesión."
    );
    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-slate-500 transition hover:text-slate-700"
          >
            ← Volver a la portada
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
              Registro rápido
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Crea tu cuenta y empieza
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Registra tu acceso para entrar después a tu agenda de trabajo y
              empezar a organizar tus huecos y trabajos de forma simple.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            <div className="rounded-3xl border border-sky-200/80 bg-gradient-to-r from-sky-50 to-white p-4">
              <p className="text-sm font-bold text-slate-900">
                Tu usuario será siempre tu email
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Usa un correo que recuerdes bien, porque será tu acceso habitual.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-white p-4">
              <p className="text-sm font-bold text-slate-900">
                Pensado para el día a día real
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Una agenda sencilla para trabajar rápido desde móvil, tablet o
                escritorio.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-4">
              <p className="text-sm font-bold text-slate-900">
                ¿Ya tienes cuenta?
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Entra con tu email y contraseña para acceder directamente a tu
                agenda.
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
              Crear cuenta
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Registro
            </h2>

            <p className="mt-3 text-base leading-7 text-slate-600">
              Completa los datos para crear tu acceso a AutonomoAgenda.
            </p>
          </div>

          {infoMessage ? (
            <div className="mb-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-800">
              {infoMessage}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label
                htmlFor="displayName"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Nombre
              </label>

              <input
                id="displayName"
                type="text"
                autoComplete="name"
                value={displayName}
                onChange={(event) => {
                  setDisplayName(event.target.value);
                  setErrorMessage("");
                }}
                className="w-full rounded-2xl border border-slate-300/90 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                placeholder="Tu nombre"
                required
              />
            </div>

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
                }}
                className="w-full rounded-2xl border border-slate-300/90 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                placeholder="tuemail@ejemplo.com"
                required
              />
            </div>

            <PasswordField
              id="password"
              label="Contraseña"
              value={password}
              onChange={(value) => {
                setPassword(value);
                setErrorMessage("");
              }}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              required
              minLength={6}
            />

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 inline-flex min-h-[54px] items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-base font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <div className="mt-5 rounded-3xl border border-slate-200/80 bg-gradient-to-r from-slate-50 to-white px-4 py-4 text-sm leading-6 text-slate-600">
            Tu usuario será siempre el{" "}
            <span className="font-semibold text-slate-900">
              email con el que te registras
            </span>
            . Guárdalo bien para acceder y recuperar la contraseña cuando lo
            necesites.
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white px-4 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="font-semibold text-slate-900 underline underline-offset-4"
              >
                Entra aquí
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