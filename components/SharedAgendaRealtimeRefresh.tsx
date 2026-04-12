"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type SharedAgendaRealtimeRefreshProps = {
  currentUserId: string;
  currentUserEmail: string;
};

function normalizeEmail(value: string | null | undefined) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function inviteBelongsToCurrentUser(
  record: Record<string, unknown> | null | undefined,
  currentUserId: string,
  currentUserEmail: string
) {
  if (!record) return false;

  const inviterUserId =
    typeof record.inviter_user_id === "string" ? record.inviter_user_id : "";
  const inviteeUserId =
    typeof record.invitee_user_id === "string" ? record.invitee_user_id : "";
  const inviterEmail = normalizeEmail(
    typeof record.inviter_email === "string" ? record.inviter_email : ""
  );
  const inviteeEmail = normalizeEmail(
    typeof record.invitee_email === "string" ? record.invitee_email : ""
  );

  return (
    inviterUserId === currentUserId ||
    inviteeUserId === currentUserId ||
    inviterEmail === currentUserEmail ||
    inviteeEmail === currentUserEmail
  );
}

function linkBelongsToCurrentUser(
  record: Record<string, unknown> | null | undefined,
  currentUserId: string
) {
  if (!record) return false;

  const userAId = typeof record.user_a_id === "string" ? record.user_a_id : "";
  const userBId = typeof record.user_b_id === "string" ? record.user_b_id : "";

  return userAId === currentUserId || userBId === currentUserId;
}

export default function SharedAgendaRealtimeRefresh({
  currentUserId,
  currentUserEmail,
}: SharedAgendaRealtimeRefreshProps) {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const refreshTimeoutRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  const [statusLabel, setStatusLabel] = useState("Tiempo real activado");
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    mountedRef.current = true;

    function queueRefresh(nextLabel: string) {
      if (!mountedRef.current) return;

      setStatusLabel(nextLabel);

      if (refreshTimeoutRef.current) {
        window.clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = window.setTimeout(() => {
        router.refresh();
      }, 250);
    }

    const invitesChannel = supabase
      .channel(`shared-agenda-invites-${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shared_agenda_invites",
        },
        (payload) => {
          const newRecord =
            payload.new && typeof payload.new === "object"
              ? (payload.new as Record<string, unknown>)
              : null;

          const oldRecord =
            payload.old && typeof payload.old === "object"
              ? (payload.old as Record<string, unknown>)
              : null;

          if (
            inviteBelongsToCurrentUser(newRecord, currentUserId, currentUserEmail) ||
            inviteBelongsToCurrentUser(oldRecord, currentUserId, currentUserEmail)
          ) {
            queueRefresh("Invitaciones actualizadas");
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsLive(true);
          setStatusLabel("Tiempo real activado");
        }
      });

    const linksChannel = supabase
      .channel(`shared-agenda-links-${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shared_agenda_links",
        },
        (payload) => {
          const newRecord =
            payload.new && typeof payload.new === "object"
              ? (payload.new as Record<string, unknown>)
              : null;

          const oldRecord =
            payload.old && typeof payload.old === "object"
              ? (payload.old as Record<string, unknown>)
              : null;

          if (
            linkBelongsToCurrentUser(newRecord, currentUserId) ||
            linkBelongsToCurrentUser(oldRecord, currentUserId)
          ) {
            queueRefresh("Conexiones actualizadas");
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsLive(true);
          setStatusLabel("Tiempo real activado");
        }
      });

    function handleVisibilityOrFocus() {
      if (document.visibilityState === "visible") {
        queueRefresh("Comprobando cambios...");
      }
    }

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      mountedRef.current = false;

      if (refreshTimeoutRef.current) {
        window.clearTimeout(refreshTimeoutRef.current);
      }

      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);

      supabase.removeChannel(invitesChannel);
      supabase.removeChannel(linksChannel);
    };
  }, [currentUserEmail, currentUserId, router, supabase]);

  return (
    <section className="rounded-3xl border border-sky-200 bg-sky-50 px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
            Actualización en vivo
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            Invitaciones y conexiones se refrescan solas sin necesidad de F5.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
              isLive
                ? "border border-emerald-200 bg-white text-emerald-700"
                : "border border-slate-200 bg-white text-slate-600"
            }`}
          >
            {isLive ? "En directo" : "Conectando..."}
          </span>

          <span className="inline-flex items-center rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-semibold text-sky-700">
            {statusLabel}
          </span>
        </div>
      </div>
    </section>
  );
}
