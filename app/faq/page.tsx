import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Preguntas frecuentes sobre AutonomoAgenda.",
};

const faqs = [
  {
    question: "¿Qué es AutonomoAgenda?",
    answer:
      "AutonomoAgenda es una agenda sencilla pensada para autónomos que necesitan ver rápido sus huecos libres, encajar trabajos y llevar un seguimiento claro del día a día.",
  },
  {
    question: "¿Para quién está pensada?",
    answer:
      "Está orientada sobre todo a profesionales de reparaciones, instalaciones, electricidad, fontanería, reformas y mantenimiento, aunque puede servir a otros autónomos que quieran una agenda visual y ligera.",
  },
  {
    question: "¿Puedo compartir mi agenda con otro profesional?",
    answer:
      "Sí. La aplicación permite compartir visibilidad de agenda entre profesionales conectados. La visualización de la agenda ajena es solo lectura y cualquiera de las dos partes puede dejar de compartir cuando quiera.",
  },
  {
    question: "¿Cada profesional necesita su propia cuenta?",
    answer:
      "Sí. Cada profesional trabaja con su propia cuenta y su propia agenda. El sistema de compartir no sustituye la cuenta personal de cada uno.",
  },
  {
    question: "¿Puedo editar la agenda del otro profesional?",
    answer:
      "No. La agenda compartida está pensada solo para consulta. Cada usuario mantiene el control de su propia agenda.",
  },
  {
    question: "¿Cómo recupero el acceso si olvido la contraseña?",
    answer:
      "Desde la pantalla de acceso puedes usar la opción de recuperación de contraseña. En AutonomoAgenda, el usuario de acceso es siempre el email con el que te registraste.",
  },
  {
    question: "¿Mi usuario es un nombre o un email?",
    answer:
      "Tu usuario es siempre tu email de acceso.",
  },
  {
    question: "¿Cuánto cuesta?",
    answer:
      "AutonomoAgenda quiere ser una herramienta económica y simple. La información comercial definitiva se mostrará de forma pública cuando el producto se abra completamente.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Información
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Preguntas frecuentes
          </h1>

          <p className="mt-4 max-w-3xl text-base text-slate-600 sm:text-lg">
            Respuestas rápidas sobre el funcionamiento general de
            AutonomoAgenda.
          </p>

          <div className="mt-8 grid gap-4">
            {faqs.map((item) => (
              <article
                key={item.question}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <h2 className="text-xl font-bold text-slate-900">
                  {item.question}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                  {item.answer}
                </p>
              </article>
            ))}
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