"use client";

import React, { useRef, useTransition, useOptimistic } from "react";
import { createTopic } from "@/actions/syllabus";
import { Topic } from "@prisma/client";

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
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    if (!title.trim()) return;

    startTransition(async () => {
      await createTopic(unitId, hiveId, title);
      formRef.current?.reset();
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
        disabled={isPending}
        className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-on-surface placeholder:text-on-surface-variant/35 disabled:opacity-50"
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
