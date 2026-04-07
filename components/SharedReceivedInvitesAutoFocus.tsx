"use client";

import { useEffect, useMemo, useRef } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type SharedReceivedInvitesAutoFocusProps = {
  userEmail: string;
};

function normalizeEmail(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

export default function SharedReceivedInvitesAutoFocus({
  userEmail,
}: SharedReceivedInvitesAutoFocusProps) {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const normalizedUserEmail = normalizeEmail(userEmail);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!normalizedUserEmail) return;

    function focusReceivedInvitesSection() {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const section = document.getElementById("invitaciones-recibidas");

        if (!section) return;

        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        section.classList.add("ring-2", "ring-emerald-300", "ring-offset-2");

        if (highlightTimeoutRef.current) {
          clearTimeout(highlightTimeoutRef.current);
        }

        highlightTimeoutRef.current = setTimeout(() => {
          section.classList.remove(
            "ring-2",
            "ring-emerald-300",
            "ring-offset-2"
          );
        }, 4500);
      }, 180);
    }

    const channel = supabase.channel(
      `received-invites-autofocus:${normalizedUserEmail}`
    );

    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "shared_agenda_invites",
      },
      (payload) => {
        const invite = (payload.new ?? {}) as {
          invitee_email?: string | null;
          status?: string | null;
        };

        const inviteeEmail = normalizeEmail(invite.invitee_email);
        const status = (invite.status ?? "").trim().toLowerCase();

        if (inviteeEmail !== normalizedUserEmail) return;
        if (status !== "pending") return;

        focusReceivedInvitesSection();
      }
    );

    channel.subscribe();

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }

      supabase.removeChannel(channel);
    };
  }, [normalizedUserEmail, supabase]);

  return null;
}