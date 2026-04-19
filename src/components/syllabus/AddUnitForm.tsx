"use client";

import React, { useRef, useTransition } from "react";
import { createUnit } from "@/actions/syllabus";

export function AddUnitForm({ hiveId }: { hiveId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    if (!title.trim()) return;

    startTransition(async () => {
      await createUnit(hiveId, title);
      formRef.current?.reset();
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/30 hover:border-primary/30 transition-colors clay-inset mt-4"
    >
      <span className="material-symbols-outlined text-on-surface-variant text-xl shrink-0">
        add_circle
      </span>
      <input
        name="title"
        type="text"
        placeholder="Add a new unit — press Enter to save"
        disabled={isPending}
        className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-on-surface placeholder:text-on-surface-variant/40 disabled:opacity-50"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={isPending}
        className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-on-primary flex items-center justify-center transition-all disabled:opacity-50"
      >
        <span className={`material-symbols-outlined text-[18px] ${isPending ? "animate-spin" : ""}`}>
          {isPending ? "progress_activity" : "arrow_upward"}
        </span>
      </button>
    </form>
  );
}
