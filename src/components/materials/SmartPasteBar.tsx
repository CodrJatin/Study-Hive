"use client";
import { Icon } from "@/components/ui/Icon";
import React, { useRef, useTransition, useState, useContext } from "react";
import { createSmartMaterial } from "@/actions/materials";
import { HiveContext } from "@/components/providers/HiveProviders";
import { Permissions } from "@/lib/permissions";

interface SmartPasteBarProps {
  hiveId?: string;
}


export function SmartPasteBar({ hiveId }: SmartPasteBarProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);
  const hiveContext = useContext(HiveContext);

  if (hiveContext && !Permissions.canAddItems(hiveContext.role)) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const url = (form.elements.namedItem("url") as HTMLInputElement).value.trim();
    if (!url) return;

    setPreview("Fetching title...");
    startTransition(async () => {
      // Attempt to scrape title via our proxy route
      try {
        const res = await fetch(`/api/fetch-title?url=${encodeURIComponent(url)}`);
        if (res.ok) {
          await res.json();
          // We could use the result here if createSmartMaterial supported it
        }
      } catch {}

      await createSmartMaterial(url, hiveId);
      formRef.current?.reset();
      setPreview(null);
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-low clay-inset border border-outline-variant/10 w-full"
    >
      <Icon name="link" className="text-on-surface-variant text-xl shrink-0" />
      <div className="flex-1 min-w-0">
        <input
          name="url"
          type="url"
          placeholder="Paste any link — YouTube, PDF, article — and hit Enter"
          disabled={isPending}
          className="w-full bg-transparent border-none outline-none text-sm font-medium text-on-surface placeholder:text-on-surface-variant/40 disabled:opacity-50"
          autoComplete="off"
        />
        {preview && (
          <p className="text-xs text-primary/70 mt-0.5 truncate">{preview}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="shrink-0 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-on-primary flex items-center gap-1.5 text-xs font-bold transition-all disabled:opacity-50 whitespace-nowrap"
      >
        <Icon name={isPending ? "sync" : "link"} className={`text-[16px] ${isPending ? "animate-spin" : ""}`} />
        {isPending ? "Saving..." : "Add Link"}
      </button>
    </form>
  );
}
