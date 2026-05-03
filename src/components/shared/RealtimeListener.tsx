"use client";

import { useRealtime } from "@/hooks/useRealtime";

interface RealtimeListenerProps {
  tableName: string;
  /** Filter column name — must be a column on `tableName`, not a join. */
  filterColumn?: string;
  /** Filter value (primitive). */
  filterValue?: string;
  /** Optional explicit channel key. Defaults to a deterministic key derived from the other props. */
  channelKey?: string;
}

export function RealtimeListener({
  tableName,
  filterColumn,
  filterValue,
  channelKey,
}: RealtimeListenerProps) {
  useRealtime(tableName, filterColumn, filterValue, channelKey);
  return null;
}
