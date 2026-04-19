"use client";

import React, { useState, useCallback, useTransition } from "react";
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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only hide if leaving the window entirely
    if (e.relatedTarget === null) setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (!files.length) return;

      setIsUploading(true);
      const supabase = createClient();

      for (const file of files) {
        setUploadStatus(`Uploading ${file.name}...`);
        const path = `${hiveId}/${Date.now()}-${file.name}`;

        const { error } = await supabase.storage
          .from("hive-materials")
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (error) {
          setUploadStatus(`Failed: ${file.name}`);
          continue;
        }

        const { data: publicData } = supabase.storage
          .from("hive-materials")
          .getPublicUrl(path);

        // Detect material type from MIME
        let type = MaterialType.LINK;
        if (file.type.includes("pdf")) type = MaterialType.PDF;
        else if (file.type.includes("video")) type = MaterialType.VIDEO;
        else if (file.type.includes("word") || file.type.includes("document"))
          type = MaterialType.DOC;

        startTransition(async () => {
          await createMaterial(
            hiveId,
            file.name.replace(/\.[^.]+$/, ""),
            type,
            publicData.publicUrl,
            file.size
          );
        });
      }

      setUploadStatus("Done!");
      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus(null);
      }, 1500);
    },
    [hiveId, startTransition]
  );

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
    >
      {/* Full-page drag interception */}
      {isDragging && (
        <div
          className="fixed inset-0 pointer-events-auto z-[100] flex items-center justify-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="absolute inset-4 rounded-4xl border-4 border-dashed border-primary/60 bg-primary/5 backdrop-blur-sm transition-all" />
          <div className="relative z-10 clay-card bg-surface-container-lowest rounded-3xl px-12 py-10 flex flex-col items-center gap-4 shadow-2xl">
            <span className="material-symbols-outlined text-primary text-6xl">
              {isUploading ? "progress_activity" : "upload_file"}
            </span>
            <div className="text-center">
              <p className="text-xl font-headline font-bold text-on-surface">
                {isUploading ? "Uploading..." : "Drop to Upload"}
              </p>
              <p className="text-sm text-on-surface-variant mt-1">
                {uploadStatus ?? "Release to upload files to this Hive"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
