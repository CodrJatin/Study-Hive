"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function useRealtime(tableName: string, filter?: { column: string; value: string | number }) {
  const router = useRouter();
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_REALTIME === "true";

  useEffect(() => {
    if (!isEnabled) {
      console.log("Realtime is disabled via ENV");
      return;
    }

    const supabase = createClient();
    console.log(`Subscribing to ${tableName}...`);

    const channelName = `realtime-${tableName}-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: tableName,
          filter: (filter?.column && filter?.value) ? `${filter.column}=eq.${filter.value}` : undefined,
        },
        (payload) => {
          console.log("CHANGE DETECTED!", payload);
          router.refresh();
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for ${tableName}:`, status);
      });

    return () => {
      console.log(`Unsubscribing from ${tableName}`);
      supabase.removeChannel(channel);
    };
  }, [tableName, isEnabled, filter?.value, filter?.column, router]);
}