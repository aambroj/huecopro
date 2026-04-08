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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900">
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <PublicSiteFooter />
        </div>
      </body>
    </html>
  );
}