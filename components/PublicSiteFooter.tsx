"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const INTERNAL_PREFIXES = ["/agenda", "/compartir", "/cuenta"];

function shouldHideFooter(pathname: string) {
  return INTERNAL_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export default function PublicSiteFooter() {
  const pathname = usePathname();

  if (shouldHideFooter(pathname)) {
    return null;
  }

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/60 bg-transparent">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8">
        <div className="rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_0.95fr]">
            <section className="rounded-[1.75rem] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 text-sm font-black text-white shadow-lg shadow-blue-500/20">
                  AA
                </div>

                <div className="min-w-0">
                  <p className="text-xl font-black leading-none text-slate-900">
                    <span className="block sm:inline">Autonomo</span>
                    <span className="block sm:ml-1 sm:inline">Agenda</span>
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    La agenda más simple para autónomos
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-xl text-base leading-8 text-slate-700">
                Agenda simple y visual para autónomos de reparaciones,
                instalaciones, fontanería, electricidad y reformas. Menos lío,
                más huecos claros y mejor organización del día.
              </p>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                Contacto y soporte
              </p>

              <div className="mt-5 flex flex-col gap-4">
                <a
                  href="mailto:alber.ambroj@gmail.com"
                  className="group rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Correo principal
                  </p>
                  <p className="mt-2 break-all text-lg font-bold text-slate-900 transition group-hover:text-sky-700">
                    alber.ambroj@gmail.com
                  </p>
                </a>

                <a
                  href="mailto:aambroj@yahoo.es"
                  className="group rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Correo alternativo
                  </p>
                  <p className="mt-2 break-all text-lg font-bold text-slate-900 transition group-hover:text-sky-700">
                    aambroj@yahoo.es
                  </p>
                </a>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Ambos correos pueden usarse para información general y soporte
                del software.
              </p>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                Información
              </p>

              <nav className="mt-5 grid gap-3 text-base">
                <Link
                  href="/faq"
                  className="rounded-2xl border border-transparent px-3 py-2 font-semibold text-slate-700 transition hover:border-slate-200 hover:bg-white hover:text-slate-900"
                >
                  FAQ
                </Link>

                <Link
                  href="/aviso-legal"
                  className="rounded-2xl border border-transparent px-3 py-2 font-semibold text-slate-700 transition hover:border-slate-200 hover:bg-white hover:text-slate-900"
                >
                  Aviso legal
                </Link>

                <Link
                  href="/privacidad"
                  className="rounded-2xl border border-transparent px-3 py-2 font-semibold text-slate-700 transition hover:border-slate-200 hover:bg-white hover:text-slate-900"
                >
                  Privacidad
                </Link>

                <Link
                  href="/cookies"
                  className="rounded-2xl border border-transparent px-3 py-2 font-semibold text-slate-700 transition hover:border-slate-200 hover:bg-white hover:text-slate-900"
                >
                  Cookies
                </Link>
              </nav>
            </section>
          </div>

          <div className="mt-6 border-t border-slate-200/80 pt-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                © {year} AutonomoAgenda. Todos los derechos reservados.
              </p>

              <p className="text-sm text-slate-500">
                Hecho para autónomos que necesitan ir al grano.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}