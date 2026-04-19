"use client";

import React, { useOptimistic, useTransition } from "react";
import { Topic, TopicStatus } from "@prisma/client";
import { toggleTopicStatus } from "@/actions/syllabus";
import { useParams } from "next/navigation";

export function TopicRow({ topic, index, unitIndex }: { topic: Topic, index: number, unitIndex: number }) {
  const { hiveId } = useParams() as { hiveId: string };
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, addOptimisticStatus] = useOptimistic(
    topic.status,
    (state, newStatus: TopicStatus) => newStatus
  );

  const completed = optimisticStatus === TopicStatus.COMPLETED;

  const handleToggle = () => {
    const nextStatus = completed ? TopicStatus.NOT_STARTED : TopicStatus.COMPLETED;
    startTransition(async () => {
      // Optimistic update fires synchronously before the network request
      addOptimisticStatus(nextStatus);
      // Pass optimisticStatus (current UI state) not topic.status (stale server value)
      await toggleTopicStatus(topic.id, optimisticStatus, hiveId);
    });
  };

  return (
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
            {unitIndex + 1}.{index + 1} {topic.title}
          </span>
          <span className={`text-[10px] font-bold mt-0.5 uppercase tracking-wider ${completed ? 'text-primary' : 'text-on-surface-variant/60'}`}>
            {optimisticStatus.replace('_', ' ')}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {topic.duration && <span className="text-xs font-semibold text-on-surface/50">{topic.duration}</span>}
        <span className="material-symbols-outlined text-on-surface-variant/40 text-lg">description</span>
      </div>
    </div>
  );
}
