"use client";

import React, { useTransition } from "react";
import { removeMember } from "@/actions/hive";

export function RemoveMemberButton({
  hiveId,
  memberId,
}: {
  hiveId: string;
  memberId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    
    startTransition(async () => {
      const result = await removeMember(hiveId, memberId);
      if (result?.error) {
        alert(result.error);
      }
    });
  };

  return (
    <button
      onClick={handleRemove}
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
  );
}
