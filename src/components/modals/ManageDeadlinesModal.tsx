"use client";
import { Icon } from "@/components/ui/Icon";
import React, { useRef, useTransition, useOptimistic } from "react";
import { toast } from "sonner";
import { addDeadline, deleteDeadline } from "@/actions/hive";

export interface DeadlineItem {
  id: string;
  title: string;
  dueDate: Date | string;
  creatorId: string | null;
}

interface ManageDeadlinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  hiveId: string;
  deadlines: DeadlineItem[];
}

import { useHiveContext } from "@/components/providers/HiveProviders";
import { Permissions } from "@/lib/permissions";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { useState } from "react";

export function ManageDeadlinesModal({ isOpen, onClose, hiveId, deadlines }: ManageDeadlinesModalProps) {
  const { role, userId } = useHiveContext();
  const formRef = useRef<HTMLFormElement>(null);
  const [isAdding, startAddTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState<{ id: string, title: string } | null>(null);

  const [optimisticDeadlines, removeOptimisticDeadline] = useOptimistic(
    deadlines,
    (current: DeadlineItem[], removedId: string) => current.filter((d) => d.id !== removedId)
  );

  if (!isOpen) return null;

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = (formData.get("title") as string).trim();

    // ✅ Reset form immediately
    formRef.current?.reset();

    startAddTransition(() => {
      toast.promise(
        (async () => {
          const result = await addDeadline(hiveId, null, formData);
          if (result && "error" in result && result.error) throw new Error(result.error);
        })(),
        {
          loading: `Adding "${title}"…`,
          success: `Deadline "${title}" added!`,
          error: (err: Error) => err.message || "Failed to add deadline",
        }
      );
    });
  }

  function confirmDelete(deadlineId: string, deadlineTitle: string) {
    setSelectedDeadline({ id: deadlineId, title: deadlineTitle });
    setShowConfirm(true);
  }

  function handleDelete() {
    if (!selectedDeadline) return;
    
    setShowConfirm(false);
    
    startDeleteTransition(async () => {
      try {
        removeOptimisticDeadline(selectedDeadline.id);
        
        const promise = deleteDeadline(hiveId, selectedDeadline.id).then((result) => {
          if (result && "error" in result && result.error) throw new Error(result.error);
          return result;
        });

        toast.promise(promise, {
          loading: `Removing "${selectedDeadline.title}"…`,
          success: `"${selectedDeadline.title}" removed.`,
          error: (err: Error) => err.message || "Failed to remove deadline",
        });
      } catch {
        // handled by toast
      }
    });
  }

  return (
    <>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-10 bg-surface-container-lowest rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden border border-outline-variant/20 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
            <div>
              <h2 className="text-2xl font-headline font-bold text-on-surface">Manage Deadlines</h2>
              <p className="text-sm text-on-surface-variant">Add or remove hive checkpoints</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors">
              <Icon name="close" className="text-on-surface-variant" />
            </button>
          </div>

          {/* Add Form */}
          <div className="p-6 bg-surface-container/30 border-b border-outline-variant/10">
            <form ref={formRef} onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="grow space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Task Title</label>
                <input name="title" required placeholder="e.g. Midterm Review"
                  className="w-full bg-surface-container-high border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-container outline-none" />
              </div>
              <div className="w-full sm:w-40 space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Due Date</label>
                <input name="dueDate" type="date" required
                  className="w-full bg-surface-container-high border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-container outline-none" />
              </div>
              <button type="submit" disabled={isAdding}
                className={`bg-primary text-on-primary w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-all ${isAdding ? "opacity-70 scale-95" : "hover:scale-110 active:scale-95"}`}>
                <Icon name={isAdding ? "sync" : "add"} className={`${isAdding ? "animate-spin" : ""}`} />
              </button>
            </form>
          </div>

          {/* Deadline List */}
          <div className="grow overflow-y-auto p-6 space-y-3">
            {optimisticDeadlines.length === 0 ? (
              <div className="py-20 text-center">
                <Icon name="event_available" className="text-4xl text-on-surface-variant/20 mb-2" />
                <p className="text-sm text-on-surface-variant/40 font-medium">No deadlines active</p>
              </div>
            ) : (
              optimisticDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl group border border-transparent hover:border-outline-variant/20 transition-all">
                  <div className="w-12 h-12 bg-surface-container-high rounded-xl flex flex-col items-center justify-center shadow-sm shrink-0">
                    <span className="text-[10px] uppercase font-bold text-primary">
                      {new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date(deadline.dueDate))}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(new Date(deadline.dueDate))}
                    </span>
                  </div>
                  <div className="grow min-w-0">
                    <h4 className="text-[16px] font-bold text-on-surface truncate pr-2">{deadline.title}</h4>
                    <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                      <Icon name="calendar_today" className="text-base" />
                      {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(deadline.dueDate))}
                    </p>
                  </div>
                  {Permissions.canEditOrDeleteItem(role, deadline.creatorId, userId) && (
                    <button
                      onClick={() => confirmDelete(deadline.id, deadline.title)}
                      className="w-8 h-8 rounded-lg text-on-surface-variant hover:bg-error/10 hover:text-error flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Icon name="delete" className="text-[20px]" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Remove Deadline"
        message={`Are you sure you want to remove "${selectedDeadline?.title}"?`}
        confirmText="Remove"
        isDestructive={true}
        isPending={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
