"use client";
import { Icon } from "@/components/ui/Icon";
import React, { useRef, useTransition } from "react";
import { toast } from "sonner";
import { updateHive } from "@/actions/hive";
import { useHiveContext } from "@/components/providers/HiveProviders";
import { Permissions } from "@/lib/permissions";

interface GeneralSettingsFormProps {
  hive: {
    id: string;
    title: string;
    icon: string;
    description: string | null;
  };
}

export function GeneralSettingsForm({ hive }: GeneralSettingsFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = React.useState(hive.title);
  const [description, setDescription] = React.useState(hive.description || "");
  const [selectedIcon, setSelectedIcon] = React.useState(hive.icon || "science");
  const { role } = useHiveContext();
  const canManage = Permissions.canManageHive(role);

  const hasChanges = 
    title.trim() !== hive.title.trim() || 
    description.trim() !== (hive.description || "").trim() || 
    selectedIcon !== hive.icon;

  const icons = [
    "science", "menu_book", "school", "psychology", "calculate",
    "biotech", "computer", "history_edu", "language", "terminal",
    "architecture", "brush", "music_note", "fitness_center", "account_balance",
    "gavel", "medication", "functions", "public", "stadium",
    "bolt", "memory", "electrical_services", "engineering", "construction",
    "foundation", "rocket_launch", "analytics", "code", "map"
  ];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("icon", selectedIcon);
    const titleVal = (formData.get("title") as string).trim();

    if (!titleVal) {
      toast.error("Hive name is required.");
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

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-surface-container-lowest rounded-3xl p-8 space-y-8 transition-all clay-card"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="title">
            Hive Name
          </label>
          <input
            id="title"
            name="title"
            className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-all outline-none text-on-surface"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!canManage || isPending}
            required
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-on-surface-variant px-1">
            Hive Icon
          </label>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 p-1 bg-surface-container rounded-2xl border border-outline-variant/10">
            {icons.map((icon) => (
              <button
                key={icon}
                type="button"
                disabled={!canManage || isPending}
                onClick={() => setSelectedIcon(icon)}
                className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all ${
                  selectedIcon === icon 
                    ? "bg-primary/15 text-primary shadow-sm scale-110" 
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                } ${!canManage || isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Icon name={icon} className="text-5xl" />
                </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-all outline-none text-on-surface"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!canManage || isPending}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-surface-container">
        {canManage && (
          <button
            type="submit"
            disabled={isPending || !hasChanges}
            className={`cta-gradient text-white px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${
              (isPending || !hasChanges) 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:opacity-90 hover:shadow-lg active:scale-95"
            }`}
          >
            {isPending && (
              <Icon name="progress_activity" className="text-lg animate-spin" />
            )}
            {isPending ? "Saving…" : "Save Changes"}
          </button>
        )}
      </div>
    </form>
  );
}
