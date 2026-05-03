"use client";
import { Icon } from "@/components/ui/Icon";
import React, { useRef, useTransition } from "react";
import { toast } from "sonner";
import { createAnnouncement } from "@/actions/announcement";

interface NewAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  hiveId: string;
  userName: string;
}

export function NewAnnouncementModal({ isOpen, onClose, hiveId, userName }: NewAnnouncementModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = (formData.get("title") as string).trim();

    // ✅ Close immediately, no modal purgatory
    onClose();

    startTransition(() => {
      toast.promise(
        (async () => {
          const result = await createAnnouncement(hiveId, null, formData);
          if (result && "error" in result && result.error) throw new Error(result.error);
        })(),
        {
          loading: "Posting announcement…",
          success: `"${title}" posted!`,
          error: (err: Error) => err.message || "Failed to post announcement",
        }
      );
    });
  }

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center animate-in fade-in">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-surface-container-lowest rounded-4xl overflow-hidden shadow-[0px_12px_32px_rgba(27,28,28,0.06)] ring-1 ring-on-surface/5 flex flex-col relative z-10 clay-card animate-in fade-in zoom-in duration-300"
      >
        <div className="flex justify-between items-center px-10 py-8">
          <div>
            <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Create Announcement</h2>
            <p className="text-xs text-on-surface-variant font-medium mt-1">
              Posting as <span className="text-primary font-bold">{userName}</span>
            </p>
          </div>
          <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface/60">
            <Icon name="close" />
          </button>
        </div>

        <div className="px-10 pb-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-label font-semibold text-on-surface/60 px-1">Announcement Title</label>
            <input name="title" type="text" required placeholder="e.g., Upcoming Lab Session Details"
              className="w-full bg-surface-container-high border-none rounded-xl px-6 py-4 text-on-surface placeholder:text-on-surface/30 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all font-body outline-none" />
          </div>
        </div>

        <div className="px-10 py-5 bg-surface-container-low/50 flex justify-between items-center gap-4">
          <button type="button" onClick={onClose} className="px-8 py-3 text-on-surface/70 font-headline font-bold hover:text-on-surface transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isPending}
            className={`px-10 py-3 cta-gradient text-white rounded-full font-headline font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 ${isPending ? "opacity-70 scale-95 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"}`}>
            {isPending && <Icon name="progress_activity" className="animate-spin text-lg" />}
            {isPending ? "Posting…" : "Post Announcement"}
          </button>
        </div>
      </form>
    </div>
  );
}
