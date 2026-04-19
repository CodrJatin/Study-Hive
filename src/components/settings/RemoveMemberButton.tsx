"use client";

import React, { useState, useTransition } from "react";
import { removeMember } from "@/actions/hive";
import { ConfirmModal } from "@/components/modals/ConfirmModal";

export function RemoveMemberButton({
  hiveId,
  memberId,
}: {
  hiveId: string;
  memberId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeMember(hiveId, memberId);
      if (result?.error) {
        alert(result.error);
      }
      setShowConfirm(false);
    });
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className={`p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-colors ${
          isPending ? "opacity-50 cursor-not-allowed" : ""
        }`}
        title="Remove member"
      >
        <span className={`material-symbols-outlined text-[20px] ${isPending ? "animate-spin" : ""}`}>
          {isPending ? "progress_activity" : "person_remove"}
        </span>
      </button>

      <ConfirmModal
        isOpen={showConfirm}
        title="Remove Member"
        message="Are you sure you want to remove this member from the hive?"
        confirmText="Remove"
        isPending={isPending}
        onConfirm={handleRemove}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
