"use client";

import React, { useState, useTransition } from "react";
import { deleteInvite } from "@/actions/invite";
import { ConfirmModal } from "@/components/modals/ConfirmModal";

export function DeleteInviteButton({ 
  hiveId, 
  inviteId 
}: { 
  hiveId: string; 
  inviteId: string 
}) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteInvite(hiveId, inviteId);
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
        title="Revoke invite link"
      >
        <span className={`material-symbols-outlined text-[20px] ${isPending ? "animate-spin" : ""}`}>
          {isPending ? "progress_activity" : "delete"}
        </span>
      </button>

      <ConfirmModal
        isOpen={showConfirm}
        title="Revoke Invite Link"
        message="Are you sure you want to revoke this invite link? This action cannot be undone."
        confirmText="Revoke"
        isPending={isPending}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
