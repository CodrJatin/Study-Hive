"use client";

import React, { useState, useCallback, useTransition, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { createMaterial } from "@/actions/materials";
import { MaterialType } from "@prisma/client";

interface DropzoneOverlayProps {
  hiveId?: string;
}

export function DropzoneOverlay({ hiveId }: DropzoneOverlayProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDrop = useCallback(
    async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (!e.dataTransfer?.files.length) return;
      const files = Array.from(e.dataTransfer.files);

      // Validate hiveId — if empty, it's a personal inbox upload
      const targetHiveId = hiveId && hiveId.trim() !== "" ? hiveId : undefined;
      if (!targetHiveId) {
        console.warn("Dropzone: hiveId is missing, saving to personal inbox.");
      }

      setIsUploading(true);
      const supabase = createClient();
      let successCount = 0;
      let lastError: string | null = null;

      for (const file of files) {
        try {
          setUploadStatus(`Uploading ${file.name}...`);
          const path = `${targetHiveId ?? "personal"}/${Date.now()}-${file.name}`;

          const { error: storageError } = await supabase.storage
            .from("hive-materials")
            .upload(path, file, { cacheControl: "3600", upsert: false });

          if (storageError) {
            console.error("Storage Error:", storageError);
            lastError = `Storage fail: ${file.name}`;
            continue;
          }

          const { data: publicData } = supabase.storage
            .from("hive-materials")
            .getPublicUrl(path);

          // Detect material type from MIME
          let type: MaterialType = MaterialType.LINK;
          if (file.type.includes("pdf")) type = MaterialType.PDF;
          else if (file.type.startsWith("image/")) type = MaterialType.IMAGE;
          else if (file.type.includes("video")) type = MaterialType.VIDEO;
          else if (file.type.includes("word") || file.type.includes("document"))
            type = MaterialType.DOC;

          setUploadStatus(`Saving ${file.name} to database...`);
          const result = await createMaterial(
            file.name.replace(/\.[^.]+$/, ""),
            type,
            targetHiveId,
            publicData.publicUrl,
            file.size
          );

          if (result?.error) {
            console.error("Database Error for", file.name, ":", result.error);
            lastError = result.error;
          } else {
            successCount++;
          }
        } catch (err: any) {
          console.error("Unexpected error during upload:", err);
          lastError = err.message || "Unknown error";
        }
      }

      // Final status check
      if (successCount === files.length) {
        setUploadStatus("Done!");
      } else if (successCount > 0) {
        setUploadStatus(`Partially saved (${successCount}/${files.length}). Error: ${lastError}`);
      } else {
        setUploadStatus(`Upload Failed: ${lastError ?? "Unknown error"}`);
      }

      // Reset state after a delay or if failed (allow user to see error)
      setTimeout(() => {
        if (successCount > 0 || !lastError) {
          setIsUploading(false);
          setUploadStatus(null);
        } else {
          // If purely failed, keep the error visible a bit longer
          setTimeout(() => {
            setIsUploading(false);
            setUploadStatus(null);
          }, 3000);
        }
      }, 1500);
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

  if (!isDragging && !isUploading) return null;

  return (
    <div className="fixed inset-0 pointer-events-auto z-100 flex items-center justify-center">
      <div className="absolute inset-4 rounded-4xl border-4 border-dashed border-primary/60 bg-primary/5 backdrop-blur-sm transition-all" />
      <div className="relative z-10 clay-card bg-surface-container-lowest rounded-3xl px-12 py-10 flex flex-col items-center gap-4 shadow-2xl">
        <span className={`material-symbols-outlined text-primary text-6xl ${isUploading && !uploadStatus?.includes("Error") && !uploadStatus?.includes("Failed") ? "animate-spin" : ""}`}>
          {isUploading ? "progress_activity" : "upload_file"}
        </span>
        <div className="text-center">
          <p className="text-xl font-headline font-bold text-on-surface">
            {isUploading ? "Processing..." : "Drop to Upload"}
          </p>
          <p className="text-sm text-on-surface-variant mt-1 max-w-xs">
            {uploadStatus ?? "Release to upload files"}
          </p>
        </div>
      </div>
    </div>
  );
}
