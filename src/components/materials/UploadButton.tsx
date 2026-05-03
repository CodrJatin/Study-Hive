"use client";
import { Icon } from "@/components/ui/Icon";
import React, { useRef, useState, useContext } from "react";
import { toast } from "sonner";
import { HiveContext } from "@/components/providers/HiveProviders";
import { Permissions } from "@/lib/permissions";

interface UploadButtonProps {
  hiveId?: string;
  variant?: "primary" | "secondary" | "ghost";
}

import { ConfirmUploadModal } from "@/components/modals/ConfirmUploadModal";
import { uploadFiles } from "@/utils/upload-utils";

export function UploadButton({ hiveId, variant = "primary" }: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const hiveContext = useContext(HiveContext);

  if (hiveContext && !Permissions.canAddItems(hiveContext.role)) {
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setSelectedFiles(Array.from(files));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confirmUpload = async () => {
    if (!selectedFiles) return;
    const files = selectedFiles;
    setSelectedFiles(null);
    setIsUploading(true);

    const partial = () =>
      (globalThis as { __lastUploadPartial?: { successCount: number; total: number } })
        .__lastUploadPartial;

    toast.promise(uploadFiles(files, hiveId), {
      loading: files.length === 1
        ? `Uploading "${files[0].name}"…`
        : `Uploading ${files.length} files…`,
      success: () => {
        setIsUploading(false);
        const p = partial();
        if (p && p.successCount < p.total) {
          return `Uploaded ${p.successCount} of ${p.total} files (some failed)`;
        }
        return files.length === 1
          ? `"${files[0].name}" added!`
          : `${files.length} files added!`;
      },
      error: (err: Error) => {
        setIsUploading(false);
        return err.message || "Upload failed";
      },
    });
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
        <Icon name={isUploading ? "sync" : "upload"} className={`text-xl ${isUploading ? "animate-spin" : ""}`} />
        {isUploading ? "Uploading..." : "Upload Files"}
      </button>

      {selectedFiles && (
        <ConfirmUploadModal
          files={selectedFiles}
          onConfirm={confirmUpload}
          onCancel={() => setSelectedFiles(null)}
        />
      )}
    </>
  );
}

