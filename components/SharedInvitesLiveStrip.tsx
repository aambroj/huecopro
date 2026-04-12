"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type SharedInvitesLiveStripProps = {
  userEmail: string;
};

type LiveState = "connecting" | "live";

function normalizeEmail(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

export default function SharedInvitesLiveStrip({
  userEmail,
}: SharedInvitesLiveStripProps) {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const normalizedUserEmail = normalizeEmail(userEmail);

  const [liveState, setLiveState] = useState<LiveState>("connecting");
  const [lastLabel, setLastLabel] = useState("Conectando tiempo real...");
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isMounted = true;
    let cleanupRealtime: (() => void) | undefined;

    async function setupRealtime() {
      if (!normalizedUserEmail) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const currentUserId = user?.id ?? "";
      const currentUserEmail = normalizeEmail(user?.email ?? normalizedUserEmail);

      if (!isMounted || !currentUserId || !currentUserEmail) {
        return;
      }

      function pulse(label: string) {
        setLiveState("live");
        setLastLabel(label);

        if (resetTimeoutRef.current) {
          clearTimeout(resetTimeoutRef.current);
        }

        resetTimeoutRef.current = setTimeout(() => {
          setLastLabel("Todo al día");
        }, 3500);
      }

      const channel = supabase.channel(
        `shared-invites-live-strip:${currentUserId}:${currentUserEmail}`
      );

      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shared_agenda_invites",
        },
        () => {
          pulse("Movimiento en invitaciones");
        }
      );

      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shared_agenda_links",
        },
        () => {
          pulse("Movimiento en conexiones");
        }
      );

      channel.subscribe((status) => {
        if (!isMounted) return;

        if (status === "SUBSCRIBED") {
          setLiveState("live");
          setLastLabel("Todo al día");
        }
      });

      cleanupRealtime = () => {
        supabase.removeChannel(channel);
      };
    }

    setupRealtime();

    return () => {
      isMounted = false;

      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }

      if (cleanupRealtime) {
        cleanupRealtime();
      }
    };
  }, [normalizedUserEmail, supabase]);

  return (
    <section className="rounded-3xl border border-sky-200 bg-sky-50 px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
            Compartir en directo
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            Invitaciones y conexiones se actualizan solas en esta pantalla.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${
              liveState === "live"
                ? "border-emerald-200 bg-white text-emerald-700"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            {liveState === "live" ? "En directo" : "Conectando..."}
          </span>

          <span className="inline-flex items-center rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-semibold text-sky-700">
            {lastLabel}
          </span>
        </div>
      </div>
    </section>
  );
}
