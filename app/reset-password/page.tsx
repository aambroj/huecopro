import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordPageClient from "./ResetPasswordPageClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Nueva contraseña | AutonomoAgenda",
  description:
    "Crea una contraseña nueva para volver a entrar en tu cuenta de AutonomoAgenda.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Nueva contraseña | AutonomoAgenda",
    description:
      "Crea una contraseña nueva para volver a entrar en tu cuenta de AutonomoAgenda.",
    type: "website",
    locale: "es_ES",
    siteName: "AutonomoAgenda",
  },
  twitter: {
    card: "summary",
    title: "Nueva contraseña | AutonomoAgenda",
    description:
      "Crea una contraseña nueva para volver a entrar en tu cuenta de AutonomoAgenda.",
  },
};

function ResetPasswordFallback() {
  return (
    <main className="min-h-screen bg-transparent px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-md">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Recuperación
              </p>
              <p className="mt-1 text-base font-bold text-slate-900">
                Comprobando enlace de recuperación...
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-2xl bg-slate-200" />
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-500">
            Preparando el cambio de contraseña de AutonomoAgenda.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordPageClient />
    </Suspense>
  );
}