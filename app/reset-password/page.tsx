import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordPageClient from "./ResetPasswordPageClient";

export const metadata: Metadata = {
  title: "Nueva contraseña | AutonomoAgenda",
  description:
    "Crea una contraseña nueva para volver a entrar en tu cuenta de AutonomoAgenda.",
};

function ResetPasswordFallback() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-slate-500">
            Comprobando enlace de recuperación...
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