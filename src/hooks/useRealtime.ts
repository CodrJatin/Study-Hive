import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useRealtime<T extends { id: string | number }>(
  tableName: string,
  initialData: T[],
  filter?: { column: string; value: string | number }
) {
  const [data, setData] = useState<T[]>(initialData);
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_REALTIME === "true";

  useEffect(() => {
    // If global toggle is off, don't subscribe
    if (!isEnabled) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`realtime-${tableName}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for INSERT, UPDATE, and DELETE
          schema: "public",
          table: tableName,
          filter: filter ? `${filter.column}=eq.${filter.value}` : undefined,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setData((prev) => [payload.new as unknown as T, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setData((prev) =>
              prev.map((item) =>
                item.id === (payload.new as T).id ? (payload.new as unknown as T) : item
              )
            );
          } else if (payload.eventType === "DELETE") {
            setData((prev) =>
              prev.filter((item) => item.id !== (payload.old as T).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, isEnabled, filter?.value, filter?.column]);

  return data;
}
