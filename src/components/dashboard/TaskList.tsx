"use client";

import React, { useOptimistic, useTransition, useState } from "react";
import { toggleTaskComplete } from "@/actions/tasks";
import { Task } from "@prisma/client";
import Link from "next/link";

interface TaskListProps {
  initialTasks: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const [isPending, startTransition] = useTransition();
  // Adjusted Task type for relations
  type ExtendedTask = Task & { hive?: { title: string } | null; material?: { title: string } | null; };

  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    initialTasks as ExtendedTask[],
    (state: ExtendedTask[], updatedTask: { id: string; isCompleted: boolean }) =>
      state.map((task) =>
        task.id === updatedTask.id
          ? { ...task, isCompleted: updatedTask.isCompleted }
          : task
      )
  );

  const handleToggle = (taskId: string, currentStatus: boolean) => {
    startTransition(async () => {
      addOptimisticTask({ id: taskId, isCompleted: !currentStatus });
      await toggleTaskComplete(taskId, !currentStatus);
    });
  };

  if (optimisticTasks.length === 0) {
    return (
      <div className="p-6 text-center text-on-surface-variant clay-inset rounded-2xl">
        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">all_match</span>
        <p className="font-bold">All caught up!</p>
        <p className="text-sm">No pending tasks for today.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {optimisticTasks.map((task) => {
        let isOverdue = false;
        let dueDateText = "";
        
        if (task.dueDate) {
          const due = new Date(task.dueDate);
          const now = new Date();
          isOverdue = !task.isCompleted && due < now;
          dueDateText = new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
          }).format(due);
        }

        return (
          <li
            key={task.id}
            className={`flex items-center gap-4 p-5 rounded-[16px] transition-all bg-surface-container-lowest shadow-sm border border-outline-variant/10 ${
              task.isCompleted ? "opacity-60 grayscale" : ""
            }`}
          >
            <button
              onClick={() => handleToggle(task.id, task.isCompleted)}
              className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                task.isCompleted
                  ? "bg-primary border-primary text-on-primary"
                  : "border-primary text-transparent hover:bg-primary/10"
              }`}
            >
              {task.isCompleted && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
            </button>
            
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-[15px] text-on-background truncate ${task.isCompleted ? "line-through text-on-surface-variant" : ""}`}>
                {task.title}
              </p>
              
              <div className="flex items-center gap-1.5 mt-1 text-[13px]">
                {dueDateText && (
                  <span className={`font-bold ${isOverdue ? "text-error" : "text-primary"}`}>
                    Due {dueDateText}
                  </span>
                )}
                
                {task.hive && (
                  <>
                    <span className="text-outline-variant/30 px-1">•</span>
                    <span className="text-on-surface-variant font-medium truncate">{task.hive.title}</span>
                  </>
                )}
              </div>
            </div>
            
            {task.material && task.hiveId && task.materialId ? (
              <Link 
                href={`/hive/${task.hiveId}/materials/${task.materialId}`}
                className="hidden sm:flex items-center gap-1.5 bg-surface-container-low text-on-surface-variant text-[12px] font-bold px-3 py-1.5 rounded-lg border border-outline-variant/10 shrink-0 hover:bg-surface-container-high transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="material-symbols-outlined text-[14px]">description</span>
                {task.material.title}
              </Link>
            ) : task.material ? (
              <div className="hidden sm:flex items-center gap-1.5 bg-[#F6F4F0] text-[#4A4A4A] text-[12px] font-bold px-3 py-1.5 rounded-lg border border-[#E5E5E5] shrink-0">
                <span className="material-symbols-outlined text-[14px]">description</span>
                {task.material.title}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
