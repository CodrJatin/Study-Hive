"use client";

import { useRealtime } from "@/hooks/useRealtime";

export function AnnouncementRealtimeListener({ hiveId }: { hiveId: string }) {
  useRealtime("Announcement", { column: "hiveId", value: hiveId });
  return null;
}
