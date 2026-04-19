"use client";

import React, { useRef, useTransition, useState } from "react";
import { createMaterial } from "@/actions/materials";
import { MaterialType } from "@prisma/client";

interface SmartPasteBarProps {
  hiveId: string;
}

function detectLabel(url: string): string {
  if (/youtube\.com|youtu\.be/i.test(url)) return "YouTube Video";
  if (/\.pdf$/i.test(url)) return "PDF Document";
  if (/\.docx?$|docs\.google/i.test(url)) return "Google Doc";
  return "Web Link";
}

export function SmartPasteBar({ hiveId }: SmartPasteBarProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const url = (form.elements.namedItem("url") as HTMLInputElement).value.trim();
    if (!url) return;

    setPreview("Fetching title...");
    startTransition(async () => {
      // Attempt to scrape title via our proxy route
      let title = detectLabel(url);
      try {
        const res = await fetch(`/api/fetch-title?url=${encodeURIComponent(url)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.title) title = data.title;
        }
      } catch {}

      await createMaterial(hiveId, title, MaterialType.LINK, url);
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
      <span className="material-symbols-outlined text-on-surface-variant text-xl shrink-0">
        link
      </span>
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
        <span className={`material-symbols-outlined text-[16px] ${isPending ? "animate-spin" : ""}`}>
          {isPending ? "progress_activity" : "add_link"}
        </span>
        {isPending ? "Saving..." : "Add Link"}
      </button>
    </form>
  );
}
