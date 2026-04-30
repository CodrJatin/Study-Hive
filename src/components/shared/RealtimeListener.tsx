"use client";

import { useRealtime } from "@/hooks/useRealtime";

interface RealtimeListenerProps {
  tableName: string;
  filter?: {
    column: string;
    value: string | number;
  };
}

export function RealtimeListener({ tableName, filter }: RealtimeListenerProps) {
  useRealtime(tableName, filter);
  return null;
}
