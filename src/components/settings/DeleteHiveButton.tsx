"use client";

import React, { useState, useTransition } from "react";
import { deleteHive } from "@/actions/hive";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { toast } from "sonner";

interface DeleteHiveButtonProps {
  hiveId: string;
}

export function DeleteHiveButton({ hiveId }: DeleteHiveButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    // ✅ Close immediately
    setShowConfirm(false);

    startTransition(() => {
      toast.promise(
        (async () => {
          try {
            const result = await deleteHive(hiveId);
            if (result && "error" in result && result.error) throw new Error(result.error);
          } catch (err: unknown) {
            // Next.js redirect() throws a special error that we should ignore here
            if (err instanceof Error && err.message?.includes("NEXT_REDIRECT")) return;
            throw err;
          }
        })(),
        {
          loading: "Deleting hive…",
          success: "Hive deleted successfully!",
          error: (err: Error) => err.message || "Failed to delete hive",
        }
      );
    });
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="bg-error text-on-error px-8 py-3 rounded-full font-bold hover:bg-opacity-80 transition-transform active:scale-95 whitespace-nowrap"
      >
        Delete Hive
      </button>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Hive"
        message="Are you absolutely sure you want to delete this hive? All tracks, units, and materials will be permanently removed."
        confirmText="Yes, Delete"
        isPending={isPending}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
