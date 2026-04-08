import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Política de privacidad de AutonomoAgenda.",
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Información legal
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Privacidad
          </h1>

          <div className="mt-6 grid gap-6 text-sm leading-7 text-slate-700 sm:text-base">
            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Datos que se pueden tratar
              </h2>
              <p className="mt-3">
                AutonomoAgenda puede tratar los datos que el usuario facilite al
                registrarse, iniciar sesión, recuperar contraseña, compartir
                agenda con otro profesional o utilizar la aplicación en su día a
                día.
              </p>
              <p className="mt-3">
                Entre esos datos pueden estar el email de acceso, información de
                agenda, datos de trabajos introducidos por el usuario y
                comunicaciones enviadas por correo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Finalidad del tratamiento
              </h2>
              <p className="mt-3">
                Los datos se usan para prestar el servicio, permitir el acceso a
                la cuenta, gestionar funcionalidades como la agenda compartida,
                mantener la seguridad del acceso, responder consultas y mejorar
                el funcionamiento general del software.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Conservación
              </h2>
              <p className="mt-3">
                Los datos se conservan mientras sean necesarios para prestar el
                servicio, atender obligaciones derivadas del uso de la
                plataforma o gestionar la cuenta del usuario.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Agenda y datos introducidos por el usuario
              </h2>
              <p className="mt-3">
                La información introducida por cada usuario dentro de su agenda
                se utiliza para el funcionamiento normal del servicio. En caso de
                activar la agenda compartida, la visualización mutua se limita a
                las conexiones autorizadas por los propios usuarios.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Derechos y contacto
              </h2>
              <p className="mt-3">
                Para cuestiones relacionadas con privacidad, acceso,
                rectificación, supresión o cualquier otra solicitud relacionada
                con tus datos, puedes escribir a:
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