"use client";
import { Icon } from "@/components/ui/Icon";
import React, { useState, useTransition } from "react";
import { deleteInvite } from "@/actions/invite";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { toast } from "sonner";
import { useHiveContext } from "@/components/providers/HiveProviders";
import { Permissions } from "@/lib/permissions";

export function DeleteInviteButton({ 
  hiveId, 
  inviteId 
}: { 
  hiveId: string; 
  inviteId: string 
}) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const { role } = useHiveContext();

  if (!Permissions.canManageHive(role)) {
    return null;
  }

  const handleDelete = () => {
    // ✅ Close immediately
    setShowConfirm(false);

    startTransition(() => {
      toast.promise(
        (async () => {
          const result = await deleteInvite(hiveId, inviteId);
          if (result?.error) throw new Error(result.error);
        })(),
        {
          loading: "Revoking invite link…",
          success: "Invite link revoked!",
          error: (err: Error) => err.message || "Failed to revoke invite",
        }
      );
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
        <Icon name={isPending ? "sync" : "delete"} className={`text-[20px] ${isPending ? "animate-spin" : ""}`} />
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
