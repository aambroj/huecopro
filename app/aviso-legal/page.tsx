import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso legal | AutonomoAgenda",
  description: "Aviso legal de AutonomoAgenda.",
};

export default function AvisoLegalPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Información legal
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Aviso legal
          </h1>

          <div className="mt-6 grid gap-6 text-sm leading-7 text-slate-700 sm:text-base">
            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Titular del sitio
              </h2>
              <p className="mt-3">
                AutonomoAgenda es un software orientado a la organización de
                trabajos y agenda para profesionales autónomos.
              </p>
              <p className="mt-3">
                Para cualquier cuestión relacionada con el sitio, el servicio o
                comunicaciones administrativas, puedes contactar por correo en{" "}
                <a
                  href="mailto:alber.ambroj@gmail.com"
                  className="whitespace-nowrap font-semibold text-[clamp(0.86rem,3.2vw,1rem)] text-slate-900 underline underline-offset-4"
                >
                  alber.ambroj@gmail.com
                </a>{" "}
                o{" "}
                <a
                  href="mailto:aambroj@yahoo.es"
                  className="whitespace-nowrap font-semibold text-[clamp(0.86rem,3.2vw,1rem)] text-slate-900 underline underline-offset-4"
                >
                  aambroj@yahoo.es
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Objeto del sitio
              </h2>
              <p className="mt-3">
                Este sitio tiene como finalidad informar sobre AutonomoAgenda y
                ofrecer acceso a la aplicación, sus funcionalidades y sus vías
                de contacto y soporte.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Uso del servicio
              </h2>
              <p className="mt-3">
                El usuario se compromete a utilizar la web y la aplicación de
                forma lícita, responsable y sin causar perjuicio al servicio, a
                terceros o a la infraestructura técnica utilizada.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Propiedad intelectual
              </h2>
              <p className="mt-3">
                Los contenidos, diseño, marca, estructura y elementos visibles
                del sitio pertenecen a AutonomoAgenda o se utilizan con la
                autorización correspondiente. No está permitida su reproducción,
                distribución o transformación sin autorización previa, salvo en
                los casos legalmente permitidos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Disponibilidad y responsabilidad
              </h2>
              <p className="mt-3">
                Se intenta mantener el servicio disponible y actualizado, pero
                no se garantiza el funcionamiento ininterrumpido ni la ausencia
                total de errores, incidencias técnicas o interrupciones
                puntuales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">Contacto</h2>
              <p className="mt-3">
                Para soporte, incidencias, información general o comunicaciones
                relacionadas con el servicio, puedes escribir a cualquiera de
                estos dos correos:
              </p>

              <div className="mt-3 flex flex-col gap-2">
                <a
                  href="mailto:alber.ambroj@gmail.com"
                  className="whitespace-nowrap font-semibold text-[clamp(0.86rem,3.2vw,1rem)] text-slate-900 underline underline-offset-4"
                >
                  alber.ambroj@gmail.com
                </a>
                <a
                  href="mailto:aambroj@yahoo.es"
                  className="whitespace-nowrap font-semibold text-[clamp(0.86rem,3.2vw,1rem)] text-slate-900 underline underline-offset-4"
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