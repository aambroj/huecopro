import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import InternalTopbar from "@/components/InternalTopbar";
import DeleteAccountForm from "@/components/DeleteAccountForm";
import CopyAccessEmailButton from "@/components/CopyAccessEmailButton";
import { getSupabaseServer } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Cuenta | AutonomoAgenda",
  description: "Cuenta de usuario en AutonomoAgenda.",
};

export const dynamic = "force-dynamic";

export default async function CuentaPage() {
  const supabase = await getSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const accessEmail = user.email ?? "Sin email";

  return (
    <main className="min-h-screen bg-transparent px-4 py-6 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <InternalTopbar />

        <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Cuenta
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Tu cuenta
          </h1>

          <p className="mt-4 max-w-3xl text-base text-slate-600 sm:text-lg">
            Aquí tienes a mano los datos básicos de acceso y las acciones
            importantes de recuperación y baja de cuenta.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Email de acceso
              </p>

              <p className="mt-2 break-all text-lg font-bold text-slate-900 sm:text-xl">
                {accessEmail}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                Este es tu usuario de acceso. En AutonomoAgenda el usuario
                siempre es el email con el que te registraste.
              </p>

              {user.email ? (
                <div className="mt-4">
                  <CopyAccessEmailButton email={user.email} />
                </div>
              ) : null}
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Estado actual
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <p className="text-lg font-bold text-slate-900 sm:text-xl">
                  Cuenta activa
                </p>

                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  Operativa
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                Más adelante aquí pondremos también plan, facturación y
                cancelación automática de suscripción cuando conectemos Stripe.
              </p>
            </div>
          </div>

          <section className="mt-8 rounded-[2rem] border border-sky-200 bg-sky-50/95 p-5 shadow-sm sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
              Acceso y recuperación
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              ¿No recuerdas la contraseña o el usuario?
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-sky-900 sm:text-base">
              Tu usuario es siempre tu email de acceso. Si no recuerdas la
              contraseña, puedes pedir un enlace de recuperación y crear una
              nueva.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/recuperar-contrasena"
                className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold !text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:!text-white"
              >
                Recuperar contraseña
              </Link>

              <Link
                href="/login"
                className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-slate-300/90 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
              >
                Ir a acceso
              </Link>
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] border border-amber-200 bg-amber-50/95 p-5 shadow-sm sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
              Aviso importante
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              Baja de cuenta
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-amber-900 sm:text-base">
              Ya puedes darte de baja tú mismo escribiendo una confirmación
              manual. Esta baja eliminará tu acceso, tus trabajos y las
              conexiones compartidas activas.
            </p>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-amber-900 sm:text-base">
              La parte del cobro mensual todavía no se cancela desde aquí porque
              Stripe aún no está montado en AutonomoAgenda.
            </p>
          </section>

          <div className="mt-8">
            <DeleteAccountForm />
          </div>

          <div className="mt-6">
            <Link
              href="/agenda"
              className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-slate-300/90 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
            >
              Volver a la agenda
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}