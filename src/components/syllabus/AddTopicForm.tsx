"use client";
import { Icon } from "@/components/ui/Icon";
import React, { useRef, useTransition } from "react";
import { toast } from "sonner";
import { createTopic } from "@/actions/syllabus";
import { useHiveContext } from "@/components/providers/HiveProviders";
import { Permissions } from "@/lib/permissions";

interface AddTopicFormProps {
  unitId: string;
  hiveId: string;
}

export function AddTopicForm({ unitId, hiveId }: AddTopicFormProps) {
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
        <Icon name={isPending ? "sync" : "add"} className={`text-[16px] ${isPending ? "animate-spin" : ""}`} />
      </button>
    </form>
  );
}
