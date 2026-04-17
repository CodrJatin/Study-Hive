"use client";

import React, { useState } from "react";
import { deleteHive } from "@/actions/hive";

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

  if (showConfirm) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm font-bold text-error">Are you absolutely sure?</p>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-error text-on-error px-6 py-2 rounded-full font-bold hover:bg-opacity-80 transition-all disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
            className="bg-surface-container-high text-on-surface px-6 py-2 rounded-full font-bold hover:bg-surface-container-highest transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="bg-error text-on-error px-8 py-3 rounded-full font-bold hover:bg-opacity-80 transition-transform active:scale-95 whitespace-nowrap"
    >
      Delete Hive
    </button>
  );
}
