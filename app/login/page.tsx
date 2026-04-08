import { Suspense } from "react";
import LoginPageClient from "./LoginPageClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-transparent px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-md">
            <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Acceso
                  </p>
                  <p className="mt-1 text-base font-bold text-slate-900">
                    Cargando acceso...
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-12 animate-pulse rounded-2xl bg-slate-200" />
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-500">
                Preparando la pantalla de acceso de AutonomoAgenda.
              </p>
            </div>
          </div>
        </main>
      }
    >
      <LoginPageClient />
    </Suspense>
  );
}