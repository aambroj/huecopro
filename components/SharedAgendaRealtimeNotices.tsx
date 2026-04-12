"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type SharedAgendaRealtimeNoticesProps = {
  currentUserId: string;
  currentUserEmail: string;
};

type NoticeItem = {
  id: number;
  title: string;
  description: string;
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

function buildInviteNotice(
  payloadType: "INSERT" | "UPDATE" | "DELETE",
  record: Record<string, unknown> | null | undefined,
  currentUserId: string
): NoticeItem | null {
  if (!record) return null;

  const inviterUserId =
    typeof record.inviter_user_id === "string" ? record.inviter_user_id : "";
  const inviteeEmail =
    typeof record.invitee_email === "string" ? record.invitee_email : "otro profesional";
  const status = typeof record.status === "string" ? record.status : "";

  const isOwnOutgoingInvite = inviterUserId === currentUserId;

  if (payloadType == "INSERT") {
    return isOwnOutgoingInvite
      ? {
          id: Date.now(),
          title: "Invitación enviada",
          description: `Se ha enviado una invitación a ${inviteeEmail}.`,
        }
      : {
          id: Date.now(),
          title: "Nueva invitación",
          description: "Has recibido una invitación para compartir agenda.",
        };
  }

  if (payloadType == "UPDATE") {
    if (status === "accepted") {
      return {
        id: Date.now(),
        title: "Invitación aceptada",
        description: "Ya podéis ver la agenda del otro en solo lectura.",
      };
    }

    if (status === "rejected") {
      return {
        id: Date.now(),
        title: "Invitación rechazada",
        description: "La invitación ha sido rechazada.",
      };
    }

    if (status === "cancelled") {
      return {
        id: Date.now(),
        title: "Invitación cancelada",
        description: "La invitación ya no está activa.",
      };
    }

    return {
      id: Date.now(),
      title: "Invitación actualizada",
      description: "Ha cambiado el estado de una invitación.",
    };
  }

  return {
    id: Date.now(),
    title: "Invitación eliminada",
    description: "Una invitación ha dejado de estar disponible.",
  };
}

function buildLinkNotice(): NoticeItem {
  return {
    id: Date.now(),
    title: "Conexión actualizada",
    description: "Se ha actualizado una conexión compartida.",
  };
}

export default function SharedAgendaRealtimeNotices({
  currentUserId,
  currentUserEmail,
}: SharedAgendaRealtimeNoticesProps) {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [notice, setNotice] = useState<NoticeItem | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function showNotice(nextNotice: NoticeItem | null) {
      if (!nextNotice) return;

      setNotice(nextNotice);

      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }

      hideTimeoutRef.current = window.setTimeout(() => {
        setNotice(null);
      }, 4500);
    }

    const invitesChannel = supabase
      .channel(`shared-agenda-notices-invites-${currentUserId}`)
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
            const eventType =
              payload.eventType === "INSERT" ||
              payload.eventType === "UPDATE" ||
              payload.eventType === "DELETE"
                ? payload.eventType
                : "UPDATE";

            showNotice(
              buildInviteNotice(
                eventType,
                newRecord ?? oldRecord,
                currentUserId
              )
            );
          }
        }
      )
      .subscribe();

    const linksChannel = supabase
      .channel(`shared-agenda-notices-links-${currentUserId}`)
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
            showNotice(buildLinkNotice());
          }
        }
      )
      .subscribe();

    return () => {
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }

      supabase.removeChannel(invitesChannel);
      supabase.removeChannel(linksChannel);
    };
  }, [currentUserEmail, currentUserId, supabase]);

  if (!notice) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:right-4 sm:w-[380px]">
      <div className="pointer-events-auto rounded-3xl border border-sky-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
              Aviso en tiempo real
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {notice.title}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {notice.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNotice(null)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            aria-label="Cerrar aviso"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
