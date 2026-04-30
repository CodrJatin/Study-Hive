"use client";

import React, { useRef, useTransition } from "react";
import { toast } from "sonner";
import { updateHive } from "@/actions/hive";
import { useHiveContext } from "@/components/providers/HiveProviders";
import { Permissions } from "@/lib/permissions";

interface GeneralSettingsFormProps {
  hive: {
    id: string;
    title: string;
    subject: string;
    description: string | null;
  };
}

export function GeneralSettingsForm({ hive }: GeneralSettingsFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const { role } = useHiveContext();
  const canManage = Permissions.canManageHive(role);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = (formData.get("title") as string).trim();
    const subject = (formData.get("subject") as string).trim();
    const description = (formData.get("description") as string).trim();

    if (!title || !subject) {
      toast.error("Hive name and subject are required.");
      return;
    }

    startTransition(() => {
      toast.promise(
        (async () => {
          const result = await updateHive(hive.id, null, formData);
          if (result && "error" in result && result.error) {
            throw new Error(result.error);
          }
        })(),
        {
          loading: "Saving changes…",
          success: "Hive settings saved!",
          error: (err: Error) => err.message || "Failed to save settings",
        }
      );
    });
  }

  // Check if anything changed (for disabling the button)
  // Note: We still track this for the button disabled state, not to block inputs.
  const hasChanges = true; // optimistically allow saving anytime; server validates

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-surface-container-lowest rounded-3xl p-8 space-y-8 transition-all clay-card"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="title">
            Hive Name
          </label>
          <input
            id="title"
            name="title"
            className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-all outline-none"
            type="text"
            defaultValue={hive.title}
            disabled={!canManage}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="subject">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-all outline-none"
            type="text"
            defaultValue={hive.subject}
            disabled={!canManage}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-all outline-none"
          rows={4}
          defaultValue={hive.description || ""}
          disabled={!canManage}
        />
      </div>
      <div className="flex justify-end">
        {canManage && (
          <button
            type="submit"
            disabled={isPending}
            className={`cta-gradient text-white px-8 py-3 rounded-full font-bold transition-all active:scale-95 shadow-md flex items-center gap-2 ${
              isPending ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {isPending && (
              <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
            )}
            {isPending ? "Saving…" : "Save Changes"}
          </button>
        )}
      </div>
    </form>
  );
}
