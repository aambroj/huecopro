import { Suspense } from "react";
import LoginPageClient from "./LoginPageClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-md">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-medium text-slate-500">
                Cargando acceso...
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