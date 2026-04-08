"use client";

import { useEffect, useMemo, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

function isIOSDevice() {
  if (typeof window === "undefined") return false;

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform?.toLowerCase() ?? "";

  const isIPhoneOrIPad =
    /iphone|ipad|ipod/.test(userAgent) ||
    (platform === "macintel" && window.navigator.maxTouchPoints > 1);

  return isIPhoneOrIPad;
}

function isStandaloneMode() {
  if (typeof window === "undefined") return false;

  const byMediaQuery = window.matchMedia?.("(display-mode: standalone)")
    ?.matches;
  const byNavigator = Boolean(
    (window.navigator as Navigator & { standalone?: boolean }).standalone
  );

  return Boolean(byMediaQuery || byNavigator);
}

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<InstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);
  const [busy, setBusy] = useState(false);

  const ios = useMemo(() => isIOSDevice(), []);

  useEffect(() => {
    setIsInstalled(isStandaloneMode());

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as InstallPromptEvent);
    }

    function handleAppInstalled() {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowIOSHelp(false);
    }

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (isInstalled) return;

    if (deferredPrompt) {
      setBusy(true);

      try {
        await deferredPrompt.prompt();
        await deferredPrompt.userChoice;
      } finally {
        setDeferredPrompt(null);
        setBusy(false);
      }

      return;
    }

    if (ios) {
      setShowIOSHelp((current) => !current);
      return;
    }

    setShowIOSHelp((current) => !current);
  }

  if (isInstalled) {
    return null;
  }

  return (
    <div className="w-full sm:w-auto">
      <button
        type="button"
        onClick={handleInstall}
        className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-base font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto"
      >
        {busy ? "Abriendo instalación..." : "Instalar app"}
      </button>

      {showIOSHelp ? (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left text-sm leading-6 text-slate-700 shadow-sm">
          {ios ? (
            <>
              <p className="font-semibold text-slate-900">
                Instalación en iPhone o iPad
              </p>
              <p className="mt-2">
                Abre AutonomoAgenda en <span className="font-semibold">Safari</span>,
                pulsa <span className="font-semibold">Compartir</span> y luego{" "}
                <span className="font-semibold">
                  Añadir a pantalla de inicio
                </span>
                .
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-slate-900">
                Instalación desde el navegador
              </p>
              <p className="mt-2">
                Si no aparece el cuadro automático, abre el menú del navegador y
                busca <span className="font-semibold">Instalar aplicación</span>{" "}
                o <span className="font-semibold">Añadir a pantalla de inicio</span>.
              </p>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}