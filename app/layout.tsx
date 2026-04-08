import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PublicSiteFooter from "@/components/PublicSiteFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AutonomoAgenda | La agenda más simple para autónomos",
    template: "%s | AutonomoAgenda",
  },
  description:
    "Agenda simple y visual para autónomos de reparaciones, electricistas, fontaneros, instalaciones y reformas. Detecta huecos libres, encaja trabajos y organiza tu jornada sin complicaciones.",
  applicationName: "AutonomoAgenda",
  keywords: [
    "agenda para autónomos",
    "agenda electricistas",
    "agenda fontaneros",
    "agenda reparaciones",
    "agenda instalaciones",
    "agenda reformas",
    "software autónomos",
    "organizar trabajos",
    "gestión de trabajos",
  ],
  openGraph: {
    title: "AutonomoAgenda | La agenda más simple para autónomos",
    description:
      "Agenda simple y visual para autónomos de reparaciones, electricistas, fontaneros, instalaciones y reformas.",
    type: "website",
    locale: "es_ES",
    siteName: "AutonomoAgenda",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutonomoAgenda | La agenda más simple para autónomos",
    description:
      "Agenda simple y visual para autónomos de reparaciones, electricistas, fontaneros, instalaciones y reformas.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}
    >
      <body className="min-h-screen bg-transparent text-slate-900 antialiased">
        <div className="relative flex min-h-screen flex-col">
          <div className="relative flex-1">{children}</div>
          <PublicSiteFooter />
        </div>
      </body>
    </html>
  );
}