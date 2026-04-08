"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import PasswordField from "@/components/PasswordField";

function getFriendlyErrorMessage(message: string) {
  const normalized = message.toLowerCase().trim();

  if (
    normalized.includes("new password should be different from the old password") ||
    normalized.includes("different from the old password") ||
    normalized.includes("same password") ||
    normalized.includes("old password")
  ) {
    return "La nueva contraseña debe ser diferente de la anterior.";
  }

  if (
    normalized.includes("password should be at least") ||
    normalized.includes("weak password") ||
    normalized.includes("password is too weak")
  ) {
    return "La contraseña debe ser más segura.";
  }

  if (
    normalized.includes("session") ||
    normalized.includes("expired") ||
    normalized.includes("invalid")
  ) {
    return "El enlace de recuperación ya no es válido o ha caducado. Vuelve a pedir uno nuevo.";
  }

  if (normalized.includes("pkce")) {
    return "No se pudo validar el enlace de recuperación. Pide uno nuevo e inténtalo otra vez.";
  }

  return "No se pudo cambiar la contraseña. Inténtalo de nuevo.";
}

export default function ResetPasswordPageClient() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [linkReady, setLinkReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState(
    "Comprobando el enlace de recuperación..."
  );

  useEffect(() => {
    let isMounted = true;

    async function checkRecoveryAccess() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (session) {
        setLinkReady(true);
        setCheckingLink(false);
        setInfoMessage(
          "Ya puedes escribir una contraseña nueva para tu cuenta."
        );
        return;
      }

      setCheckingLink(false);
      setLinkReady(false);
      setInfoMessage(
        "Abre el enlace que te llegó por correo para poder cambiar la contraseña."
      );
    }

    checkRecoveryAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (
        event === "PASSWORD_RECOVERY" ||
        ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session)
      ) {
        setLinkReady(true);
        setCheckingLink(false);
        setErrorMessage("");
        setInfoMessage(
          "Ya puedes escribir una contraseña nueva para tu cuenta."
        );
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!linkReady) {
      setErrorMessage(
        "Necesitas abrir el enlace de recuperación del correo para continuar."
      );
      return;
    }

    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las dos contraseñas no coinciden.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }

      await supabase.auth.signOut();

      router.replace("/login?passwordUpdated=1");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Reset password error:", error.message);
        setErrorMessage(getFriendlyErrorMessage(error.message));
      } else {
        console.error("Reset password unknown error:", error);
        setErrorMessage(
          "No se pudo cambiar la contraseña. Inténtalo de nuevo."
        );
      }

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
              Nueva contraseña
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Crea una contraseña nueva
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Usa una contraseña nueva para volver a entrar a tu agenda con
              normalidad.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            <div className="rounded-3xl border border-sky-200/80 bg-gradient-to-r from-sky-50 to-white p-4">
              <p className="text-sm font-bold text-slate-900">
                Abre primero el enlace del correo
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Solo podrás guardar la nueva contraseña si has entrado desde el
                enlace de recuperación.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-white p-4">
              <p className="text-sm font-bold text-slate-900">
                Elige una contraseña distinta
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Mejor que sea fácil de recordar para ti, pero diferente de la
                anterior.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-4">
              <p className="text-sm font-bold text-slate-900">
                ¿El enlace no funciona?
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Puedes pedir uno nuevo desde la pantalla de recuperación de
                contraseña.
              </p>
              <Link
                href="/recuperar-contrasena"
                className="mt-3 inline-flex items-center text-sm font-semibold text-slate-900 underline underline-offset-4"
              >
                Pedir un enlace nuevo
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Cambio de contraseña
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Guardar nueva contraseña
            </h2>

            <p className="mt-3 text-base leading-7 text-slate-600">
              Escribe la nueva contraseña dos veces para confirmar el cambio.
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
            <PasswordField
              id="password"
              label="Nueva contraseña"
              value={password}
              onChange={(value) => {
                setPassword(value);
                setErrorMessage("");
              }}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              required
              disabled={!linkReady || checkingLink || submitting}
            />

            <PasswordField
              id="confirmPassword"
              label="Repetir contraseña"
              value={confirmPassword}
              onChange={(value) => {
                setConfirmPassword(value);
                setErrorMessage("");
              }}
              placeholder="Repite la nueva contraseña"
              autoComplete="new-password"
              required
              disabled={!linkReady || checkingLink || submitting}
            />

            <button
              type="submit"
              disabled={!linkReady || checkingLink || submitting}
              className="mt-1 inline-flex min-h-[54px] items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-base font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Guardando..." : "Guardar nueva contraseña"}
            </button>
          </form>

          <div className="mt-5 rounded-3xl border border-slate-200/80 bg-gradient-to-r from-slate-50 to-white px-4 py-4 text-sm leading-6 text-slate-600">
            Si este enlace ha caducado o no funciona, vuelve a pedir otro desde{" "}
            <Link
              href="/recuperar-contrasena"
              className="font-semibold text-slate-900 underline underline-offset-4"
            >
              recuperar contraseña
            </Link>
            .
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white px-4 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              ¿Prefieres volver al acceso?{" "}
              <Link
                href="/login"
                className="font-semibold text-slate-900 underline underline-offset-4"
              >
                Ir a login
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