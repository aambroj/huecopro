import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Política de cookies de AutonomoAgenda.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Información legal
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Cookies
          </h1>

          <div className="mt-6 grid gap-6 text-sm leading-7 text-slate-700 sm:text-base">
            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Qué son las cookies
              </h2>
              <p className="mt-3">
                Las cookies son pequeños archivos que pueden almacenarse en tu
                navegador para recordar información técnica, mantener sesiones,
                mejorar la experiencia de acceso y facilitar el funcionamiento de
                determinadas partes del servicio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Uso en AutonomoAgenda
              </h2>
              <p className="mt-3">
                AutonomoAgenda utiliza elementos técnicos necesarios para el
                acceso, la autenticación, la continuidad de sesión y el correcto
                funcionamiento básico de la aplicación.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Cookies técnicas y de sesión
              </h2>
              <p className="mt-3">
                Algunas cookies o mecanismos equivalentes pueden ser necesarios
                para permitir el inicio de sesión, la seguridad del acceso, la
                recuperación de contraseña y otras funciones esenciales del
                software.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Configuración del navegador
              </h2>
              <p className="mt-3">
                El usuario puede revisar o limitar el uso de cookies desde la
                configuración de su navegador, aunque desactivar determinadas
                cookies técnicas puede afectar al funcionamiento del acceso o de
                algunas partes del servicio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Contacto
              </h2>
              <p className="mt-3">
                Para cualquier consulta relacionada con esta política puedes
                escribir a:
              </p>

              <div className="mt-3 flex flex-col gap-2">
                <a
                  href="mailto:alber.ambroj@gmail.com"
                  className="font-semibold text-slate-900 underline underline-offset-4"
                >
                  alber.ambroj@gmail.com
                </a>
                <a
                  href="mailto:aambroj@yahoo.es"
                  className="font-semibold text-slate-900 underline underline-offset-4"
                >
                  aambroj@yahoo.es
                </a>
              </div>
            </section>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Volver a la portada
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}