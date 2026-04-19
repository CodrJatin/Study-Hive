"use client";

import React, { useTransition } from "react";
import { deleteInvite } from "@/actions/invite";

export function DeleteInviteButton({ 
  hiveId, 
  inviteId 
}: { 
  hiveId: string; 
  inviteId: string 
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to revoke this invite link?")) return;

    startTransition(async () => {
      const result = await deleteInvite(hiveId, inviteId);
      if (result?.error) {
        alert(result.error);
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-colors ${
        isPending ? "opacity-50 cursor-not-allowed" : ""
      }`}
      title="Revoke invite link"
    >
      <span className={`material-symbols-outlined text-[20px] ${isPending ? "animate-spin" : ""}`}>
        {isPending ? "progress_activity" : "delete"}
      </span>
    </button>
  );
}
