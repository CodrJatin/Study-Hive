"use client";

import React, { useRef, useTransition } from "react";
import { toast } from "sonner";
import { createTopic } from "@/actions/syllabus";

interface AddTopicFormProps {
  unitId: string;
  hiveId: string;
  unitIndex: number;
  currentTopicCount: number;
}

export function AddTopicForm({ unitId, hiveId, unitIndex, currentTopicCount }: AddTopicFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value.trim();
    if (!title) return;

    // ✅ Optimistic reset — user can type the next topic immediately
    formRef.current?.reset();

    startTransition(() => {
      toast.promise(
        (async () => {
          const result = await createTopic(unitId, hiveId, title);
          if (result && "error" in result && result.error) {
            throw new Error(result.error);
          }
        })(),
        {
          loading: `Adding topic "${title}"…`,
          success: `Topic "${title}" added!`,
          error: (err: Error) => err.message || "Failed to add topic",
        }
      );
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/50 border border-dashed border-outline-variant/20 hover:border-primary/25 transition-colors clay-inset"
    >
      <span className="text-[11px] font-black text-on-surface-variant/30 w-6 text-center shrink-0">
        {unitIndex + 1}.{currentTopicCount + 1}
      </span>
      <input
        name="title"
        type="text"
        placeholder="Add topic..."
        className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-on-surface placeholder:text-on-surface-variant/35"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={isPending}
        className="shrink-0 w-7 h-7 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-on-primary flex items-center justify-center transition-all disabled:opacity-50"
      >
        <span className={`material-symbols-outlined text-[16px] ${isPending ? "animate-spin" : ""}`}>
          {isPending ? "progress_activity" : "add"}
        </span>
      </button>
    </form>
  );
}
