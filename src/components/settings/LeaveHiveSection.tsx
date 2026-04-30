"use client";

import React, { useState } from "react";
import { useHiveContext } from "@/components/providers/HiveProviders";
import { leaveHive } from "@/actions/hive";

export function LeaveHiveSection({ hiveId }: { hiveId: string }) {
  const { role } = useHiveContext();
  const [isLeaving, setIsLeaving] = useState(false);

  // Visible to MODERATOR, MEMBER, VIEWER, but NOT ADMIN
  if (role === "ADMIN") {
    return null;
  }

  const handleLeave = async () => {
    if (!confirm("Are you sure you want to leave this hive? You will lose access to all its content.")) {
      return;
    }
    
    setIsLeaving(true);
    const res = await leaveHive(hiveId);
    
    if (res?.error) {
      alert(res.error);
      setIsLeaving(false);
    }
    // If successful, the action will redirect to /dashboard
  };

  return (
    <section className="pt-8 border-t border-outline-variant/10">
      <div className="bg-surface-container-lowest rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-outline-variant/30">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-on-surface">Leave Hive</h3>
          <p className="text-on-surface-variant max-w-lg">
            Remove yourself from this hive. You will no longer have access to materials or announcements.
          </p>
        </div>
        <button
          onClick={handleLeave}
          disabled={isLeaving}
          className="px-6 py-2 rounded-full bg-error text-on-error font-medium transition-colors hover:bg-error/90 disabled:opacity-50 whitespace-nowrap"
        >
          {isLeaving ? "Leaving..." : "Leave Hive"}
        </button>
      </div>
    </section>
  );
}
