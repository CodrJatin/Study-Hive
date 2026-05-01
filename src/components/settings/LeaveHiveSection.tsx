"use client";

import React, { useState } from "react";
import { useHiveContext } from "@/components/providers/HiveProviders";
import { leaveHive } from "@/actions/hive";
import { ConfirmModal } from "@/components/modals/ConfirmModal";

export function LeaveHiveSection({ hiveId }: { hiveId: string }) {
  const { role } = useHiveContext();
  const [isLeaving, setIsLeaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Visible to MODERATOR, MEMBER, VIEWER, but NOT ADMIN
  if (role === "ADMIN") {
    return null;
  }

  const handleLeave = async () => {
    setIsLeaving(true);
    const res = await leaveHive(hiveId);
    
    if (res?.error) {
      alert(res.error);
      setIsLeaving(false);
      setShowConfirm(false);
    }
    // If successful, the action will redirect to /dashboard
  };

  return (
    <>
      <ConfirmModal
        isOpen={showConfirm}
        title="Leave Hive"
        message="Are you sure you want to leave this hive? You will lose access to all its content."
        confirmText="Leave Hive"
        isDestructive={true}
        isPending={isLeaving}
        onConfirm={handleLeave}
        onCancel={() => setShowConfirm(false)}
      />

      <section className="pt-8 border-t border-outline-variant/10">
        <div className="bg-surface-container-lowest rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-outline-variant/30">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-on-surface">Leave Hive</h3>
            <p className="text-on-surface-variant max-w-lg">
              Remove yourself from this hive. You will no longer have access to materials or announcements.
            </p>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isLeaving}
            className="px-6 py-2 rounded-full bg-error text-on-error font-medium transition-colors hover:bg-error/90 disabled:opacity-50 whitespace-nowrap"
          >
            Leave Hive
          </button>
        </div>
      </section>
    </>
  );
}
