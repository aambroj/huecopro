"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type SharedInvitesRealtimeNoticeProps = {
  userEmail: string;
};

type NoticeTone = "sky" | "emerald" | "amber";

type NoticeState = {
  message: string;
  tone: NoticeTone;
} | null;

type InvitePayloadRow = {
  id?: string;
  inviter_user_id?: string | null;
  inviter_email?: string | null;
  invitee_email?: string | null;
  status?: string | null;
};

type LinkPayloadRow = {
  id?: string;
  user_a_id?: string | null;
  user_b_id?: string | null;
  is_active?: boolean | null;
};

function normalizeEmail(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function getNoticeClasses(tone: NoticeTone) {
  if (tone === "emerald") {
    return "border-emerald-200/90 bg-white/90";
  }

  if (tone === "amber") {
    return "border-amber-200/90 bg-white/90";
  }

  return "border-sky-200/90 bg-white/90";
}

function getDotClasses(tone: NoticeTone) {
  if (tone === "emerald") {
    return "bg-emerald-500";
  }

  if (tone === "amber") {
    return "bg-amber-500";
  }

  return "bg-sky-500";
}

function getPillClasses(tone: NoticeTone) {
  if (tone === "emerald") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (tone === "amber") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-sky-200 bg-sky-50 text-sky-700";
}

function getPillLabel(tone: NoticeTone) {
  if (tone === "emerald") return "Correcto";
  if (tone === "amber") return "Atención";
  return "Nuevo";
}

export default function SharedInvitesRealtimeNotice({
  userEmail,
}: SharedInvitesRealtimeNoticeProps) {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const normalizedUserEmail = normalizeEmail(userEmail);

  const [notice, setNotice] = useState<NoticeState>(null);

  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noticeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

      function scheduleRefresh() {
        if (refreshTimeoutRef.current) return;

        refreshTimeoutRef.current = setTimeout(() => {
          refreshTimeoutRef.current = null;
          router.refresh();
        }, 150);
      }

      function showNotice(message: string, tone: NoticeTone) {
        setNotice({ message, tone });

        if (noticeTimeoutRef.current) {
          clearTimeout(noticeTimeoutRef.current);
        }

        noticeTimeoutRef.current = setTimeout(() => {
          setNotice(null);
        }, 5000);
      }

      const channel = supabase.channel(
        `shared-invites-notice:${currentUserId}:${currentUserEmail}`
      );

      channel.on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "shared_agenda_invites",
        },
        (payload) => {
          const invite = (payload.new ?? {}) as InvitePayloadRow;
          const inviteeEmail = normalizeEmail(invite.invitee_email);
          const inviterEmail = normalizeEmail(invite.inviter_email);
          const status = (invite.status ?? "").trim().toLowerCase();

          if (inviteeEmail === currentUserEmail && status === "pending") {
            showNotice(
              inviterEmail
                ? `Nueva invitación recibida de ${inviterEmail}.`
                : "Nueva invitación recibida.",
              "sky"
            );
            scheduleRefresh();
            return;
          }

          if (inviterEmail === currentUserEmail) {
            scheduleRefresh();
          }
        }
      );

      channel.on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "shared_agenda_invites",
        },
        (payload) => {
          const nextInvite = (payload.new ?? {}) as InvitePayloadRow;
          const prevInvite = (payload.old ?? {}) as InvitePayloadRow;

          const nextInviteeEmail = normalizeEmail(nextInvite.invitee_email);
          const nextInviterEmail = normalizeEmail(nextInvite.inviter_email);
          const nextStatus = (nextInvite.status ?? "").trim().toLowerCase();
          const prevStatus = (prevInvite.status ?? "").trim().toLowerCase();

          const affectsCurrentUser =
            nextInviteeEmail === currentUserEmail ||
            nextInviterEmail === currentUserEmail;

          if (affectsCurrentUser) {
            scheduleRefresh();
          }

          if (
            nextInviterEmail === currentUserEmail &&
            prevStatus === "pending" &&
            nextStatus === "accepted"
          ) {
            const otherLabel =
              nextInviteeEmail && nextInviteeEmail !== currentUserEmail
                ? nextInviteeEmail
                : "el otro profesional";

            showNotice(
              `${otherLabel} ha aceptado la invitación. Ya podéis veros las agendas.`,
              "emerald"
            );
            return;
          }

          if (
            nextInviterEmail === currentUserEmail &&
            prevStatus === "pending" &&
            nextStatus === "rejected"
          ) {
            const otherLabel =
              nextInviteeEmail && nextInviteeEmail !== currentUserEmail
                ? nextInviteeEmail
                : "el otro profesional";

            showNotice(`${otherLabel} ha rechazado la invitación.`, "amber");
            return;
          }

          if (
            nextInviteeEmail === currentUserEmail &&
            prevStatus === "pending" &&
            nextStatus === "cancelled"
          ) {
            showNotice("La invitación recibida ha sido cancelada.", "amber");
          }
        }
      );

      channel.on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "shared_agenda_links",
        },
        (payload) => {
          const nextLink = (payload.new ?? {}) as LinkPayloadRow;
          const prevLink = (payload.old ?? {}) as LinkPayloadRow;

          const affectsCurrentUser =
            nextLink.user_a_id === currentUserId ||
            nextLink.user_b_id === currentUserId ||
            prevLink.user_a_id === currentUserId ||
            prevLink.user_b_id === currentUserId;

          if (!affectsCurrentUser) return;

          scheduleRefresh();

          if (prevLink.is_active === true && nextLink.is_active === false) {
            showNotice(
              "La conexión compartida se ha desactivado. Ya no podéis veros las agendas.",
              "amber"
            );
          }
        }
      );

      channel.subscribe();

      cleanupRealtime = () => {
        supabase.removeChannel(channel);
      };
    }

    setupRealtime();

    return () => {
      isMounted = false;

      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      if (noticeTimeoutRef.current) {
        clearTimeout(noticeTimeoutRef.current);
      }

      if (cleanupRealtime) {
        cleanupRealtime();
      }
    };
  }, [normalizedUserEmail, router, supabase]);

  if (!notice) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-[100] w-[calc(100%-2rem)] max-w-md rounded-[2rem] border p-4 shadow-[0_24px_70px_rgba(15,23,42,0.20)] backdrop-blur-xl ${getNoticeClasses(
        notice.tone
      )}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex shrink-0 flex-col items-center pt-1">
          <div
            className={`h-3 w-3 rounded-full shadow-sm ${getDotClasses(
              notice.tone
            )}`}
          />
          <div className="mt-2 h-full w-px bg-slate-200" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-slate-900">Aviso en tiempo real</p>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getPillClasses(
                notice.tone
              )}`}
            >
              {getPillLabel(notice.tone)}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {notice.message}
          </p>
        </div>
      </div>
    </div>
  );
}