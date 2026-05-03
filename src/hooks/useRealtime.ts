"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function useRealtime(
  tableName: string,
  filterColumn?: string,
  filterValue?: string,
  /** Explicit channel key — must be stable across renders (no random values). */
  channelKey?: string,
) {
  const router = useRouter();
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_REALTIME === "true";

  // Derive a deterministic channel name from primitives so the effect dependency
  // array is stable and never triggers an extra subscribe/unsubscribe cycle.
  const key = channelKey ?? `rt-${tableName}-${filterColumn ?? "all"}-${filterValue ?? "all"}`;
  const filter =
    filterColumn && filterValue ? `${filterColumn}=eq.${filterValue}` : undefined;

  useEffect(() => {
    if (!isEnabled) return;

    const supabase = createClient();
    const channel = supabase
      .channel(key)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName, filter },
        () => {
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // All deps are primitives — stable across renders.
  }, [key, tableName, filter, isEnabled, router]);
}