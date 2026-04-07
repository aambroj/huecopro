"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type AgendaAutoRefreshProps = {
  ownerIds: string[];
  intervalMs?: number;
};

export default function AgendaAutoRefresh({
  ownerIds,
  intervalMs = 3000,
}: AgendaAutoRefreshProps) {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const safeOwnerIds = useMemo(() => {
    return [...new Set(ownerIds.map((value) => value?.trim()).filter(Boolean))].sort();
  }, [ownerIds]);

  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (safeOwnerIds.length === 0) {
      return;
    }

    function scheduleRefresh() {
      if (refreshTimeoutRef.current) {
        return;
      }

      refreshTimeoutRef.current = setTimeout(() => {
        refreshTimeoutRef.current = null;
        router.refresh();
      }, 150);
    }

    const channel = supabase.channel(
      `agenda-sync:${safeOwnerIds.join("|")}`
    );

    for (const ownerId of safeOwnerIds) {
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trabajos",
          filter: `user_id=eq.${ownerId}`,
        },
        () => {
          scheduleRefresh();
        }
      );
    }

    channel.subscribe();

    const intervalId = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        return;
      }

      router.refresh();
    }, intervalMs);

    return () => {
      clearInterval(intervalId);

      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      channel.unsubscribe();
    };
  }, [intervalMs, router, safeOwnerIds, supabase]);

  return null;
}