"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useHiveContext } from "@/components/providers/HiveProviders";
import { Permissions } from "@/lib/permissions";
import { deleteAnnouncement } from "@/actions/announcement";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { toast } from "sonner";

interface AnnouncementProps {
  id: string;
  hiveId: string;
  authorId: string;
  title: string;
  timeAgo: string;
  authorInitials: string;
  authorName: string;
  authorImage?: string | null;
  authorAvatarColor?: string;
  authorAvatarType?: string;
}

export function AnnouncementCard({ announcement }: { announcement: AnnouncementProps }) {
  const { role, userId } = useHiveContext();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isOptimisticallyDeleted, setIsOptimisticallyDeleted] = useState(false);

  const canDelete = Permissions.canEditOrDeleteItem(role, announcement.authorId, userId);

  const handleDelete = () => {
    setShowConfirm(false);
    setIsOptimisticallyDeleted(true);
    startDeleteTransition(() => {
      toast.promise(
        (async () => {
          const res = await deleteAnnouncement(announcement.hiveId, announcement.id);
          if (res?.error) throw new Error(res.error);
        })(),
        {
          loading: "Deleting announcement...",
          success: "Announcement deleted.",
          error: (err: Error) => {
            setIsOptimisticallyDeleted(false);
            return err.message || "Failed to delete announcement";
          },
        }
      );
    });
  };

  if (isOptimisticallyDeleted) return null;

  return (
    <>
      <article className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 transition-all hover:bg-surface-container group clay-card">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-lg font-headline font-bold text-on-background">{announcement.title}</h4>
          <div className="flex items-center gap-2">
            {canDelete && (
              <button
                onClick={() => setShowConfirm(true)}
                disabled={isDeleting}
                className="w-7 h-7 rounded bg-error/10 text-error hover:bg-error hover:text-on-error flex items-center justify-center transition-colors disabled:opacity-50"
                title="Delete announcement"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            )}
            <span className="text-xs font-medium text-on-surface/40 bg-surface-container-high px-2 py-1 rounded">
              {announcement.timeAgo}
            </span>
          </div>
        </div>
        
        {/* Maker Badge (moved to the right) */}
        <div className="flex items-center justify-end gap-3">
          <span className="text-sm font-semibold text-on-surface/80">{announcement.authorName}</span>
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-surface-container-lowest font-bold text-[10px] overflow-hidden shadow-sm"
            style={{ backgroundColor: announcement.authorAvatarColor || "#fdc003" }}
          >
            {announcement.authorImage && announcement.authorAvatarType === "image" ? (
              <Image 
                src={announcement.authorImage} 
                alt={announcement.authorName} 
                width={32}
                height={32}
                className="w-full h-full object-cover" 
              />
            ) : (
              announcement.authorInitials
            )}
          </div>
        </div>
      </article>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        isPending={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
