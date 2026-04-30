"use client";

import React, { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { createMaterial } from "@/actions/materials";
import { MaterialType } from "@prisma/client";
import { HiveContext } from "@/components/providers/HiveProviders";
import { Permissions } from "@/lib/permissions";
import { useContext } from "react";

interface DropzoneOverlayProps {
  hiveId?: string;
}

import { ConfirmUploadModal } from "@/components/modals/ConfirmUploadModal";
import { uploadFiles } from "@/utils/upload-utils";

export function DropzoneOverlay({ hiveId }: DropzoneOverlayProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState<File[] | null>(null);
  const hiveContext = useContext(HiveContext);

  const canUpload = hiveId 
    ? (hiveContext ? Permissions.canAddItems(hiveContext.role) : false) 
    : true;

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (!canUpload) return; // Respect permissions

      if (!e.dataTransfer?.files.length) return;
      const files = Array.from(e.dataTransfer.files);
      setDroppedFiles(files);
    },
    [canUpload]
  );

  const confirmUpload = () => {
    if (!droppedFiles) return;
    const files = droppedFiles;
    setDroppedFiles(null);

    const partial = () =>
      (globalThis as { __lastUploadPartial?: { successCount: number; total: number } })
        .__lastUploadPartial;

    toast.promise(uploadFiles(files, hiveId), {
      loading: files.length === 1
        ? `Uploading "${files[0].name}"…`
        : `Uploading ${files.length} files…`,
      success: () => {
        const p = partial();
        if (p && p.successCount < p.total) {
          return `Uploaded ${p.successCount} of ${p.total} files (some failed)`;
        }
        return files.length === 1
          ? `"${files[0].name}" added!`
          : `${files.length} files added!`;
      },
      error: (err: Error) => err.message || "Upload failed",
    });
  };

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (canUpload) setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.relatedTarget === null) setIsDragging(false);
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, [handleDrop, canUpload]);

  if (droppedFiles && droppedFiles.length > 0) {
    return (
      <ConfirmUploadModal 
        files={droppedFiles}
        onConfirm={confirmUpload}
        onCancel={() => setDroppedFiles(null)}
      />
    );
  }

  if (!canUpload) return null;
  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-100 flex items-center justify-center">
      <div className="absolute inset-4 rounded-[2.5rem] border-4 border-dashed border-primary/60 bg-primary/5 backdrop-blur-sm transition-all animate-in fade-in duration-150" />
      <div className="relative z-10 clay-card bg-surface-container-lowest rounded-3xl px-12 py-10 flex flex-col items-center gap-4 shadow-2xl animate-in zoom-in-95 duration-150">
        <span className="material-symbols-outlined text-primary text-6xl">
          upload_file
        </span>
        <div className="text-center">
          <p className="text-xl font-headline font-bold text-on-surface">Drop to Upload</p>
          <p className="text-sm text-on-surface-variant mt-1 max-w-xs">
            Release to upload files to your hive
          </p>
        </div>
      </div>
    </div>
  );
}

