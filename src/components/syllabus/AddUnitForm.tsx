"use client";

import React, { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { createUnit } from "@/actions/syllabus";
import { useHiveContext } from "@/components/providers/HiveProviders";
import { Permissions } from "@/lib/permissions";

export function AddUnitForm({ hiveId }: { hiveId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const { role } = useHiveContext();

  if (!Permissions.canAddItems(role)) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value.trim();
    if (!title) return;

    // ✅ Optimistic reset — the user can type the next unit immediately
    formRef.current?.reset();

    startTransition(() => {
      toast.promise(
        (async () => {
          const result = await createUnit(hiveId, title);
          if (result && "error" in result && result.error) {
            throw new Error(result.error);
          }
        })(),
        {
          loading: `Adding unit "${title}"…`,
          success: `Unit "${title}" added!`,
          error: (err: Error) => err.message || "Failed to add unit",
        }
      );
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
        className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-on-surface placeholder:text-on-surface-variant/40"
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
