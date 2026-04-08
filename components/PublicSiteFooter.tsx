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
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.9fr_0.9fr]">
          <div>
            <p className="text-lg font-black text-slate-900">AutonomoAgenda</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Agenda simple y visual para autónomos de reparaciones,
              instalaciones, fontanería, electricidad y reformas. Menos lío,
              más huecos claros y mejor organización del día.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Contacto y soporte
            </p>

            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-700">
              <a
                href="mailto:alber.ambroj@gmail.com"
                className="font-semibold transition hover:text-slate-900"
              >
                alber.ambroj@gmail.com
              </a>

              <a
                href="mailto:aambroj@yahoo.es"
                className="font-semibold transition hover:text-slate-900"
              >
                aambroj@yahoo.es
              </a>
            </div>

            <p className="mt-3 text-sm text-slate-600">
              Ambos correos pueden usarse para información y soporte del
              software.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Información
            </p>

            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link
                href="/faq"
                className="font-semibold text-slate-700 transition hover:text-slate-900"
              >
                FAQ
              </Link>

              <Link
                href="/aviso-legal"
                className="font-semibold text-slate-700 transition hover:text-slate-900"
              >
                Aviso legal
              </Link>

              <Link
                href="/privacidad"
                className="font-semibold text-slate-700 transition hover:text-slate-900"
              >
                Privacidad
              </Link>

              <Link
                href="/cookies"
                className="font-semibold text-slate-700 transition hover:text-slate-900"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-5">
          <p className="text-sm text-slate-500">
            © {year} AutonomoAgenda. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}