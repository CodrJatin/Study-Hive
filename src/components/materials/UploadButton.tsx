"use client";

import React, { useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { createMaterial } from "@/actions/materials";
import { MaterialType } from "@prisma/client";
import { toast } from "sonner";

interface UploadButtonProps {
  hiveId?: string;
  variant?: "primary" | "secondary" | "ghost";
}

export function UploadButton({ hiveId, variant = "primary" }: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const supabase = createClient();
    const targetHiveId = hiveId && hiveId.trim() !== "" ? hiveId : undefined;
    
    let successCount = 0;
    let failCount = 0;

    const uploadToast = toast.loading(`Uploading ${files.length} file(s)...`);

    for (const file of Array.from(files)) {
      try {
        const path = `${targetHiveId ?? "personal"}/${Date.now()}-${file.name}`;

        const { error: storageError } = await supabase.storage
          .from("hive-materials")
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (storageError) {
          console.error("Storage Error:", storageError);
          failCount++;
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

        const result = await createMaterial(
          file.name.replace(/\.[^.]+$/, ""),
          type,
          targetHiveId,
          publicData.publicUrl,
          file.size
        );

        if (result?.error) {
          console.error("Database Error:", result.error);
          failCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        failCount++;
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (failCount === 0) {
      toast.success(`Successfully uploaded ${successCount} file(s)`, { id: uploadToast });
    } else if (successCount > 0) {
      toast.warning(`Uploaded ${successCount} files, but ${failCount} failed.`, { id: uploadToast });
    } else {
      toast.error("Failed to upload files. Please try again.", { id: uploadToast });
    }
  };

  const getButtonStyle = () => {
    switch (variant) {
      case "secondary":
        return "bg-surface-container-high text-on-surface hover:bg-surface-container-highest";
      case "ghost":
        return "bg-transparent text-primary hover:bg-primary/5";
      default:
        return "cta-gradient text-on-primary shadow-lg shadow-primary/20 hover:opacity-90";
    }
  };

  return (
    <>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.mp4,.mov,.webm"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-headline font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${getButtonStyle()}`}
      >
        <span className={`material-symbols-outlined text-xl ${isUploading ? "animate-spin" : ""}`}>
          {isUploading ? "progress_activity" : "upload_file"}
        </span>
        {isUploading ? "Uploading..." : "Upload Files"}
      </button>
    </>
  );
}
