"use client";

import React, { useState } from "react";
import { deleteHive } from "@/actions/hive";
import { ConfirmModal } from "@/components/modals/ConfirmModal";

interface DeleteHiveButtonProps {
  hiveId: string;
}

export function DeleteHiveButton({ hiveId }: DeleteHiveButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteHive(hiveId);
    if (result && "error" in result) {
      alert(result.error);
      setIsDeleting(false);
      setShowConfirm(false);
    }
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
        isPending={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
