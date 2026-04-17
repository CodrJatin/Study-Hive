"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { createAnnouncement } from "@/actions/announcement";

interface NewAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  hiveId: string;
  userName: string;
}

export function NewAnnouncementModal({ 
  isOpen, 
  onClose, 
  hiveId,
  userName
}: NewAnnouncementModalProps) {
  const [state, action, isPending] = useActionState(createAnnouncement.bind(null, hiveId), null);
  const wasPending = useRef(false);

  // Close modal on success
  useEffect(() => {
    if (wasPending.current && !isPending && state === null) {
      onClose();
    }
    wasPending.current = isPending;
  }, [state, isPending, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1b1c1c]/30 backdrop-blur-xs"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <form 
        action={action} 
        className="w-full max-w-xl bg-surface-container-lowest rounded-4xl overflow-hidden shadow-[0px_12px_32px_rgba(27,28,28,0.06)] ring-1 ring-on-surface/5 flex flex-col relative z-10 clay-card animate-in fade-in zoom-in duration-300"
      >
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-10 py-8">
          <div>
            <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Create Announcement</h2>
            <p className="text-xs text-on-surface-variant font-medium mt-1">
              Posting as <span className="text-primary font-bold">{userName}</span>
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface/60"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Content */}
        <div className="px-10 pb-6 space-y-6">
          {state?.error && (
            <div className="bg-error/10 text-error px-4 py-3 rounded-xl text-sm font-medium">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-label font-semibold text-on-surface/60 px-1">
              Announcement Title
            </label>
            <input 
              name="title"
              className="w-full bg-surface-container-high border-none rounded-xl px-6 py-4 text-on-surface placeholder:text-on-surface/30 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all font-body outline-none" 
              placeholder="e.g., Upcoming Lab Session Details" 
              type="text" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="block text-sm font-label font-semibold text-on-surface/60">
                Content
              </label>
              <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Optional</span>
            </div>
            <textarea 
              name="content"
              className="w-full bg-surface-container-high border-none rounded-xl px-6 py-4 text-on-surface placeholder:text-on-surface/30 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all font-body resize-none outline-none" 
              placeholder="Write your announcement here (optional)..." 
              rows={5}
            ></textarea>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-10 py-8 bg-surface-container-low/50 flex justify-end items-center gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="px-8 py-3 text-on-surface/70 font-headline font-bold hover:text-on-surface transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isPending}
            className={`px-10 py-3 cta-gradient text-white rounded-full font-headline font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 ${
              isPending ? "opacity-70 scale-95 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isPending && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
            {isPending ? "Posting..." : "Post Announcement"}
          </button>
        </div>
      </form>
    </div>
  );
}
