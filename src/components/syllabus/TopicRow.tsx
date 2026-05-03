"use client";

import React, { useOptimistic, useTransition, useState } from "react";
import { toggleTopicStatus, deleteTopic } from "@/actions/syllabus";
import { useParams } from "next/navigation";
import { useHiveContext } from "@/components/providers/HiveProviders";
import { Permissions } from "@/lib/permissions";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import type { ClientTopic, TopicStatus } from "@/types/client-prisma";

export function TopicRow({ topic, userStatus }: { topic: ClientTopic, userStatus: TopicStatus }) {
  const { hiveId } = useParams() as { hiveId: string };
  const { role, userId } = useHiveContext();
  const [, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isOptimisticallyDeleted, setIsOptimisticallyDeleted] = useState(false);
  const [optimisticStatus, addOptimisticStatus] = useOptimistic(
    userStatus,
    (state, newStatus: TopicStatus) => newStatus
  );

  const completed = optimisticStatus === "COMPLETED";

  const handleDelete = () => {
    setShowConfirm(false);
    setIsOptimisticallyDeleted(true);
    startDeleteTransition(() => {
      toast.promise(
        (async () => {
          const result = await deleteTopic(hiveId, topic.id);
          if (result && "error" in result && result.error) throw new Error(result.error);
        })(),
        {
          loading: `Deleting topic "${topic.title}"...`,
          success: `Topic "${topic.title}" deleted.`,
          error: (err: Error) => {
            setIsOptimisticallyDeleted(false);
            return err.message || "Failed to delete topic";
          },
        }
      );
    });
  };

  if (isOptimisticallyDeleted) return null;

  const handleToggle = () => {
    const nextStatus: TopicStatus = completed ? "NOT_STARTED" : "COMPLETED";
    startTransition(async () => {
      // Optimistic update fires synchronously before the network request
      addOptimisticStatus(nextStatus);
      // Pass optimisticStatus (current UI state) not topic.status (stale server value)
      await toggleTopicStatus(topic.id, optimisticStatus, hiveId);
    });
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors border border-outline-variant/10 clay-card group/topic">
        <div className="flex items-center gap-4">
          <div 
            onClick={handleToggle}
            className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
              completed 
                ? "border-primary-container bg-surface-container-lowest text-primary hover:bg-primary-fixed-dim/20 scale-105" 
                : "border-outline-variant bg-surface-container-lowest text-primary hover:bg-primary-fixed-dim/20"
            }`}
          >
            {completed && (
              <span className="material-symbols-outlined text-sm font-black text-primary">
                check
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${completed ? "text-on-surface-variant line-through opacity-70" : "text-on-surface"}`}>
              {topic.title}
            </span>
            <span className={`text-[10px] font-bold mt-0.5 uppercase tracking-wider ${completed ? 'text-primary' : 'text-on-surface-variant/60'}`}>
              {optimisticStatus.replace("_", " ")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {topic.duration && <span className="text-xs font-semibold text-on-surface/50">{topic.duration}</span>}
          {Permissions.canEditOrDeleteItem(role, topic.creatorId, userId) && (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isDeleting}
              className="w-7 h-7 rounded-lg text-on-surface-variant hover:bg-error/10 hover:text-error flex items-center justify-center transition-all opacity-0 group-hover/topic:opacity-100 disabled:opacity-50"
              title="Delete Topic"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          )}
          <span className="material-symbols-outlined text-on-surface-variant/40 text-lg">description</span>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Topic"
        message={`Are you sure you want to delete topic "${topic.title}"? This action cannot be undone.`}
        confirmText="Delete"
        isDestructive={true}
        isPending={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
