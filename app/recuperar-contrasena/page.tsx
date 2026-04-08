import type { Metadata } from "next";
import RecuperarContrasenaPageClient from "./RecuperarContrasenaPageClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Recuperar contraseña | AutonomoAgenda",
  description:
    "Recupera el acceso a tu cuenta de AutonomoAgenda y crea una contraseña nueva para volver a entrar a tu agenda de trabajo.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Recuperar contraseña | AutonomoAgenda",
    description:
      "Recupera el acceso a tu cuenta de AutonomoAgenda y crea una contraseña nueva para volver a entrar a tu agenda de trabajo.",
    type: "website",
    locale: "es_ES",
    siteName: "AutonomoAgenda",
  },
  twitter: {
    card: "summary",
    title: "Recuperar contraseña | AutonomoAgenda",
    description:
      "Recupera el acceso a tu cuenta de AutonomoAgenda y crea una contraseña nueva para volver a entrar a tu agenda de trabajo.",
  },
};

export default function RecuperarContrasenaPage() {
  return <RecuperarContrasenaPageClient />;
}