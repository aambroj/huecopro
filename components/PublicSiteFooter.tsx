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
    <footer className="relative border-t border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.95fr_0.95fr]">
          <div className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 text-sm font-black text-white shadow-lg shadow-blue-500/20">
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

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Agenda simple y visual para autónomos de reparaciones,
              instalaciones, fontanería, electricidad y reformas. Menos lío,
              más huecos claros y mejor organización del día.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Contacto y soporte
            </p>

            <div className="mt-4 flex flex-col gap-3 text-sm sm:text-base">
              <a
                href="mailto:alber.ambroj@gmail.com"
                className="break-all font-semibold text-slate-700 transition hover:text-slate-950"
              >
                alber.ambroj@gmail.com
              </a>

              <a
                href="mailto:aambroj@yahoo.es"
                className="break-all font-semibold text-slate-700 transition hover:text-slate-950"
              >
                aambroj@yahoo.es
              </a>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Ambos correos pueden usarse para información general y soporte del
              software.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Información
            </p>

            <div className="mt-4 flex flex-col gap-3 text-sm sm:text-base">
              <Link
                href="/faq"
                className="font-semibold text-slate-700 transition hover:text-slate-950"
              >
                FAQ
              </Link>

              <Link
                href="/aviso-legal"
                className="font-semibold text-slate-700 transition hover:text-slate-950"
              >
                Aviso legal
              </Link>

              <Link
                href="/privacidad"
                className="font-semibold text-slate-700 transition hover:text-slate-950"
              >
                Privacidad
              </Link>

              <Link
                href="/cookies"
                className="font-semibold text-slate-700 transition hover:text-slate-950"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-white/70 bg-white/65 px-5 py-4 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} AutonomoAgenda. Todos los derechos reservados.</p>
            <p>Diseñado para móvil, tablet y trabajo real del día a día.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}