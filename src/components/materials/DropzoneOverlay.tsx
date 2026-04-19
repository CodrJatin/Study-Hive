"use client";

import React, { useState, useCallback, useTransition, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { createMaterial } from "@/actions/materials";
import { MaterialType } from "@prisma/client";

interface DropzoneOverlayProps {
  hiveId: string;
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

      setIsUploading(true);
      const supabase = createClient();

      for (const file of files) {
        setUploadStatus(`Uploading ${file.name}...`);
        const path = `${hiveId}/${Date.now()}-${file.name}`;

        const { error: storageError } = await supabase.storage
          .from("hive-materials")
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (storageError) {
          setUploadStatus(`Storage Error: ${file.name}`);
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

        // SEQUENTIAL: Await the database update before moving to next file or showing "Done"
        const result = await createMaterial(
          file.name.replace(/\.[^.]+$/, ""),
          type,
          hiveId,
          publicData.publicUrl,
          file.size
        );

        if (result?.error) {
          setUploadStatus(`Error: ${result.error}`);
          // Wait a bit so user can see it before potential next file
          await new Promise(r => setTimeout(r, 2000));
        }
      }

      // TRULY FINAL: "Done!" only after all files and DB calls are finished
      setUploadStatus("Done!");
      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus(null);
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
        <span className={`material-symbols-outlined text-primary text-6xl ${isUploading ? "animate-spin" : ""}`}>
          {isUploading ? "progress_activity" : "upload_file"}
        </span>
        <div className="text-center">
          <p className="text-xl font-headline font-bold text-on-surface">
            {isUploading ? "Processing..." : "Drop to Upload"}
          </p>
          <p className="text-sm text-on-surface-variant mt-1">
            {uploadStatus ?? "Release to upload files to this Hive"}
          </p>
        </div>
      </div>
    </div>
  );
}
