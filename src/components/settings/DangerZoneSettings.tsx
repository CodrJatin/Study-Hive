"use client";

import React from "react";
import { DeleteHiveButton } from "./DeleteHiveButton";
import { useHiveContext } from "@/components/providers/HiveProviders";
import { Permissions } from "@/lib/permissions";

export function DangerZoneSettings({ hiveId }: { hiveId: string }) {
  const { role } = useHiveContext();

  if (!Permissions.canManageHive(role)) {
    return null;
  }

  return (
    <section className="pt-8 border-t border-outline-variant/10">
      <div className="bg-error-container/30 dark:bg-error-container/50 rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-error/10">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-error">Danger Zone</h3>
          <p className="text-on-surface-variant max-w-lg">
            Deleting a hive is permanent. All notes, members, and collaborative progress will be erased forever.
          </p>
        </div>
        <DeleteHiveButton hiveId={hiveId} />
      </div>
    </section>
  );
}
