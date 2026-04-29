"use client";

import React, { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { createMaterial } from "@/actions/materials";
import { MaterialType } from "@prisma/client";

interface DropzoneOverlayProps {
  hiveId?: string;
}

// ─── Upload helper (returns a Promise so toast.promise can track it) ───────────
async function uploadFiles(files: File[], hiveId: string | undefined): Promise<void> {
  const supabase = createClient();
  const targetHiveId = hiveId && hiveId.trim() !== "" ? hiveId : undefined;

  let successCount = 0;
  let lastError: string | null = null;

  for (const file of files) {
    try {
      const path = `${targetHiveId ?? "personal"}/${Date.now()}-${file.name}`;

      const { error: storageError } = await supabase.storage
        .from("hive-materials")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (storageError) {
        lastError = `Storage error on "${file.name}": ${storageError.message}`;
        continue;
      }

      const { data: publicData } = supabase.storage
        .from("hive-materials")
        .getPublicUrl(path);

      let type: MaterialType = MaterialType.LINK;
      if (file.type.includes("pdf")) type = MaterialType.PDF;
      else if (file.type.startsWith("image/")) type = MaterialType.IMAGE;
      else if (file.type.includes("video")) type = MaterialType.VIDEO;
      else if (file.type.includes("word") || file.type.includes("document"))
        type = MaterialType.DOC;

      const result = await createMaterial(
        file.name.replace(/\.[^.]+$/, ""),
        type,
        targetHiveId,
        publicData.publicUrl,
        file.size
      );

      if (result?.error) {
        lastError = result.error;
      } else {
        successCount++;
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : "Unknown error";
    }
  }

  if (successCount === 0) {
    throw new Error(lastError ?? "All uploads failed");
  }

  // Partial success — still resolves, but the toast message reflects it
  if (lastError) {
    // We resolve so toast.promise shows "success", but with a note in the message
    // The caller handles partial messaging via successMessage function
    (globalThis as { __lastUploadPartial?: { successCount: number; total: number } }).__lastUploadPartial = {
      successCount,
      total: files.length,
    };
  }
}

export function DropzoneOverlay({ hiveId }: DropzoneOverlayProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // ✅ Immediately reset drag state — the user can drag another file right away
      setIsDragging(false);

      if (!e.dataTransfer?.files.length) return;
      const files = Array.from(e.dataTransfer.files);

      const partial = () =>
        (globalThis as { __lastUploadPartial?: { successCount: number; total: number } })
          .__lastUploadPartial;

      // ✅ Fire-and-forget: toast.promise runs the upload in the background
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
    },
    [hiveId]
  );

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
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
  }, [handleDrop]);

  // ✅ Only shows the visual target when dragging — disappears the moment files are dropped
  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
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
