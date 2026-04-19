"use client";

import React, { useState, useTransition, useRef } from "react";
import { updateMaterial, deleteMaterial } from "@/actions/materials";
import { ConfirmModal } from "@/components/modals/ConfirmModal";

interface Material {
  id: string;
  title: string;
  url: string | null;
  videoRange?: string | null;
  hiveId: string;
}

interface EditMaterialModalProps {
  material: Material;
  isPlaylist: boolean;
  onClose: () => void;
}

export function EditMaterialModal({ material, isPlaylist, onClose }: EditMaterialModalProps) {
  const [title, setTitle] = useState(material.title);
  const [url, setUrl] = useState(material.url ?? "");
  const [videoRange, setVideoRange] = useState(material.videoRange ?? "");
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const wasSuccessful = useRef(false);

  // Close only after successful save or delete
  React.useEffect(() => {
    if (!isPending && wasSuccessful.current) {
      onClose();
    }
  }, [isPending, onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updateMaterial(material.id, {
        title: title.trim() || undefined,
        url: url.trim() || undefined,
        videoRange: isPlaylist ? videoRange : undefined,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        wasSuccessful.current = true;
      }
    });
  }

  function handleDelete() {
    setShowConfirmDelete(true);
  }

  function confirmDelete() {
    startTransition(async () => {
      const result = await deleteMaterial(material.hiveId, material.id);
      if (result?.error) {
        setError(result.error);
        setShowConfirmDelete(false);
      } else {
        wasSuccessful.current = true;
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1b1c1c]/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-4xl shadow-2xl ring-1 ring-on-surface/5 clay-card z-10 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-4">
          <div>
            <h2 className="text-xl font-headline font-bold text-on-surface tracking-tight">
              Edit Material
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              {isPlaylist ? "Playlist" : "Material"} settings
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface/60"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
          {error && (
            <div className="bg-error/10 text-error text-sm font-medium px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-on-surface/60 mb-1.5 px-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
              className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-sm font-medium text-on-surface outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-50 clay-inset"
              placeholder="Material title"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-bold text-on-surface/60 mb-1.5 px-1">
              Link / URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isPending}
              className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-sm font-medium text-on-surface outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-50 clay-inset font-mono"
              placeholder="https://..."
            />
          </div>

          {/* Video Range — only for playlists */}
          {isPlaylist && (
            <div>
              <label className="block text-xs font-bold text-on-surface/60 mb-1.5 px-1">
                Video Range
                <span className="text-on-surface-variant/40 font-medium ml-1">(leave empty to use all videos)</span>
              </label>
              <input
                type="text"
                value={videoRange}
                onChange={(e) => setVideoRange(e.target.value)}
                disabled={isPending}
                className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-sm font-medium text-on-surface outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-50 clay-inset font-mono"
                placeholder="e.g., 1-10 14 20"
              />
              <p className="text-xs text-on-surface-variant/50 mt-1.5 px-1">
                Use ranges like <code className="bg-surface-container-high px-1 rounded">1-5</code> and
                singles like <code className="bg-surface-container-high px-1 rounded">10</code>,
                space or comma separated.
                Duration will be recalculated from the cached playlist.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-error hover:bg-error/10 transition-colors flex items-center gap-2"
              title="Delete material"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
              Delete
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className={`px-6 py-2.5 cta-gradient text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all ${
                  isPending ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {isPending && (
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                )}
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={showConfirmDelete}
        title="Delete Material"
        message="Are you sure you want to delete this material? This action cannot be undone."
        confirmText="Delete"
        isPending={isPending}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </div>
  );
}
