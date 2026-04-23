"use client";

import React, { useOptimistic, useTransition } from "react";
import { toggleTopicStatus } from "@/actions/syllabus";
import { TopicStatus } from "@prisma/client";

export function MaterialTile({ material, hiveId }: { material: any, hiveId: string }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, addOptimisticStatus] = useOptimistic(
    material.completed,
    (state: boolean, newState: boolean) => newState
  );

  const handleToggle = () => {
    startTransition(async () => {
      // Optimistic toggle fires synchronously
      addOptimisticStatus(!optimisticStatus);
      // Pass the current UI status so the action derives the correct target status
      await toggleTopicStatus(
        material.id,
        optimisticStatus ? TopicStatus.COMPLETED : TopicStatus.NOT_STARTED,
        hiveId
      );
    });
  };

  return (
    <div className={`group bg-surface-container-lowest p-6 rounded-3xl transition-all duration-300 hover:bg-surface-container-low hover:scale-[1.01] flex flex-col md:flex-row gap-6 md:items-start clay-card ${optimisticStatus ? 'opacity-80' : ''}`}>
      <div className="shrink-0 pt-1">
        <button 
          onClick={handleToggle}
          disabled={isPending}
        >
          {optimisticStatus ? (
            <div className="relative flex items-center justify-center w-6 h-6 rounded border-2 border-primary bg-primary text-on-primary hover:bg-primary/80 transition-colors">
              <span className="material-symbols-outlined text-lg leading-none">check</span>
            </div>
          ) : (
            <div className="w-6 h-6 rounded border-2 border-outline-variant hover:border-primary transition-colors cursor-pointer"></div>
          )}
        </button>
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className={`text-xl font-bold ${optimisticStatus ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>{material.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-surface-container-high px-2 py-0.5 rounded text-[10px] font-bold text-stone-600 uppercase">
                {material.type}
              </span>
              <span className="text-stone-400 text-xs">• {material.details}</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-stone-300 group-hover:text-primary transition-colors cursor-pointer">
            description
          </span>
        </div>
        <p className="text-on-surface-variant text-sm leading-relaxed bg-surface-container-low p-4 rounded-xl italic border border-outline-variant/10">
          {material.instructions}
        </p>
      </div>
    </div>
  );
}
